const Router = require('express').Router;
const authController = require('../controllers/auth_controller');
const adminController = require('../controllers/admin_controller');
const theoryManagementController = require('../controllers/theory_management_controller');
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

router.get('/theory', authMiddleware, userMiddleware, theoryManagementController.getTheory);

module.exports = router;