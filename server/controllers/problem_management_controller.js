const problemManagementService = require('../services/problem_management_service');
const evaluationCriteriaService = require('../services/evaluation_criteria_service');
const problemSolvingUtil = require('../utils/problem_solving_util');
const problemManagementUtil = require('../utils/problem_management_util');

class ProblemManagementController {
    async getAllProblems(req, res, next) {
        try {
            const problems = await problemManagementService.getAllProblems();
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
            const problem = await problemManagementService.getProblem(id);
            const network = problemSolvingUtil.convertGraph(problem.graph, false);
            const evaluationCriteria = await evaluationCriteriaService.getEvaluationCriteria(id);
            return res.status(200).json({
                points: problem.points,
                complexity: problem.complexity,
                networkConfig: problem.graph.config,
                network,
                nodesList: network.slice(0, problem.graph.config.countOfNodes),
                edgesList: network.slice(problem.graph.config.countOfNodes),
                evaluationCriteria
            });
        } catch (e) {
            next(e);
        }
    }

    async checkNetwork(req, res, next) {
        try {
            const { networkConfig, edges } = req.body;
            problemManagementUtil.checkConfig(networkConfig);
            const adjacencyList = problemSolvingUtil.getAdjacencyList(networkConfig, edges, false);
            problemManagementUtil.checkAdjacencyList(networkConfig, adjacencyList, networkConfig.source, networkConfig.sink);
            return res.status(200).json("Модерация транспортной сети прошла успешно");
        } catch (e) {
            next(e);
        }
    }

    async createProblem(req, res, next) {
        try {
            const { points, complexity, graph, evaluationCriteria } = req.body;
            problemManagementUtil.checkEvaluationCriteria(evaluationCriteria, points);
            problemManagementUtil.processGraph(graph);
            const newProblem = await problemManagementService.createProblem({ points, complexity, graph });
            for (let createdCriteria of evaluationCriteria) {
                await evaluationCriteriaService.addEvaluationCriteria(newProblem.problem_id, createdCriteria);
            }
            return res.status(200).json(`Задача #${newProblem.problem_id} создана`);
        }
        catch (e) {
            next(e);
        }
    }

    async updateProblem(req, res, next) {
        try {
            const { problemId, points, complexity, graph, evaluationCriteria, deletedCriteriaArray } = req.body;
            problemManagementUtil.checkEvaluationCriteria(evaluationCriteria, points);
            const newCriteriaArray = evaluationCriteria.filter(criteria => criteria.criteria_id <= 0);
            for (let createdCriteria of newCriteriaArray) {
                await evaluationCriteriaService.addEvaluationCriteria(problemId, createdCriteria);
            }
            for (let deletedCriteriaID of deletedCriteriaArray) {
                await evaluationCriteriaService.deleteEvaluationCriteria(problemId, deletedCriteriaID);
            }
            problemManagementUtil.processGraph(graph);
            const updatedProblem = await problemManagementService.updateProblem(problemId, { points, complexity, graph });
            return res.status(200).json(`Задача #${updatedProblem.problem_id} обновлена`);
        }
        catch (e) {
            next(e);
        }
    }

    async deleteProblem(req, res, next) {
        try {
            const { id } = req.body;
            const evaluationCriteria = await evaluationCriteriaService.getEvaluationCriteria(id);
            const deletedCriteriaArray = evaluationCriteria.map((criteria) => {
                return criteria.criteria_id;
            });
            for (let deletedCriteriaID of deletedCriteriaArray) {
                await evaluationCriteriaService.deleteEvaluationCriteria(id, deletedCriteriaID);
            }
            const deletedProblem = await problemManagementService.deleteProblem(id);
            return res.status(200).json({
                message: `Задача #${deletedProblem.problem_id} удалена`,
                problem_id: deletedProblem.problem_id
            });
        }
        catch (e) {
            next(e);
        }
    }
}

module.exports = new ProblemManagementController();