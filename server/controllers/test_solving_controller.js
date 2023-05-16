const testSolvingService = require('../services/test_solving_service');
const testSolvingUtil = require('../utils/test_solving_util');

class TestSolvingController {
    async getQuestionsCount(req, res, next) {
        try {
            const questionCountValues = await testSolvingService.getQuestionsCount();
            return res.status(200).json(questionCountValues);
        }
        catch (e) {
            next(e);
        }
    }

    async getQuestions(req, res, next) {
        try {
            const { type, count } = req.params;
            const questionsFromDB = await testSolvingService.getQuestions(type, count);
            const questions = (testSolvingUtil.shuffleQuestions(questionsFromDB)).slice(0, Number(count));
            const processedQuestions = testSolvingUtil.processTheoreticalQuestions(questions);
            const totalPoints = testSolvingUtil.calculateTotalPoints(questions);
            return res.status(200).json({
                questions: processedQuestions,
                totalPoints
            });
        }
        catch (e) {
            next(e);
        }
    }

    async checkAnswerForTheoreticalQuestion(req, res, next) {
        try {
            const { answerOptions } = req.body; 
            const result =  testSolvingUtil.checkAnswerForTheoreticalQuestion(answerOptions);
            return res.status(200).json({
                result
            });
        }
        catch (e) {
            next(e);
        }
    }

    async checkAnswerForPathQuestion(req, res, next) {
        try {
            const { isTherePath, networkConfig, network } = req.body;
            const result =  testSolvingUtil.checkAnswerForPathQuestion(isTherePath, networkConfig, network);
            return res.status(200).json({
                result
            });
        }
        catch (e) {
            next(e);
        }
    }

    async checkAnswerForCapacitiesQuestion(req, res, next) {
        try {
            const { networkConfig, network, pathNodes, pathFlow } = req.body;
            const result =  testSolvingUtil.checkAnswerForCapacitiesQuestion(networkConfig, network, pathNodes, pathFlow);
            return res.status(200).json({
                result
            });
        }
        catch (e) {
            next(e);
        }
    }

    async checkAnswerForMinCutQuestion(req, res, next) {
        try {
            const { networkConfig, residualNetwork, sourceNetwork } = req.body;
            const result = testSolvingUtil.checkAnswerForMinCutQuestion(networkConfig, residualNetwork, sourceNetwork);
            return res.status(200).json({
                result
            });
        }
        catch (e) {
            next(e);
        }
    }

    async saveResult(req, res, next) {
        try {
            const { userResult } = req.body;
            await testSolvingService.saveResult({...userResult, typeOfTest: testSolvingUtil.getTypeOfTest(userResult.typeOfTest)});
            return res.status(200).json("Тестирование завершено. Результаты сохранены");
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new TestSolvingController();