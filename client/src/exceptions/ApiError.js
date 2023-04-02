import { AxiosError } from "axios";

class ApiError extends AxiosError {
    status;

    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export default ApiError;