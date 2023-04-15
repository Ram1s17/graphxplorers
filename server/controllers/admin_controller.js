const adminService = require('../services/admin_service');

class AdminController {
    async getAllModerators(req, res, next) {
        try {
            const moderators = await adminService.getAllModerators();
            return res.status(200).json(moderators);
        }
        catch (e) {
            next(e);
        }
    }

    async createModerator(req, res, next) {
        try {
            const { username, password, email } = req.body;
            const newModerator = await adminService.createModerator(username, email, password);
            return res.status(200).json({
                message: "Учетная запись создана",
                user_id: newModerator.user_id,
                user_name: newModerator.user_name,
                user_email: newModerator.user_email
            });
        }
        catch (e) {
            next(e);
        }
    }

    async updateModerator(req, res, next) {
        try {
            const { id, username, email } = req.body;
            const updatedModerator = await adminService.updateModerator(id, username, email);
            return res.status(200).json({
                message: "Данные учетной записи обновлены",
                user_id: updatedModerator.user_id,
                user_name: updatedModerator.user_name,
                user_email: updatedModerator.user_email
            });
        }
        catch (e) {
            next(e);
        }
    }

    async deleteModerator(req, res, next) {
        try {
            const { id } = req.body;
            const deletedModerator = await adminService.deleteModerator(id);
            return res.status(200).json({
                message: `Учетная запись модератора ${deletedModerator.user_name} удалена`,
                user_id: deletedModerator.user_id
            });
        }
        catch (e) {
            next(e);
        }
    }
}

module.exports = new AdminController();