import $api from "../http/index"

export default class AdminService {
    static async getAllModerators() {
        return $api.get('/moderators');
    }
}