const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
} = require('../controllers/emergency-contacts.controller');

const router = express.Router();

router.get('/', authMiddleware, getContacts);
router.post('/', authMiddleware, addContact);
router.put('/:contactId', authMiddleware, updateContact);
router.delete('/:contactId', authMiddleware, deleteContact);

module.exports = router;
