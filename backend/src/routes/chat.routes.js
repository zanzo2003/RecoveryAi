const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { chat, getSessions, getSession } = require('../controllers/chat.controller');

const router = express.Router();

router.post('/', authMiddleware, chat);
router.get('/sessions', authMiddleware, getSessions);
router.get('/sessions/:sessionId', authMiddleware, getSession);

module.exports = router;
