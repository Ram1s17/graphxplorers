const problemManagementService = require('../services/problem_management_service');
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
            return res.status(200).json({
                points: problem.points,
                complexity: problem.complexity,
                networkConfig: problem.graph.config,
                network,
                nodesList: network.slice(0, problem.graph.config.countOfNodes),
                edgesList: network.slice(problem.graph.config.countOfNodes),
                evaluationCriteria: problem.evaluation_criteria
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
            problemManagementUtil.checkEvaluationCriteria(evaluationCriteria);
            problemManagementUtil.processGraph(graph);
            const newProblem = await problemManagementService.createProblem({ points, complexity, graph, evaluationCriteria });
            return res.status(200).json(`Задача #${newProblem.problem_id} создана`);
        }
        catch (e) {
            next(e);
        }
    }

    async updateProblem(req, res, next) {
        try {
            const { problemId, points, complexity, graph, evaluationCriteria } = req.body;
            problemManagementUtil.checkEvaluationCriteria(evaluationCriteria);
            problemManagementUtil.processGraph(graph);
            const updatedProblem = await problemManagementService.updateProblem(problemId, { points, complexity, graph, evaluationCriteria });
            return res.status(200).json(`Задача #${updatedProblem.problem_id} обновлена`);
        }
        catch (e) {
            next(e);
        }
    }

    async deleteProblem(req, res, next) {
        try {
            const { id } = req.body;
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