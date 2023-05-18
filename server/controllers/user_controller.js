const userService = require('../services/user_service');

class UserController {
    async getUserInfo(req, res, next) {
        try {
            const { id } = req.params;
            const personalInfo = await userService.getUserInfo(id);
            const testResults = await userService.getResultsOfSolvingTests(id);
            const problemResults = await userService.getResultsOfSolvingProblems(id);
            const totalPointsForSolvingTests = await userService.getTotalPointsForSolvingTests(id);
            const totalPointsForSolvingProblems = await userService.getTotalPointsForSolvingProblems(id);
            return res.status(200).json({
                personalInfo,
                testResults,
                problemResults,
                totalPoints: {
                    totalPointsForSolvingTests,
                    totalPointsForSolvingProblems
                }
            });
        }
        catch (e) {
            next(e);
        }
    }

    async updatePersonalInfo(req, res, next) {
        try {
            const { id, username, email, password, isEmailConfirmed } = req.body;
            const updatedUser = await userService.updatePersonalInfo(id, username, email, password, isEmailConfirmed);
            return res.status(200).json({
                message: "Данные учетной записи обновлены",
                user_name: updatedUser.user_name,
                user_email: updatedUser.user_email,
                is_confirmed: updatedUser.is_confirmed
            });
        }
        catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();