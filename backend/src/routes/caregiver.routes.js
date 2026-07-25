const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { getSummary, generateRecoveryReport } = require('../controllers/caregiver.controller');

const router = express.Router();

router.get('/summary', authMiddleware, getSummary);
router.post('/report', authMiddleware, generateRecoveryReport);

module.exports = router;
