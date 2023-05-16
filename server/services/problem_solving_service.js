const db = require('../db');
const ApiError = require('../exceptions/api_error');

class ProblemSolvingService {
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

    async saveResult(result) {
        await db.query("INSERT INTO results_of_solving_problems (date_of_solving, spent_time, count_of_steps, count_of_mistakes, stage_mistakes, result_points, total_points, user_id, problem_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            [result.dateOfSolving,
            result.spentTime,
            result.countOfSteps,
            result.countOfMistakes,
            result.stageMistakes,
            result.resultPoints,
            result.totalPoints,
            result.userId,
            result.problemId]);
    }
}

module.exports = new ProblemSolvingService();