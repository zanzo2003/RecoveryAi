const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { chat } = require('../controllers/chat.controller');

const router = express.Router();

router.post('/', authMiddleware, chat);

module.exports = router;
