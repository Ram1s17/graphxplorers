import $api from "../http/index"

export default class QuestionManagementService {
    static async getAllQuestions() {
        return $api.get('/question-management');
    }

    static async getTheoryQuestion(questionId) {
        return $api.get(`/question-management/theoretical/${questionId}`);
    }

    static async createTheoryQuestion(points, text, content) {
        return $api.post('/question-management/theoretical', { points, text, content });
    }

    static async updateTheoryQuestion(questionId, points, text, content) {
        return $api.put('/question-management/theoretical', { questionId, points, text, content });
    }

    static async deleteQuestion(id) {
        return $api.delete('/question-management', { data: { id } });
    }
}