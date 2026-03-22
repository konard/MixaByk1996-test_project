const { Router } = require('express');
const { login, getProfile, createAdmin } = require('../controllers/auth.controller');
const { authMiddleware, requireSuperAdmin } = require('../middleware/auth.middleware');

const router = Router();

router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.post('/admins', authMiddleware, requireSuperAdmin, createAdmin);

module.exports = router;
