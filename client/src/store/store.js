import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";

export default class Store {
    userId = 0;
    userRole = '';
    isAuth = false;
    isLoading = false;
    error = {
        bool: false,
        message: ''
    };

    constructor() {
        makeAutoObservable(this);
    }

    setUserId(userId) {
        this.userId = userId;
    }

    setUserRole(userRole) {
        this.userRole = userRole;
    }

    setIsAuth(bool) {
        this.isAuth = bool;
    }

    setIsLoading(bool) {
        this.isLoading = bool;
    }

    setError(error) {
        this.error = error;
    }

    async login(username, password) {
        try {
            const response = await AuthService.login(username, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setIsAuth(true);
            this.setUserId(response.data.userId);
            this.setUserRole(response.data.userRole);
        } catch (e) {
            throw e;
        }
    }

    async registration(username, email, password) {
        try {
            const response = await AuthService.registration(username, email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setIsAuth(true);
            this.setUserId(response.data.userId);
            this.setUserRole(response.data.userRole);
        } catch (e) {
            throw e;
        }
    }

    async logout() {
        try {
            await AuthService.logout();
            localStorage.removeItem('token');
            this.setIsAuth(false);
            this.setUserId(0);
            this.setUserRole('');
        } catch (e) {
            throw e;
        }
    }

    async checkAuth() {
        this.setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/refresh', { withCredentials: true })
            localStorage.setItem('token', response.data.accessToken);
            this.setIsAuth(true);
            this.setUserId(response.data.userId);
            this.setUserRole(response.data.userRole);
        } catch (e) {
            this.setIsAuth(false);
            this.setUserId(0);
            this.setUserRole('');
            if (e.response) {
                if (e.response.status === 401)
                    this.setError({ bool: true, message: "Прошло 30 дней с Вашей авторизации. Авторизуйтесь снова, пожалуйста!" })
                else if (e.response.status === 500)
                    this.setError({ bool: true, message: "Ошибка на стороне сервера! Приносим извинения!" });
            }
            else
                this.setError({ bool: true, message: "Сервер недоступен! Приносим извинения!" });
        } finally {
            this.setIsLoading(false);
        }
    }
}