import { makeAutoObservable } from "mobx";
import ProblemSolvingService from "../services/ProblemSolvingService";

export default class ProblemSolvingStore {
    step = 1;
    points = 0;
    time = '';
    mistakes = {
        path: 0,
        newCapacities: 0,
        currentFlow: 0,
        minCut: 0
    };
    countOfMistakes = 0;
    resultPoints = '';
    currentFlow = 0;
    sourceNetwork = [];
    residualNetwork = [];
    currentFlowInNetwork = [];
    newCapacitiesNetwork = [];
    minCutNetwork = [];
    pathNodes = [];
    pathCapacities = [];
    networkConfig = {};
    isChoosingNewCapacities = false;
    areCapacitiesUpdated = false;
    isChoosingMinCut = false;
    areNodesChosen = false;

    constructor() {
        makeAutoObservable(this);
    }

    setStep(step) {
        this.step = step;
    }

    setPoints(points) {
        this.points = points;
    }

    setTime(time) {
        this.time = time;
    }

    setMistakes(mistakes) {
        this.mistakes = mistakes;
    }

    setCountOfMistakes(countOfMistakes) {
        this.countOfMistakes = countOfMistakes;
    }

    setResultPoints(resultPoints) {
        this.resultPoints = resultPoints;
    }

    setCurrentFlow(currentFlow) {
        this.currentFlow = currentFlow;
    }

    setSourceNetwork(sourceNetwork) {
        this.sourceNetwork = sourceNetwork
    }

    setResidualNetwork(residualNetwork) {
        this.residualNetwork = residualNetwork
    }

    setCurrentFlowInNetwork(currentFlowInNetwork) {
        this.currentFlowInNetwork = currentFlowInNetwork
    }

    setNewCapacitiesNetwork(newCapacitiesNetwork) {
        this.newCapacitiesNetwork = newCapacitiesNetwork
    }

    setMinCutNetwork(minCutNetwork) {
        this.minCutNetwork = minCutNetwork
    }

    setPathNodes(pathNodes) {
        this.pathNodes = pathNodes
    }

    setPathCapacities(pathCapacities) {
        this.pathCapacities = pathCapacities
    }

    setNetworkConfig(networkConfig) {
        this.networkConfig = networkConfig;
    }

    setEvaluationCriteria(evaluationCriteria) {
        this.evaluationCriteria = evaluationCriteria;
    }

    setIsChoosingNewCapacities(bool) {
        this.isChoosingNewCapacities = bool;
    }

    setAreCapacitiesUpdated(bool) {
        this.areCapacitiesUpdated = bool;
    }

    setIsChoosingMinCut(bool) {
        this.isChoosingMinCut = bool;
    }

    setAreNodesChosen(bool) {
        this.areNodesChosen = bool;
    }

    initStates() {
        this.setStep(1);
        this.setPoints(0);
        this.setTime('');
        this.setMistakes({
            path: 0,
            newCapacities: 0,
            currentFlow: 0,
            minCut: 0
        });
        this.setCountOfMistakes(0);
        this.setResultPoints('');
        this.setCurrentFlow(0);
        this.setSourceNetwork([]);
        this.setResidualNetwork([]);
        this.setCurrentFlowInNetwork([]);
        this.setNewCapacitiesNetwork([]);
        this.setMinCutNetwork([]);
        this.setPathNodes([]);
        this.setPathCapacities([]);
        this.setNetworkConfig({});
        this.setIsChoosingNewCapacities(false);
        this.setAreCapacitiesUpdated(false);
        this.setIsChoosingMinCut(false);
        this.setAreNodesChosen(false);
    }

    async getProblem(problem_id) {
        try {
            const response = await ProblemSolvingService.getProblem(problem_id);
            this.setPoints(response.data.points);
            this.setNetworkConfig(response.data.networkConfig);
            this.setEvaluationCriteria(response.data.evaluationCriteria);
            this.setSourceNetwork(response.data.residualNetwork);
            this.setResidualNetwork(response.data.residualNetwork);
            this.setCurrentFlowInNetwork(response.data.currentFlowInNetwork);
        } catch (e) {
            throw e;
        }
    }

    async checkPath(network) {
        try {
            const response = await ProblemSolvingService.checkPath(this.networkConfig, network);
            this.setResidualNetwork((network.nodes).concat(network.edges));
            this.setNewCapacitiesNetwork(response.data.pathNetwork);
            this.setPathNodes(response.data.pathNodes);
            this.setPathCapacities(response.data.pathCapacities);
            this.setIsChoosingNewCapacities(true);
        }
        catch (e) {
            throw e;
        }
    }

    async checkCapacitiesAndUpdateFlow(network) {
        try {
            const response = await ProblemSolvingService.checkCapacitiesAndUpdateFlow(this.networkConfig, network, this.currentFlowInNetwork, this.pathNodes, this.pathCapacities);
            this.setNewCapacitiesNetwork(response.data.newCapacitiesNetwork);
            this.setCurrentFlowInNetwork(response.data.currentFlowInNetwork);
            this.setAreCapacitiesUpdated(true);
        }
        catch (e) {
            throw e;
        }
    }

    async checkCurrentFlow(updatedFlow) {
        try {
            const response = await ProblemSolvingService.checkCurrentFlow(this.networkConfig, this.newCapacitiesNetwork, this.pathCapacities, updatedFlow, this.currentFlow);
            this.setResidualNetwork(response.data.residualNetwork);
            this.setStep(this.step + 1);
            this.setCurrentFlow(updatedFlow);
            this.setIsChoosingNewCapacities(false);
            this.setAreCapacitiesUpdated(false);
        }
        catch (e) {
            throw e;
        }
    }

    async checkIsTherePath(network) {
        try {
            const response = await ProblemSolvingService.checkIsTherePath(this.networkConfig, network);
            this.setStep(this.step + 1);
            this.setResidualNetwork(this.sourceNetwork);
            this.setMinCutNetwork(response.data.residualNetwork);
            this.setIsChoosingMinCut(true);
        }
        catch (e) {
            throw e;
        }
    }

    async checkNodesOfMinCut(network) {
        try {
            const response = await ProblemSolvingService.checkNodesOfMinCut(this.networkConfig, network);
            this.setPathNodes(response.data.processedNodes);
            this.setAreNodesChosen(true);
        }
        catch (e) {
            throw e;
        }
    }

    async checkEdgesOfMinCut(edges) {
        try {
            await ProblemSolvingService.checkEdgesOfMinCut(this.networkConfig, this.sourceNetwork, this.pathNodes, edges);
        }
        catch (e) {
            throw e;
        }
    }

    async saveResult(problemId, userId) {
        try {
            const userResult = {
                dateOfSolving: (new Date()).toLocaleString(),
                spentTime: this.time,
                countOfSteps: this.step,
                mistakes: this.mistakes,
                totalPoints: this.points,
                userId,
                problemId: Number(problemId)
            };
            const response = await ProblemSolvingService.saveResult(userResult);
            this.setCountOfMistakes(response.data.countOfMistakes);
            this.setResultPoints(response.data.resultPoints);
        }
        catch (e) {
            throw e;
        }
    }
}