import axios from 'axios';
import ApiError from '../exceptions/ApiError';

const API_URL = 'http://localhost:8080/api'

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
});

$api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    if (error.response) {
        if (error.response.status === 401) {
            try {
                const response = await axios.get(`${API_URL}/refresh`, { withCredentials: true });
                localStorage.setItem('token', response.data.accessToken);
                return $api(error.config);
            }
            catch (e) {
                throw new ApiError(error.response.status, "Прошло 30 дней с Вашей авторизации. Авторизуйтесь снова, пожалуйста!");
            }
        }
        else if (error.response.status === 400) {
            throw new ApiError(error.response.status, error.response.data.message);
        }
        else if (error.response.status === 403) {
            throw new ApiError(error.response.status, "У Вас нет прав для перехода!");
        }
        else if (error.response.status === 500) {
            throw new ApiError(error.response.status, "Ошибка на стороне сервера! Приносим извинения!");
        }
    }
    else {
        throw new ApiError(503, "Сервер недоступен! Приносим извинения!");
    }
});

export default $api;