import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  setCurrentConversation,
  addMessage,
} from '../../store/slices/messageSlice';
import { getSocket } from '../../services/socket';
import { HiPaperAirplane, HiChat } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';

const Messages = () => {
  const dispatch = useDispatch();
  const { conversations, currentConversation, messages } = useSelector(
    (state) => state.messages
  );
  const { user } = useSelector((state) => state.auth);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.on('new_message', ({ conversationId, message }) => {
        if (currentConversation?._id === conversationId) {
          dispatch(addMessage(message));
        }
        // Refresh conversations to update last message
        dispatch(fetchConversations());
      });

      socket.on('typing_start', ({ conversationId }) => {
        if (currentConversation?._id === conversationId) {
          setIsTyping(true);
        }
      });

      socket.on('typing_stop', ({ conversationId }) => {
        if (currentConversation?._id === conversationId) {
          setIsTyping(false);
        }
      });

      return () => {
        socket.off('new_message');
        socket.off('typing_start');
        socket.off('typing_stop');
      };
    }
  }, [currentConversation, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectConversation = (conv) => {
    dispatch(setCurrentConversation(conv));
    dispatch(fetchMessages({ conversationId: conv._id }));

    const socket = getSocket();
    if (socket) {
      socket.emit('join_conversation', conv._id);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentConversation) return;

    await dispatch(
      sendMessage({ conversationId: currentConversation._id, content: newMessage })
    );
    setNewMessage('');

    const socket = getSocket();
    if (socket) {
      socket.emit('typing_stop', { conversationId: currentConversation._id });
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    const socket = getSocket();
    if (socket && currentConversation) {
      socket.emit('typing_start', { conversationId: currentConversation._id });
      setTimeout(() => {
        socket.emit('typing_stop', { conversationId: currentConversation._id });
      }, 2000);
    }
  };

  const getOtherParticipant = (conv) => {
    return conv.participants?.find((p) => p._id !== user?._id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Messages</h1>

      <div className="card p-0 overflow-hidden" style={{ height: '70vh' }}>
        <div className="flex h-full">
          {/* Conversation List */}
          <div className="w-80 border-r dark:border-gray-700 flex-shrink-0 flex flex-col">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => {
                  const other = getOtherParticipant(conv);
                  const isActive = currentConversation?._id === conv._id;
                  const unread = conv.unreadCount?.[user?._id] || 0;

                  return (
                    <button
                      key={conv._id}
                      onClick={() => selectConversation(conv)}
                      className={`w-full p-4 text-left border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        isActive ? 'bg-primary-50 dark:bg-primary-900/20 border-l-2 border-l-primary-600' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                            {other?.firstName?.[0]}{other?.lastName?.[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-sm truncate">
                              {other?.firstName} {other?.lastName}
                            </p>
                            {unread > 0 && (
                              <span className="bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {unread}
                              </span>
                            )}
                          </div>
                          {conv.lastMessageAt && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                        {getOtherParticipant(currentConversation)?.firstName?.[0]}
                        {getOtherParticipant(currentConversation)?.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {getOtherParticipant(currentConversation)?.firstName}{' '}
                        {getOtherParticipant(currentConversation)?.lastName}
                      </p>
                      {isTyping && (
                        <p className="text-xs text-primary-600">typing...</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
                  {messages.map((msg) => {
                    const isMine = msg.sender?._id === user?._id;
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
                            isMine
                              ? 'bg-primary-600 text-white rounded-br-md'
                              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md shadow-sm'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isMine ? 'text-primary-200' : 'text-gray-400'
                            }`}
                          >
                            {formatDistanceToNow(new Date(msg.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSend} className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-900">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={handleTyping}
                      placeholder="Type a message..."
                      className="input-field flex-1"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="btn-primary px-4"
                    >
                      <HiPaperAirplane className="h-5 w-5 rotate-90" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <HiChat className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Choose a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
