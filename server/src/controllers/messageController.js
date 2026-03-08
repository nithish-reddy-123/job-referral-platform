const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get or create a conversation between two users
// @route   POST /api/messages/conversations
const getOrCreateConversation = async (req, res, next) => {
  try {
    const { participantId, referralId } = req.body;

    if (participantId === req.user._id.toString()) {
      throw new AppError('Cannot create conversation with yourself', 400);
    }

    // Check for existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, participantId] },
      ...(referralId && { referral: referralId }),
    }).populate('participants', 'firstName lastName avatar')
      .populate('lastMessage');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, participantId],
        ...(referralId && { referral: referralId }),
      });
      await conversation.populate('participants', 'firstName lastName avatar');
    }

    res.json({
      success: true,
      data: { conversation },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all conversations for current user
// @route   GET /api/messages/conversations
const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
      isActive: true,
    })
      .populate('participants', 'firstName lastName avatar headline')
      .populate('lastMessage')
      .populate('referral', 'status job')
      .sort({ lastMessageAt: -1 });

    res.json({
      success: true,
      data: { conversations },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/:conversationId
const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    // Check if user is a participant
    if (!conversation.participants.includes(req.user._id)) {
      throw new AppError('Not authorized to view these messages', 403);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find({
      conversation: conversationId,
      isDeleted: false,
    })
      .populate('sender', 'firstName lastName avatar')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: req.user._id },
        'readBy.user': { $ne: req.user._id },
      },
      {
        $push: { readBy: { user: req.user._id, readAt: new Date() } },
      }
    );

    // Reset unread count
    conversation.unreadCount.set(req.user._id.toString(), 0);
    await conversation.save();

    res.json({
      success: true,
      data: { messages: messages.reverse() },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/messages/:conversationId
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { content, type = 'text' } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    if (!conversation.participants.includes(req.user._id)) {
      throw new AppError('Not authorized to send messages here', 403);
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      content,
      type,
      readBy: [{ user: req.user._id }],
    });

    await message.populate('sender', 'firstName lastName avatar');

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();

    // Increment unread count for other participants
    conversation.participants.forEach((participantId) => {
      if (participantId.toString() !== req.user._id.toString()) {
        const currentCount = conversation.unreadCount.get(participantId.toString()) || 0;
        conversation.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });
    await conversation.save();

    // Emit message via Socket.io
    const io = req.app.get('io');
    if (io) {
      conversation.participants.forEach((participantId) => {
        if (participantId.toString() !== req.user._id.toString()) {
          io.to(`user:${participantId}`).emit('new_message', {
            conversationId,
            message,
          });
        }
      });
    }

    res.status(201).json({
      success: true,
      data: { message },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
};
