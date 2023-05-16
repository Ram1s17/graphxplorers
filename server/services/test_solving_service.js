const db = require('../db');
const ApiError = require('../exceptions/api_error');

class TestSolvingService {
    async getQuestionsCount() {
        const totalCount = Number((await db.query("SELECT COUNT(*) FROM questions")).rows[0].count);
        const totalCountTheoretical = Number((await db.query("SELECT COUNT(*) FROM questions WHERE question_type LIKE 'теоретический'")).rows[0].count);
        const totalCountInteractive = Number((await db.query("SELECT COUNT(*) FROM questions WHERE question_type LIKE 'интерактивный'")).rows[0].count);
        return {
            total: totalCount,
            theoretical: totalCountTheoretical,
            interactive: totalCountInteractive
        };
    }

    async getQuestions(type) {
        let questions = null;
        if (type === 'theoretical') {
            questions = (await db.query("SELECT * FROM questions WHERE question_type LIKE 'теоретический'")).rows;
        }
        else if (type === 'interactive') {
            questions = (await db.query("SELECT * FROM questions WHERE question_type LIKE 'интерактивный'")).rows;
        }
        else {
            questions = (await db.query("SELECT * FROM questions")).rows;
        }
        return questions;
    }

    async saveResult(result) {
        await db.query("INSERT INTO results_of_solving_tests (date_of_solving, spent_time, type_of_test, count_of_questions, result_points, total_points, user_id) VALUES($1, $2, $3, $4, $5, $6, $7)",
            [result.dateOfSolving,
            result.spentTime,
            result.typeOfTest,
            result.countOfQuestions,
            result.resultPoints,
            result.totalPoints,
            result.userId]);
    }
}

module.exports = new TestSolvingService();