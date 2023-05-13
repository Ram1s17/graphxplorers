import $api from "../http/index"

export default class QuestionManagementService {
    static async getAllQuestions() {
        return $api.get('/question-management');
    }

    static async getTheoryQuestion(questionId) {
        return $api.get(`/question-management/theoretical/${questionId}`);
    }

    static async getProblem(problemId) {
        return $api.get(`/question-management/problem/${problemId}`);
    }

    static async getViewAndInteractionNetworks(problemId, subtype, selectedStep) {
        return $api.post(`/question-management/problem/${problemId}`, { subtype, selectedStep });
    }

    static async createTheoryQuestion(points, text, content) {
        return $api.post('/question-management/theoretical', { points, text, content });
    }

    static async createInteractiveQuestion(subtype, points, text, content) {
        return $api.post('/question-management/interactive', { subtype, points, text, content });
    }

    static async updateTheoryQuestion(questionId, points, text, content) {
        return $api.put('/question-management/theoretical', { questionId, points, text, content });
    }

    static async deleteQuestion(id) {
        return $api.delete('/question-management', { data: { id } });
    }
}