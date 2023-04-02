import { makeAutoObservable } from "mobx";

export default class ModalWinStore {
    isSuccessType = false;
    isErrorType = false;
    title = '';
    body = '';

    constructor() {
        makeAutoObservable(this);
    }

    setIsSuccessType(bool) {
        this.isSuccessType = bool;
    }

    setIsErrorType(bool) {
        this.isErrorType = bool;
    }

    setTitle(title) {
        this.title = title;
    }

    setBody(body) {
        this.body = body;
    }
}