import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead, markAllAsRead } from '../../store/slices/notificationSlice';
import { HiBell, HiCheck } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const notificationLinks = {
  referral: '/referrals',
  job: '/jobs',
  message: '/messages',
};

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications({}));
  }, [dispatch]);

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="btn-secondary text-sm flex items-center">
            <HiCheck className="mr-1" /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20">
          <HiBell className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => !notif.isRead && dispatch(markAsRead(notif._id))}
              className={`card cursor-pointer transition-colors ${
                !notif.isRead ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                  {notif.sender?.avatar?.url ? (
                    <img src={notif.sender.avatar.url} alt="" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <HiBell className="h-5 w-5 text-primary-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{notif.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{notif.message}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!notif.isRead && (
                  <div className="w-2.5 h-2.5 bg-primary-600 rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
