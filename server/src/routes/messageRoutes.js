const express = require('express');
const router = express.Router();
const {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.post('/conversations', protect, getOrCreateConversation);
router.get('/conversations', protect, getConversations);
router.get('/:conversationId', protect, getMessages);
router.post('/:conversationId', protect, sendMessage);

module.exports = router;
