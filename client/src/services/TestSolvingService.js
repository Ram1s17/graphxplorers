import $api from "../http/index"

export default class TestSolvingService {
    static async getQuestionsCount() {
        return $api.get('/tests');
    }

    static async getQuestions(type, countOfQuestions) {
        return $api.get(`/tests/${type}/${countOfQuestions}`);
    }

    static async checkAnswerForTheoreticalQuestion(answerOptions) {
        return $api.post('/tests/check-theoretical', { answerOptions });
    }

    static async checkAnswerForPathQuestion(isTherePath, networkConfig, network) {
        return $api.post('/tests/check-path', { isTherePath, networkConfig, network });
    }

    static async checkAnswerForCapacitiesQuestion(networkConfig, network, pathNodes, pathFlow) {
        return $api.post('/tests/check-capacities', { networkConfig, network, pathNodes, pathFlow });
    }

    static async checkAnswerForMinCutQuestion(networkConfig, residualNetwork, sourceNetwork) {
        return $api.post('/tests/check-mincut', { networkConfig, residualNetwork, sourceNetwork });
    }

    static async saveResult(userResult) {
        return $api.post('/tests/save-result', { userResult });
    }
}