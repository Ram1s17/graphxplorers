import $api from "../http/index"

export default class TheoryService {
    static async getTheory() {
        return $api.get('/theory');
    }
}