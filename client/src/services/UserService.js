import $api from "../http/index"

export default class UserService {
    static async getUserInfo(id) {
        return $api.get(`/me/${id}`);
    }

    static async updatePersonalInfo(id, username, email, password, isEmailConfirmed) {
        return $api.put('/me', { id, username, email, password, isEmailConfirmed });
    }
}