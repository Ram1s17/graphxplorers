const db = require('../db');
const ApiError = require('../exceptions/api_error');

class QuestionManagementService {
    async getAllQuestions() {
        const questions = (await db.query("SELECT * FROM questions ORDER BY question_id")).rows;
        return questions;
    }

    async getTheoryQuestion(id) {
        const question = (await db.query("SELECT * FROM questions WHERE question_id = $1 AND question_type LIKE 'теоретический'", [id])).rows;
        if (question.length === 0) {
            throw ApiError.BadRequest('Вопрос не найден!');
        }
        return question[0];
    }

    async createTheoryQuestion(question) {
        let isFound = false;
        for (let q of question.content.options) {
            if (q.isTrue) {
                isFound = true;
            }
        }
        if (!isFound) {
            throw ApiError.BadRequest('Не указан правильный вариант ответа!');
        }
        const newTheoryQuestion = (await db.query("INSERT INTO questions (question_type, question_subtype, question_points, question_text, question_content) VALUES($1, NULL, $2, $3, $4) RETURNING *", [
            "теоретический",
            question.points,
            question.text,
            question.content
        ])).rows[0];
        return newTheoryQuestion;
    }

    async updateTheoryQuestion(id, question) {
        const searchedQuestion = (await db.query("SELECT * FROM questions WHERE question_id = $1 AND question_type LIKE 'теоретический'", [id])).rows;
        if (searchedQuestion.length === 0) {
            throw ApiError.BadRequest('Такого теоретического вопроса не существует!');
        }
        let isFound = false;
        for (let q of question.content.options) {
            if (q.isTrue) {
                isFound = true;
            }
        }
        if (!isFound) {
            throw ApiError.BadRequest('Не указан правильный вариант ответа!');
        }
        const updatedTheoryQuestion = (await db.query("UPDATE questions SET question_points = $1, question_text = $2, question_content = $3 WHERE question_id = $4 RETURNING *", [
            question.points,
            question.text,
            question.content,
            id
        ])).rows[0];
        return updatedTheoryQuestion;
    }

    async deleteQuestion(id) {
        const question = (await db.query('SELECT * FROM questions WHERE question_id = $1', [id])).rows;
        if (question.length === 0) {
            throw ApiError.BadRequest('Такого вопроса не существует!');
        }
        const deletedQuestion = (await db.query('DELETE FROM questions WHERE question_id = $1 RETURNING *', [id])).rows[0];
        return deletedQuestion;
    }
}

module.exports = new QuestionManagementService();