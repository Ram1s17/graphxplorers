const db = require('../db');

class AdminService {
    async getAllModerators() {
        const moderators = (await db.query("SELECT * FROM Users WHERE user_role LIKE 'MODERATOR'")).rows;
        return moderators;
    }
}

module.exports = new AdminService();