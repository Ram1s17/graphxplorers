import { makeAutoObservable } from "mobx";
import ProblemManagementService from "../services/ProblemManagementService";

export default class ProblemManagementStore {
    points = 1;
    complexity = 'легко';
    networkConfig = {
        source: 1,
        sink: 1,
        countOfNodes: 0,
        isDigitLabelsOnly: true,
        letter: "",
        startsFromZero: false
    };
    sourceStartsFromZero = false;
    sourceNetwork = [];
    nodesList = [];
    edgesList = [];
    evaluationCriteria = {
        1: {
            path: 0,
            newCapacities: 0,
            currentFlow: 0,
            minCut: 0
        }
    };
    isNetConfigChosen = false;

    constructor() {
        makeAutoObservable(this);
    }

    setPoints(points) {
        this.points = points;
    }

    setComplexity(complexity) {
        this.complexity = complexity;
    }

    setNetworkConfig(networkConfig) {
        this.networkConfig = networkConfig;
    }

    setSourceStartsFromZero(sourceStartsFromZero) {
        this.sourceStartsFromZero = sourceStartsFromZero;
    }

    setSourceNetwork(sourceNetwork) {
        this.sourceNetwork = sourceNetwork;
    }

    setNodesList(nodesList) {
        this.nodesList = nodesList;
    }

    setEdgesList(edgesList) {
        this.edgesList = edgesList;
    }

    setEvaluationCriteria(evaluationCriteria) {
        this.evaluationCriteria = evaluationCriteria;
    }

    setIsNetConfigChosen(bool) {
        this.isNetConfigChosen = bool;
    }

    initStates() {
        this.setPoints(1);
        this.setComplexity('легко');
        this.setNetworkConfig({
            source: 1,
            sink: 1,
            countOfNodes: 0,
            isDigitLabelsOnly: true,
            letter: "",
            startsFromZero: false
        });
        this.setSourceStartsFromZero(false);
        this.setSourceNetwork([]);
        this.setNodesList([]);
        this.setEdgesList([]);
        this.setEvaluationCriteria({
                1: {
                    path: 0,
                    newCapacities: 0,
                    currentFlow: 0,
                    minCut: 0
                }
            }
        );
        this.setIsNetConfigChosen(false);
    }

    async getProblem(problem_id) {
        try {
            const response = await ProblemManagementService.getProblem(problem_id);
            this.setPoints(response.data.points);
            this.setComplexity(response.data.complexity);
            this.setNetworkConfig(response.data.networkConfig);
            this.setSourceStartsFromZero(response.data.networkConfig.startsFromZero);
            this.setSourceNetwork(response.data.network);
            this.setNodesList(response.data.nodesList);
            this.setEdgesList(response.data.edgesList);
            this.setEvaluationCriteria(response.data.evaluationCriteria);
        } catch (e) {
            throw e;
        }
    }

    async checkNetwork() {
        try {
            await ProblemManagementService.checkNetwork(this.networkConfig, this.edgesList);
            this.setIsNetConfigChosen(true);
        } catch (e) {
            throw e;
        }
    }

    async createProblem() {
        try {
            const graph = {
                config: this.networkConfig, 
                nodes: this.nodesList, 
                edges: this.edgesList
            }
            const response = await ProblemManagementService.createProblem(this.points, this.complexity, graph, this.evaluationCriteria);
            return response;
        } catch (e) {
            throw e;
        }
    }

    async updateProblem(problem_id) {
        try {
            const graph = {
                config: this.networkConfig, 
                nodes: this.nodesList, 
                edges: this.edgesList
            }
            const response = await ProblemManagementService.updateProblem(problem_id, this.points, this.complexity, graph, this.evaluationCriteria);
            return response;
        } catch (e) {
            throw e;
        }
    }
}