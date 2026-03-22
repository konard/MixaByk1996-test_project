const { Router } = require('express');
const { getDashboard, getStatistics } = require('../controllers/stats.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = Router();

router.use(authMiddleware);

router.get('/dashboard', getDashboard);
router.get('/statistics', getStatistics);

module.exports = router;
