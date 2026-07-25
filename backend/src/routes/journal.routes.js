const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { getJournals, createJournal } = require('../controllers/journal.controller');

const router = express.Router();

router.get('/', authMiddleware, getJournals);
router.post('/', authMiddleware, createJournal);

module.exports = router;
