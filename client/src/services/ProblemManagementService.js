import $api from "../http/index"

export default class ProblemManagementService {
    static async getAllProblems() {
        return $api.get('/practice-management');
    }

    static async getProblem(problemId) {
        return $api.get(`/practice-management/${problemId}`);
    }

    static async checkNetwork(networkConfig, edges) {
        return $api.post('/check-network', { networkConfig, edges });
    }

    static async createProblem(points, complexity, graph, evaluationCriteria) {
        return $api.post('/practice-management', { points, complexity, graph, evaluationCriteria });
    }

    static async updateProblem(problemId, points, complexity, graph, evaluationCriteria, deletedCriteriaArray) {
        return $api.put('/practice-management', { problemId, points, complexity, graph, evaluationCriteria, deletedCriteriaArray });
    }

    static async deleteProblem(id) {
        return $api.delete('/practice-management', { data: { id } });
    }
}