const Router = require('express').Router;
const authController = require('../controllers/auth_controller');
const adminController = require('../controllers/admin_controller');
const theoryManagementController = require('../controllers/theory_management_controller');
const problemSolvingController = require('../controllers/problem_solving_controller');
const problemManagementController = require('../controllers/problem_management_controller');
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

router.get('/moderators', authMiddleware, adminMiddleware, adminController.getAllModerators);
router.post('/moderators', authMiddleware, adminMiddleware, adminController.createModerator);
router.put('/moderators', authMiddleware, adminMiddleware, adminController.updateModerator);
router.delete('/moderators', authMiddleware, adminMiddleware, adminController.deleteModerator);

router.get('/theory-management', authMiddleware, moderatorMiddleware, theoryManagementController.getTheory);
router.post('/theory-management', authMiddleware, moderatorMiddleware, theoryManagementController.saveTheory);
router.get('/practice-management', authMiddleware, moderatorMiddleware, problemManagementController.getAllProblems);
router.delete('/practice-management', authMiddleware, moderatorMiddleware, problemManagementController.deleteProblem);

router.get('/theory', authMiddleware, userMiddleware, theoryManagementController.getTheory);
router.get('/practice/:id', authMiddleware, userMiddleware, problemSolvingController.getProblem);
router.post('/check-path', authMiddleware, userMiddleware, problemSolvingController.checkPath);
router.post('/check-capacities', authMiddleware, userMiddleware, problemSolvingController.checkCapacitiesAndUpdateFlow);
router.post('/check-current-flow', authMiddleware, userMiddleware, problemSolvingController.checkCurrentFlow);
router.post('/check-no-path', authMiddleware, userMiddleware, problemSolvingController.checkIsTherePath);
router.post('/check-nodes', authMiddleware, userMiddleware, problemSolvingController.checkNodesOfMinCut);
router.post('/check-edges', authMiddleware, userMiddleware, problemSolvingController.checkEdgesOfMinCut);
router.post('/save-result', authMiddleware, userMiddleware, problemSolvingController.saveResult);
router.get('/practice', authMiddleware, userMiddleware, problemSolvingController.getAllProblems);

module.exports = router;