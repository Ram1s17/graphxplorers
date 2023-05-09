const db = require('../db');
const ApiError = require('../exceptions/api_error');

class ProblemManagementService {
    async getAllProblems() {
        const problems = (await db.query("SELECT * FROM problems ORDER BY problem_id")).rows;
        return problems;
    }

    async getProblem(id) {
        const problem = (await db.query("SELECT * FROM problems WHERE problem_id = $1", [id])).rows;
        if (problem.length === 0) {
            throw ApiError.BadRequest('Задача не найдена!');
        }
        return problem[0];
    }

    async createProblem(problem) {
        const newProblem = (await db.query("INSERT INTO problems (complexity, points, graph, evaluation_criteria) VALUES($1, $2, $3, $4) RETURNING *", [
            problem.complexity,
            problem.points,
            problem.graph,
            problem.evaluationCriteria
        ])).rows[0];
        return newProblem;
    }

    async updateProblem(id, problem) {
        const searchedProblem = (await db.query('SELECT * FROM problems WHERE problem_id = $1', [id])).rows;
        if (searchedProblem.length === 0) {
            throw ApiError.BadRequest('Такой задачи не существует!');
        }
        const updatedProblem = (await db.query("UPDATE problems SET complexity = $1, points = $2, graph = $3, evaluation_criteria = $4 WHERE problem_id = $5 RETURNING *", [
            problem.complexity,
            problem.points,
            problem.graph,
            problem.evaluationCriteria,
            id
        ])).rows[0];
        return updatedProblem;
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