const questionManagementService = require('../services/question_management_service');
const problemManagementService = require('../services/problem_management_service');
const problemSolvingUtil = require('../utils/problem_solving_util');
const problemManagementUtil = require('../utils/problem_management_util');
const fordFulkersonSolvierUtil = require('../utils/ford_fulkerson_solver_util');

class QuestionManagementController {
    async getAllQuestions(req, res, next) {
        try {
            const problems = await questionManagementService.getAllQuestions();
            return res.status(200).json(problems);
        }
        catch (e) {
            next(e);
        }
    }

    async getTheoryQuestion(req, res, next) {
        try {
            const { id } = req.params;
            const question = await questionManagementService.getTheoryQuestion(id);
            return res.status(200).json(question);
        } catch (e) {
            next(e);
        }
    }

    async getProblem(req, res, next) {
        try {
            const { id } = req.params;
            const problem = await problemManagementService.getProblem(id);
            const network = problemSolvingUtil.convertGraph(problem.graph, false);
            const adjacencyList = problemSolvingUtil.getAdjacencyList(problem.graph.config, network.slice(problem.graph.config.countOfNodes), false);
            const countOfSteps = fordFulkersonSolvierUtil.fordFulkerson(adjacencyList, problem.graph.config, '', 0);
            return res.status(200).json({
                network,
                countOfSteps
            });
        } catch (e) {
            next(e);
        }
    }

    async getViewAndInteractionNetworks(req, res, next) {
        try {
            const { id } = req.params;
            const { subtype, selectedStep } = req.body;
            const problem = await problemManagementService.getProblem(id);
            const adjacencyList = problemSolvingUtil.getAdjacencyList(problem.graph.config, problem.graph.edges, false);
            const networks = fordFulkersonSolvierUtil.fordFulkerson(adjacencyList, problem.graph.config, subtype, selectedStep);
            if (subtype !== 'capacities') {
                const processedNodesAndEdgesSrc = problemSolvingUtil.convertGraph(problem.graph, false);
                const processedNodesAndEdgesRsdl = problemManagementUtil.convertAdjacencyListToNetwork(problem.graph.config, networks.residualGraph, problem.graph.nodes);
                const returnedValue = {
                    questionContent: {
                        config: problem.graph.config,
                        viewGraph: {
                            nodes: processedNodesAndEdgesSrc.slice(0, problem.graph.config.countOfNodes),
                            edges: processedNodesAndEdgesSrc.slice(problem.graph.config.countOfNodes)
                        },
                        interactionGraph: {
                            ...processedNodesAndEdgesRsdl
                        }
                    },
                    viewNetwork: processedNodesAndEdgesSrc,
                    interactionNetwork: processedNodesAndEdgesRsdl.nodes.concat(processedNodesAndEdgesRsdl.edges)
                };
                return res.status(200).json(returnedValue);
            }
            else {
                const { processedNodesAndEdgesSrc, processedNodesAndEdgesRsdl } =   problemManagementUtil.convertAdjacencyListToCapacitiesNetwork(problem.graph.config, networks, problem.graph.nodes);
                const returnedValue = {
                    questionContent: {
                        config: problem.graph.config,
                        pathNodes: networks.pathNodes,
                        pathFlow: networks.pathFlow,
                        viewGraph: {
                            ...processedNodesAndEdgesSrc
                        },
                        interactionGraph: {
                            ...processedNodesAndEdgesRsdl
                        }
                    },
                    viewNetwork: processedNodesAndEdgesSrc.nodes.concat(processedNodesAndEdgesSrc.edges),
                    interactionNetwork: processedNodesAndEdgesRsdl.nodes.concat(processedNodesAndEdgesRsdl.edges)
                };
                return res.status(200).json(returnedValue);
            }
        } catch (e) {
            next(e);
        }
    }

    async createInteractiveQuestion(req, res, next) {
        try {
            const { subtype, points, text, content } = req.body;
            const newInteractiveQuestion = await questionManagementService.createInteractiveQuestion({ subtype, points, text, content });
            return res.status(200).json(`Интрерактивный вопрос #${newInteractiveQuestion.question_id} создан`);
        }
        catch (e) {
            next(e);
        }
    }

    async createTheoryQuestion(req, res, next) {
        try {
            const { points, text, content } = req.body;
            const newTheoryQuestion = await questionManagementService.createTheoryQuestion({ points, text, content });
            return res.status(200).json(`Теоретический вопрос #${newTheoryQuestion.question_id} создан`);
        }
        catch (e) {
            next(e);
        }
    }

    async updateTheoryQuestion(req, res, next) {
        try {
            const { questionId, points, text, content } = req.body;
            const updatedTheoryQuestion = await questionManagementService.updateTheoryQuestion(questionId, { points, text, content });
            return res.status(200).json(`Теоретический вопрос #${updatedTheoryQuestion.question_id} обновлен`);
        }
        catch (e) {
            next(e);
        }
    }

    async deleteQuestion(req, res, next) {
        try {
            const { id } = req.body;
            const deletedQuestion = await questionManagementService.deleteQuestion(id);
            return res.status(200).json({
                message: `Вопрос #${deletedQuestion.question_id} удален`,
                question_id: deletedQuestion.question_id
            });
        }
        catch (e) {
            next(e);
        }
    }
}

module.exports = new QuestionManagementController();