const db = require('../db');
const bcrypt = require('bcryptjs');
const ApiError = require('../exceptions/api_error');

class AdminService {
    async getAllModerators() {
        const moderators = (await db.query("SELECT * FROM Users WHERE user_role LIKE 'MODERATOR' ORDER BY user_id")).rows;
        return moderators;
    }

    async createModerator(username, email, password) {
        const usernameExists = (await db.query('SELECT * FROM Users WHERE user_name LIKE $1', [username])).rows.length > 0;
        if (usernameExists) {
            throw ApiError.BadRequest('Учетная запись с таким именем уже существует!');
        }
        const emailExists = (await db.query('SELECT * FROM Users WHERE user_email LIKE $1', [email])).rows.length > 0;
        if (emailExists) {
            throw ApiError.BadRequest('На данную почту уже заведена учетная запись!');
        }
        const hashPassword = bcrypt.hashSync(password, 7);
        const newUser = (await db.query('INSERT INTO Users (user_name, user_email, user_password, user_role) VALUES ($1, $2, $3, $4) RETURNING *', [username, email, hashPassword, "MODERATOR"])).rows[0];
        return newUser;
    }

    async updateModerator(id, username, email) {
        const user = (await db.query('SELECT * FROM Users WHERE user_id = $1', [id])).rows;
        if (user[0].user_role !== 'MODERATOR') {
            throw ApiError.BadRequest('Выбранный пользователь не является модератором!');
        }
        if (user[0].user_name === username && user[0].user_email === email) {
            throw ApiError.BadRequest('Вы не изменили данные!');
        }
        const usernameExists = (await db.query('SELECT * FROM Users WHERE user_name LIKE $1 AND NOT (user_id = $2)', [username, id])).rows.length > 0;
        if (usernameExists) {
            throw ApiError.BadRequest('Учетная запись с таким именем уже существует!');
        }
        const emailExists = (await db.query('SELECT * FROM Users WHERE user_email LIKE $1 AND NOT (user_id = $2)', [email, id])).rows.length > 0;
        if (emailExists) {
            throw ApiError.BadRequest('На данную почту уже заведена учетная запись!');
        }
        const updatedUser = (await db.query('UPDATE Users SET user_name = $1, user_email = $2 WHERE user_id = $3 RETURNING *', [username, email, id])).rows[0];
        return updatedUser;
    }

    async deleteModerator(id) {
        const user = (await db.query('SELECT * FROM Users WHERE user_id = $1', [id])).rows;
        if (user[0].user_role !== 'MODERATOR') {
            throw ApiError.BadRequest('Выбранный пользователь не является модератором!');
        }
        const deletedUser = (await db.query('DELETE FROM Users WHERE user_id = $1 RETURNING *', [id])).rows[0];
        return deletedUser;
    }
}

module.exports = new AdminService();