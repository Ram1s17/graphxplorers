import { makeAutoObservable } from "mobx";
import TestSolvingService from "../services/TestSolvingService";

export default class TestSolvingStore {
    currentIndex = 0;
    countOfQuestions = 0;
    typeOfTest = '';
    questions = [];
    userPoints = 0;
    totalPoints = 0;
    time = '';

    constructor() {
        makeAutoObservable(this);
    }

    setCurrentIndex(currentIndex) {
        this.currentIndex = currentIndex;
    }

    setCountOfQuestions(countOfQuestions) {
        this.countOfQuestions = countOfQuestions;
    }

    setTypeOfTest(typeOfTest) {
        this.typeOfTest = typeOfTest;
    }

    setQuestions(questions) {
        this.questions = questions;
    }

    setUserPoints(userPoints) {
        this.userPoints = userPoints;
    }

    setTotalPoints(totalPoints) {
        this.totalPoints = totalPoints;
    }

    setTime(time){
        this.time = time;
    }

    initStates() {
        this.setCurrentIndex(0);
        this.setQuestions([]);
        this.setUserPoints(0);
        this.setTotalPoints(0);
        this.setTime('');
    }

    async getQuestions() {
        try {
            const response = await TestSolvingService.getQuestions(this.typeOfTest, this.countOfQuestions);
            this.setQuestions(response.data.questions);
            this.setTotalPoints(response.data.totalPoints);
        } catch (e) {
            throw e;
        }
    }

    async checkAnswerForTheoreticalQuestion(answerOptions) {
        try {
            return await TestSolvingService.checkAnswerForTheoreticalQuestion(answerOptions);
        } catch (e) {
            throw e;
        }
    }

    async checkAnswerForPathQuestion(isTherePath, networkConfig, network) {
        try {
            return await TestSolvingService.checkAnswerForPathQuestion(isTherePath, networkConfig, network);
        } catch (e) {
            throw e;
        }
    }

    async checkAnswerForCapacitiesQuestion(networkConfig, network, pathNodes, pathFlow) {
        try {
            return await TestSolvingService.checkAnswerForCapacitiesQuestion(networkConfig, network, pathNodes, pathFlow);
        } catch (e) {
            throw e;
        }
    }

    async checkAnswerForMinCutQuestion(networkConfig, residualNetwork, sourceNetwork) {
        try {
            return await TestSolvingService.checkAnswerForMinCutQuestion(networkConfig, residualNetwork, sourceNetwork);
        } catch (e) {
            throw e;
        }
    }

    async saveResult(userId) {
        try {
            const userResult = {
                dateOfSolving: (new Date()).toLocaleString(),
                spentTime: this.time,
                typeOfTest: this.typeOfTest,
                countOfQuestions: this.countOfQuestions,
                resultPoints: this.userPoints,
                totalPoints: this.totalPoints,
                userId
            };
            await TestSolvingService.saveResult(userResult);
        }
        catch (e) {
            throw e;
        }
    }
}