const { Router } = require('express');
const { getAll, getById, updateStatus, remove } = require('../controllers/appointments.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = Router();

router.use(authMiddleware);

router.get('/', getAll);
router.get('/:id', getById);
router.patch('/:id/status', updateStatus);
router.delete('/:id', remove);

module.exports = router;
