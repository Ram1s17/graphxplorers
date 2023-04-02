import $api from "../http/index"

export default class AuthService {
    static async registration(username, email, password) {
        return $api.post('/registration', { username, email, password });
    }

    static async login(username, password) {
        return $api.post('/login', { username, password });
    }

    static async logout() {
        return $api.post('/logout');
    }

    static async forgotPassword(email) {
        return $api.post('/forgot_password', {email});
    }

    static async checkResetLink(id, token) {
        return $api.post('/check_reset_link', {id, token});
    }

    static async resetPassword(id, token, newPassword) {
        return $api.put('/reset_password', {id, token, newPassword});
    }
}