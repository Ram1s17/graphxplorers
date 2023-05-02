import $api from "../http/index"

export default class ProblemManagementService {
    static async getAllProblems() {
        return $api.get('/practice-management');
    }

    static async deleteProblem(id) {
        return $api.delete('/practice-management', { data: { id } });
    }
}