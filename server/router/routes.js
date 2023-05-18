const Router = require('express').Router;
const authController = require('../controllers/auth_controller');
const adminController = require('../controllers/admin_controller');
const theoryManagementController = require('../controllers/theory_management_controller');
const testSolvingController = require('../controllers/test_solving_controller');
const questionManagementController = require('../controllers/question_management_controller');
const problemSolvingController = require('../controllers/problem_solving_controller');
const problemManagementController = require('../controllers/problem_management_controller');
const userController = require('../controllers/user_controller');
const authMiddleware = require('../middlewares/auth_middleware');
const adminMiddleware = require('../middlewares/admin_middleware');
const moderatorMiddleware = require('../middlewares/moderator_middleware');
const userMiddleware = require('../middlewares/user_middleware');

const router = new Router();

router.post('/registration', authController.registration);
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.post('/forgot_password', authController.forgotPassword);
router.post('/check_reset_link', authController.checkResetLink);
router.put('/reset_password', authController.resetPassword);
router.get('/refresh', authController.refresh);
router.get('/activate/:link', authController.activate);

router.get('/moderators', authMiddleware, adminMiddleware, adminController.getAllModerators);
router.post('/moderators', authMiddleware, adminMiddleware, adminController.createModerator);
router.put('/moderators', authMiddleware, adminMiddleware, adminController.updateModerator);
router.delete('/moderators', authMiddleware, adminMiddleware, adminController.deleteModerator);

router.get('/theory-management', authMiddleware, moderatorMiddleware, theoryManagementController.getTheory);
router.post('/theory-management', authMiddleware, moderatorMiddleware, theoryManagementController.saveTheory);
router.get('/question-management', authMiddleware, moderatorMiddleware, questionManagementController.getAllQuestions);
router.get('/question-management/theoretical/:id', authMiddleware, moderatorMiddleware, questionManagementController.getTheoryQuestion);
router.post('/question-management/theoretical', authMiddleware, moderatorMiddleware, questionManagementController.createTheoryQuestion);
router.put('/question-management/theoretical', authMiddleware, moderatorMiddleware, questionManagementController.updateTheoryQuestion);
router.get('/question-management/problem/:id', authMiddleware, moderatorMiddleware, questionManagementController.getProblem);
router.post('/question-management/problem/:id', authMiddleware, moderatorMiddleware, questionManagementController.getViewAndInteractionNetworks);
router.post('/question-management/interactive', authMiddleware, moderatorMiddleware, questionManagementController.createInteractiveQuestion);
router.delete('/question-management', authMiddleware, moderatorMiddleware, questionManagementController.deleteQuestion);
router.get('/practice-management', authMiddleware, moderatorMiddleware, problemManagementController.getAllProblems);
router.get('/practice-management/:id', authMiddleware, moderatorMiddleware, problemManagementController.getProblem);
router.post('/check-network', authMiddleware, moderatorMiddleware, problemManagementController.checkNetwork);
router.post('/practice-management', authMiddleware, moderatorMiddleware, problemManagementController.createProblem);
router.put('/practice-management', authMiddleware, moderatorMiddleware, problemManagementController.updateProblem);
router.delete('/practice-management', authMiddleware, moderatorMiddleware, problemManagementController.deleteProblem);

router.get('/theory', authMiddleware, userMiddleware, theoryManagementController.getTheory);
router.get('/tests', authMiddleware, userMiddleware, testSolvingController.getQuestionsCount);
router.get('/tests/:type/:count', authMiddleware, userMiddleware, testSolvingController.getQuestions);
router.post('/tests/check-theoretical', authMiddleware, userMiddleware, testSolvingController.checkAnswerForTheoreticalQuestion);
router.post('/tests/check-path', authMiddleware, userMiddleware, testSolvingController.checkAnswerForPathQuestion);
router.post('/tests/check-capacities', authMiddleware, userMiddleware, testSolvingController.checkAnswerForCapacitiesQuestion);
router.post('/tests/check-mincut', authMiddleware, userMiddleware, testSolvingController.checkAnswerForMinCutQuestion);
router.post('/tests/save-result', authMiddleware, userMiddleware, testSolvingController.saveResult);
router.get('/practice/:id', authMiddleware, userMiddleware, problemSolvingController.getProblem);
router.post('/check-path', authMiddleware, userMiddleware, problemSolvingController.checkPath);
router.post('/check-capacities', authMiddleware, userMiddleware, problemSolvingController.checkCapacitiesAndUpdateFlow);
router.post('/check-current-flow', authMiddleware, userMiddleware, problemSolvingController.checkCurrentFlow);
router.post('/check-no-path', authMiddleware, userMiddleware, problemSolvingController.checkIsTherePath);
router.post('/check-nodes', authMiddleware, userMiddleware, problemSolvingController.checkNodesOfMinCut);
router.post('/check-edges', authMiddleware, userMiddleware, problemSolvingController.checkEdgesOfMinCut);
router.post('/save-result', authMiddleware, userMiddleware, problemSolvingController.saveResult);
router.get('/practice', authMiddleware, userMiddleware, problemSolvingController.getAllProblems);
router.get('/me/:id', authMiddleware, userMiddleware, userController.getUserInfo);
router.put('/me', authMiddleware, userMiddleware, userController.updatePersonalInfo);

module.exports = router;