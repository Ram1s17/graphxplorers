const db = require('../db');
const ApiError = require('../exceptions/api_error');

class ProblemManagementService {
    async getAllProblems() {
        const problems = (await db.query("SELECT * FROM problems ORDER BY problem_id")).rows;
        return problems;
    }

    async deleteProblem(id) {
        const problem = (await db.query('SELECT * FROM problems WHERE problem_id = $1', [id])).rows;
        if (problem.length === 0) {
            throw ApiError.BadRequest('Такой задачи не существует!');
        }
        const deletedProblem = (await db.query('DELETE FROM problems WHERE problem_id = $1 RETURNING *', [id])).rows[0];
        return deletedProblem;
    }
}

module.exports = new ProblemManagementService();