import $api from "../http/index"

export default class ProblemSolvingService {
    static async getProblem(problemId) {
        return $api.get(`/practice/${problemId}`);
    }

    static async checkPath(networkConfig , network) {
        return $api.post('/check-path', { networkConfig , network });
    }

    static async checkCapacitiesAndUpdateFlow(networkConfig , network, flowNetwork, pathNodes, pathCapacities) {
        return $api.post('/check-capacities', { networkConfig , network, flowNetwork, pathNodes, pathCapacities });
    }

    static async checkCurrentFlow(networkConfig , network, pathCapacities, currentFlow, prevFlow) {
        return $api.post('/check-current-flow', { networkConfig , network, pathCapacities, currentFlow, prevFlow });
    }

    static async checkIsTherePath(networkConfig , network) {
        return $api.post('/check-no-path', { networkConfig , network });
    }

    static async checkNodesOfMinCut(networkConfig , network) {
        return $api.post('/check-nodes', { networkConfig , network });
    }

    static async checkEdgesOfMinCut(networkConfig , network, selectedNodes, edges) {
        return $api.post('/check-edges', { networkConfig , network, selectedNodes, edges });
    }

    static async saveResult(userResult) {
        return $api.post('/save-result', { userResult });
    }
}