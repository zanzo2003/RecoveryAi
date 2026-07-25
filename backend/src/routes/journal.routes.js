const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { getJournals, createJournal, getTip } = require('../controllers/journal.controller');

const router = express.Router();

router.get('/', authMiddleware, getJournals);
router.post('/', authMiddleware, createJournal);
router.get('/tip', authMiddleware, getTip);

module.exports = router;
