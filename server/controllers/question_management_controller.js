const questionManagementService = require('../services/question_management_service');

class QuestionManagementController {
    async getAllQuestions(req, res, next) {
        try {
            const problems = await questionManagementService.getAllQuestions();
            return res.status(200).json(problems);
        }
        catch (e) {
            next(e);
        }
    }

    async getTheoryQuestion(req, res, next) {
        try {
            const { id } = req.params;
            const question = await questionManagementService.getTheoryQuestion(id);
            return res.status(200).json(question);
        } catch (e) {
            next(e);
        }
    }

    async createTheoryQuestion(req, res, next) {
        try {
            const { points, text, content } = req.body;
            const newTheoryQuestion = await questionManagementService.createTheoryQuestion({ points, text, content });
            return res.status(200).json(`Теоретический вопрос #${newTheoryQuestion.question_id} создан`);
        }
        catch (e) {
            next(e);
        }
    }

    async updateTheoryQuestion(req, res, next) {
        try {
            const { questionId, points, text, content } = req.body;
            const updatedTheoryQuestion = await questionManagementService.updateTheoryQuestion(questionId, { points, text, content });
            return res.status(200).json(`Теоретический вопрос #${updatedTheoryQuestion.question_id} обновлен`);
        }
        catch (e) {
            next(e);
        }
    }

    async deleteQuestion(req, res, next) {
        try {
            const { id } = req.body;
            const deletedQuestion = await questionManagementService.deleteQuestion(id);
            return res.status(200).json({
                message: `Вопрос #${deletedQuestion.question_id} удален`,
                question_id: deletedQuestion.question_id
            });
        }
        catch (e) {
            next(e);
        }
    }
}

module.exports = new QuestionManagementController();