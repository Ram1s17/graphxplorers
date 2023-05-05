const authService = require('../services/auth_service');

class AuthController {
    async registration(req, res, next) {
        try {
            const { username, password, email } = req.body;
            const userData = await authService.registration(username, email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.status(200).json({ accessToken: userData.accessToken, userId: userData.userId, userRole: userData.userRole, isConfirmed: userData.isConfirmed });
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const userData = await authService.login(username, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.status(200).json({ accessToken: userData.accessToken, userId: userData.userId, userRole: userData.userRole, isConfirmed: userData.isConfirmed });
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await authService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.status(200).json(token);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await authService.refresh(refreshToken);
            return res.status(200).json({ accessToken: userData.accessToken, userId: userData.userId, userRole: userData.userRole, isConfirmed: userData.isConfirmed });
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const confirmationLink = req.params.link;
            await authService.activate(confirmationLink);
            return res.send(`<h1 style='text-align: center;'>Почта подтверждена</h1>`);
        } catch (e) {
            return res.send(`<h1 style='text-align: center;'>${e?.message}</h1>`);
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            await authService.forgotPassword(email);
            return res.status(200).json('Письмо со ссылкой выслано Вам на почту');
        }
        catch (e) {
            next(e);
        }
    }

    async checkResetLink(req, res, next) {
        try {
            const { id, token } = req.body;
            await authService.checkResetLink(id, token);
            return res.status(200); 
        }
        catch (e) {
            next(e);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { id, token, newPassword } = req.body;
            await authService.resetPassword(id, token, newPassword);
            return res.status(200).json('Пароль успешно обновлен');
        }
        catch (e) {
            next(e);
        }
    }
}

module.exports = new AuthController();