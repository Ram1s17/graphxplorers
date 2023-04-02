const Router = require('express').Router;
const authController = require('../controllers/auth_controller');
const adminController = require('../controllers/admin_controller');
const authMiddleware = require('../middlewares/auth_middleware');
const adminMiddleware = require('../middlewares/admin_middleware');

const router = new Router();

router.post('/registration', authController.registration);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot_password', authController.forgotPassword);
router.post('/check_reset_link', authController.checkResetLink);
router.put('/reset_password', authController.resetPassword);
router.get('/refresh', authController.refresh);

router.get('/moderators', authMiddleware, adminMiddleware, adminController.getAllModerators);

module.exports = router;