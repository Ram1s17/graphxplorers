const db = require('../db');
const bcrypt = require('bcryptjs');
const tokenService = require('./token_service');
const mailService = require('./mail_service')
const ApiError = require('../exceptions/api_error');

class AuthService {
    async registration(username, email, password) {
        const isUsernameExists = (await db.query('SELECT * FROM Users WHERE user_name LIKE $1', [username])).rows.length > 0;
        if (isUsernameExists) {
            throw ApiError.BadRequest('Учетная запись с таким именем уже существует!');
        }
        const isEmailExists = (await db.query('SELECT * FROM Users WHERE user_email LIKE $1', [email])).rows.length > 0;
        if (isEmailExists) {
            throw ApiError.BadRequest('На данную почту уже заведена учетная запись!');
        }
        const hashPassword = bcrypt.hashSync(password, 7);
        const newUser = (await db.query('INSERT INTO Users (user_name, user_email, user_password, user_role) VALUES ($1, $2, $3, DEFAULT) RETURNING *', [username, email, hashPassword])).rows[0];
        const tokens = tokenService.genereteTokens({
            id: newUser.user_id,
            role: newUser.user_role
        });
        await tokenService.saveToken(newUser.user_id, tokens.refreshToken);
        return { ...tokens, userId: newUser.user_id, userRole: newUser.user_role };
    }

    async login(username, password) {
        const user = (await db.query('SELECT * FROM Users WHERE user_name LIKE $1', [username])).rows;
        if (user.length === 0) {
            throw ApiError.BadRequest('Учетная запись не найдена! Неправильное имя пользователя и/или пароль!');
        }
        const isValidPassword = bcrypt.compareSync(password, user[0].user_password);
        if (!isValidPassword) {
            throw ApiError.BadRequest('Учетная запись не найдена! Неправильное имя пользователя и/или пароль!');
        }
        const tokens = tokenService.genereteTokens({
            id: user[0].user_id,
            role: user[0].user_role
        });
        await tokenService.saveToken(user[0].user_id, tokens.refreshToken);
        return { ...tokens, userId: user[0].user_id, userRole: user[0].user_role };
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = (await db.query('SELECT * FROM Users WHERE user_id = $1', [userData.id])).rows;
        const tokens = tokenService.genereteTokens({
            id: user[0].user_id,
            role: user[0].user_role
        });
        return { ...tokens, userId: user[0].user_id, userRole: user[0].user_role };
    }

    async forgotPassword(email) {
        const user = (await db.query('SELECT * FROM Users WHERE user_email LIKE $1', [email])).rows;
        if (user.length === 0) {
            throw ApiError.BadRequest('К данной почте не привязана учетная запись!');
        }
        if (user[0].user_role === 'MODERATOR') {
            throw ApiError.BadRequest('Сброс пароля невозможен!');
        }
        const resetToken = tokenService.genereteResetToken({ userId: user[0].user_id }, user[0].user_password);
        const resetLink = `${process.env.CLIENT_URL}/reset_password/${user[0].user_id}/${resetToken}`;
        mailService.sendResetLink(email, user[0].user_name, resetLink);
    }

    async checkResetLink(id, token) {
        const user = (await db.query('SELECT * FROM Users WHERE user_id = $1', [id])).rows;
        if (user.length === 0) {
            throw ApiError.BadRequest('Ссылка недействительна!');
        }
        const userData = tokenService.validateResetToken(token, user[0].user_password);
        if (!userData || userData.userId != id) {
            throw ApiError.BadRequest('Ссылка недействительна!');
        }
    }

    async resetPassword(id, token, newPassword) {
        this.checkResetLink(id, token);
        const hashPassword = bcrypt.hashSync(newPassword, 7);
        await db.query('UPDATE Users SET user_password = $1 WHERE user_id = $2', [hashPassword, id]);
    }
}

module.exports = new AuthService();