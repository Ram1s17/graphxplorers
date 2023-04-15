import $api from "../http/index"

export default class TheoryManagementService {
    static async getTheory() {
        return $api.get('/theory-management');
    }

    static async saveTheory(content) {
        return $api.post('/theory-management', { content });
    }
}