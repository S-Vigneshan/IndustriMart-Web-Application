const express = require('express');
const router = express.Router();
const { createContact, getAllContacts, deleteContact } = require('../controllers/contactController');
const authMiddleware = require('../middleware/auth');

router.post('/', createContact);
router.get('/', authMiddleware, getAllContacts);
router.delete('/:id', authMiddleware, deleteContact);

module.exports = router;