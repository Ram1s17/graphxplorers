const adminService = require('../services/admin_service');

class AdminController {
    async getAllModerators(req, res, next) {
        const moderators = await adminService.getAllModerators();
        return res.status(200).json(moderators);
    }
}

module.exports = new AdminController();