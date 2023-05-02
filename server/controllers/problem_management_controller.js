const problemManagementService = require('../services/problem_management_service');
const problemSolvingUtil = require('../utils/problem_solving_util');

class ProblemManagementController {
    async getAllProblems(req, res, next) {
        try {
            const problems = await problemManagementService.getAllProblems();
            const processedProblems = problemSolvingUtil.convertProblem(problems);
            return res.status(200).json(processedProblems);
        }
        catch (e) {
            next(e);
        }
    }

    async deleteProblem(req, res, next) {
        try {
            const { id } = req.body;
            const deletedProblem = await problemManagementService.deleteProblem(id);
            return res.status(200).json({
                message: `Задача #${deletedProblem.problem_id} удалена`,
                problem_id: deletedProblem.problem_id
            });
        }
        catch (e) {
            next(e);
        }
    }
}

module.exports = new ProblemManagementController();