import { makeAutoObservable } from "mobx";
import QuestionManagementService from "../services/QuestionManagementService";

export default class QuestionManagementStore {
    points = '1';
    selectedProblemID = 0;
    subtype = 'path';
    selectedStep = 1;
    countOfSteps = 0;
    viewNetwork = [];
    interactionNetwork = [];
    questionContent = {};
    isProblemSelected = false;
    isQuestionCompleted = false;

    constructor() {
        makeAutoObservable(this);
    }

    setPoints(points) {
        this.points = points;
    }

    setSelectedProblemID(selectedProblemID) {
        this.selectedProblemID = selectedProblemID;
    }

    setSubtype(subtype) {
        this.subtype = subtype;
    }

    setSelectedStep(selectedStep) {
        this.selectedStep = selectedStep;
    }

    setCountOfSteps(countOfSteps) {
        this.countOfSteps = countOfSteps;
    }

    setViewNetwork(viewNetwork) {
        this.viewNetwork = viewNetwork;
    }
    
    setInteractionNetwork(interactionNetwork) {
        this.interactionNetwork = interactionNetwork;
    }

    setQuestionContent(questionContent) {
        this.questionContent = questionContent;
    }

    setIsProblemSelected(bool) {
        this.isProblemSelected = bool;
    }

    setIsQuestionCompleted(bool) {
        this.isQuestionCompleted = bool;
    }

    initStates() {
        this.setPoints('1');
        this.setSelectedProblemID(0);
        this.setSubtype('path');
        this.setSelectedStep(1);
        this.setCountOfSteps(0);
        this.setViewNetwork([]);
        this.setInteractionNetwork([]);
        this.setQuestionContent({});
        this.setIsProblemSelected(false);
        this.setIsQuestionCompleted(false);
    }

    async getProblem(problem_id) {
        try {
            this.setSelectedProblemID(problem_id);
            const response = await QuestionManagementService.getProblem(problem_id);
            this.setCountOfSteps(response.data.countOfSteps);
            this.setViewNetwork(response.data.network);
            this.setIsProblemSelected(true);
        } catch (e) {
            throw e;
        }
    }

    async getViewAndInteractionNetworks() {
        try {
            const response = await QuestionManagementService.getViewAndInteractionNetworks(this.selectedProblemID, this.subtype, this.selectedStep);
            this.setViewNetwork(response.data.viewNetwork);
            this.setInteractionNetwork(response.data.interactionNetwork);
            this.setIsQuestionCompleted(true);
            this.setQuestionContent(response.data.questionContent);
        } catch (e) {
            throw e;
        }
    }

    async createInteractiveQuestion() {
        try {
            let question = '';
            switch (this.subtype) {
                case 'path':
                    question = "Выберите путь из истока в сток:";
                    break;
                case 'capacities':
                    question = "Введите новые пропускные способности дуг на выбранном пути:";
                    break;
                case 'mincut':
                    question = "Выберите дуги, образующие минимальный разрез:";
                    break;
                default:
                    question = '';
            }
            const response = await QuestionManagementService.createInteractiveQuestion(this.subtype, this.points, question, this.questionContent);
            return response;
        }
        catch (e) {
            throw e;
        }
    }
}