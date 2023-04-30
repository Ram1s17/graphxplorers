import { makeAutoObservable } from "mobx";

export default class ModalWinStore {
    isSuccessType = false;
    isErrorType = false;
    isResultType = false;
    title = '';
    body = '';
    resultArray = [];

    constructor() {
        makeAutoObservable(this);
    }

    setIsSuccessType(bool) {
        this.isSuccessType = bool;
    }

    setIsErrorType(bool) {
        this.isErrorType = bool;
    }

    setIsResultType(bool) {
        this.isResultType = bool;
    }

    setTitle(title) {
        this.title = title;
    }

    setBody(body) {
        this.body = body;
    }
    
    setResultArray(resultArray) {
        this.resultArray = resultArray;
    }
}