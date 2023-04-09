import $api from "../http/index"

export default class AdminService {
    static async getAllModerators() {
        return $api.get('/moderators');
    }

    static async createModerator(username, email, password) {
        return $api.post('/moderators', { username, email, password });
    }

    static async updateModerator(id, username, email) {
        return $api.put('/moderators', { id, username, email });
    }

    static async deleteModerator(id) {
        return $api.delete('/moderators', { data: {id} });
    }
}