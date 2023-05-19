const problemSolvingService = require('../services/problem_solving_service');
const problemSolvingUtil = require('../utils/problem_solving_util');

class ProblemSolvingController {
    async getAllProblems(req, res, next) {
        try {
            const problems = await problemSolvingService.getAllProblems();
            const processedProblems = problemSolvingUtil.convertProblem(problems);
            return res.status(200).json(processedProblems);
        }
        catch (e) {
            next(e);
        }
    }

    async getProblem(req, res, next) {
        try {
            const { id } = req.params;
            const problem = await problemSolvingService.getProblem(id);
            const residualNetwork = problemSolvingUtil.convertGraph(problem.graph, false);
            const currentFlowInNetwork = problemSolvingUtil.convertGraph(problem.graph, true);
            return res.status(200).json({
                points: problem.points,
                evaluationCriteria: problem.evaluation_criteria,
                networkConfig: problem.graph.config,
                residualNetwork,
                currentFlowInNetwork
            });
        } catch (e) {
            next(e);
        }
    }

    async checkPath(req, res, next) {
        try {
            const { networkConfig, network } = req.body;
            const srcNetwork = JSON.parse(JSON.stringify(network));
            problemSolvingUtil.getOnlySelectedModesAndEdges(network);
            const { pathAdjacencyList, processedNodes } = problemSolvingUtil.checkNodesAndEdges(networkConfig, network.nodes, network.edges);
            const { pathNodes, processedCapacities } = problemSolvingUtil.getPath(networkConfig, pathAdjacencyList, processedNodes);
            const adjacencyList = problemSolvingUtil.getAdjacencyList(networkConfig, srcNetwork.edges, false);
            const pathNetwork = srcNetwork.nodes.concat(problemSolvingUtil.getPathNetworkFromAdjacencyList(networkConfig, adjacencyList, pathNodes));
            return res.status(200).json({
                pathNetwork,
                pathNodes: Array.from(pathNodes),
                pathCapacities: Array.from(processedCapacities)
            });
        } catch (e) {
            next(e);
        }
    }

    async checkIsTherePath(req, res, next) {
        try {
            const { networkConfig, network } = req.body;
            const adjacencyList = problemSolvingUtil.getAdjacencyList(networkConfig, network.edges, false);
            problemSolvingUtil.checkIsTherePath(networkConfig, adjacencyList);
            const residualNetwork = problemSolvingUtil.getResidualNetwork(networkConfig, network.nodes, adjacencyList);
            return res.status(200).json({
                residualNetwork
            });
        } catch (e) {
            next(e);
        }
    }

    async checkCapacitiesAndUpdateFlow(req, res, next) {
        try {
            const { networkConfig, network, flowNetwork, pathNodes, pathCapacities } = req.body;
            const pathFlow = problemSolvingUtil.getPathFlow(pathCapacities);
            const srcAdjacencyList = problemSolvingUtil.getAdjacencyList(networkConfig, network.edges, false);
            const newAdjacencyList = problemSolvingUtil.getAdjacencyList(networkConfig, network.edges, true);
            problemSolvingUtil.checkNewCapacities(networkConfig, srcAdjacencyList, newAdjacencyList, pathNodes, pathFlow);
            const newCapacitiesNetwork = problemSolvingUtil.getNetworkWithNewCapacities(network.nodes, network.edges);
            const currentFlowInNetwork = problemSolvingUtil.getUpdatedFlowNetwork(networkConfig, flowNetwork.slice(0, networkConfig.countOfNodes), flowNetwork.slice(networkConfig.countOfNodes), pathNodes, pathFlow);
            return res.status(200).json({
                newCapacitiesNetwork,
                currentFlowInNetwork
            });
        } catch (e) {
            next(e);
        }
    }

    async checkCurrentFlow(req, res, next) {
        try {
            const { networkConfig, network, pathCapacities, currentFlow, prevFlow } = req.body;
            const pathFlow = problemSolvingUtil.getPathFlow(pathCapacities);
            const adjacencyList = problemSolvingUtil.getAdjacencyList(networkConfig, network.slice(networkConfig.countOfNodes), false);
            problemSolvingUtil.checkCurrentFlow(prevFlow, pathFlow, currentFlow);
            const residualNetwork = problemSolvingUtil.getResidualNetwork(networkConfig, network.slice(0, networkConfig.countOfNodes), adjacencyList);
            return res.status(200).json({
                residualNetwork
            });
        } catch (e) {
            next(e);
        }
    }

    async checkNodesOfMinCut(req, res, next) {
        try {
            const { networkConfig, network } = req.body;
            const adjacencyList = problemSolvingUtil.getAdjacencyList(networkConfig, network.edges, false);
            const processedNodes = problemSolvingUtil.checkNodesOfMinCut(networkConfig, network.nodes, adjacencyList);
            return res.status(200).json({
                processedNodes
            });
        } catch (e) {
            next(e);
        }
    }

    async checkEdgesOfMinCut(req, res, next) {
        try {
            const { networkConfig, network, selectedNodes, edges } = req.body;
            const adjacencyList = problemSolvingUtil.getAdjacencyList(networkConfig, network.slice(networkConfig.countOfNodes), false);
            problemSolvingUtil.checkEdgesOfMinCut(networkConfig, adjacencyList, selectedNodes, edges);
            return res.status(200).json("Задача решена");
        } catch (e) {
            next(e);
        }
    }

    async saveResult(req, res, next) {
        try {
            const { userResult } = req.body;
            const { countOfMistakes, resultPoints, totalPoints } = problemSolvingUtil.calculatePoints(userResult.evaluationCriteria, userResult.mistakes, userResult.totalPoints);
            const result = {
                dateOfSolving: userResult.dateOfSolving.split(', ').join(' '),
                spentTime: userResult.spentTime,
                countOfSteps: userResult.countOfSteps,
                countOfMistakes,
                stageMistakes: userResult.mistakes,
                resultPoints,
                totalPoints,
                userId: userResult.userId,
                problemId: userResult.problemId
            };
            await problemSolvingService.saveResult(result);
            return res.status(200).json({ resultPoints: resultPoints + '/' + totalPoints, countOfMistakes });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ProblemSolvingController();