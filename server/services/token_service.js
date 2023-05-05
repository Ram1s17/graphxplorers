const jwt = require('jsonwebtoken');
const db = require('../db');

class TokenService {
    genereteTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        };
    }

    genereteResetToken(payload, secret) {
        return jwt.sign(payload, secret, { expiresIn: '15m' });
    }

    genereteConfirmationToken(payload, secret) {
        return jwt.sign(payload, secret, { });
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateLinkToken(token, secret) {
        try {
            const userData = jwt.verify(token, secret);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const isTokenExists = (await db.query('SELECT * FROM User_Tokens WHERE user_id = $1', [userId])).rows.length > 0;
        if (isTokenExists) {
            return (await db.query('UPDATE User_Tokens SET refresh_token = $1 WHERE user_id = $2 RETURNING *', [refreshToken, userId])).rows[0];
        }
        const token = (await db.query("INSERT INTO User_Tokens (refresh_token, user_id) VALUES ($1, $2) RETURNING *", [refreshToken, userId])).rows[0];
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = (await db.query("DELETE FROM User_Tokens WHERE refresh_token LIKE $1 RETURNING *", [refreshToken])).rows[0];
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = (await db.query("SELECT * FROM User_Tokens WHERE refresh_token LIKE $1", [refreshToken])).rows[0];
        return tokenData;
    }
}

module.exports = new TokenService();