import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchReferrals, updateReferralStatus } from '../../store/slices/referralSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiArrowRight, HiCheck, HiX, HiEye, HiChat } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';

const statusColors = {
  pending: 'badge-warning',
  viewed: 'badge-info',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
  submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400',
  interviewing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400',
  hired: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400',
  rejected: 'badge-danger',
  withdrawn: 'badge-gray',
  expired: 'badge-gray',
};

const Referrals = () => {
  const dispatch = useDispatch();
  const { referrals, pagination, isLoading } = useSelector((state) => state.referrals);
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(user?.role === 'referrer' ? 'received' : 'sent');

  useEffect(() => {
    dispatch(
      fetchReferrals({
        type: activeTab === 'received' ? 'received' : undefined,
      })
    );
  }, [dispatch, activeTab]);

  const handleStatusUpdate = async (id, status) => {
    const result = await dispatch(updateReferralStatus({ id, status }));
    if (updateReferralStatus.fulfilled.match(result)) {
      toast.success(`Referral ${status}`);
    } else {
      toast.error(result.payload || 'Failed to update');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Referrals</h1>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6 max-w-xs">
        {[
          { key: 'sent', label: 'Sent' },
          ...(user?.role === 'referrer' ? [{ key: 'received', label: 'Received' }] : []),
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : referrals.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">No referrals yet</h3>
          <p className="text-gray-400 dark:text-gray-500 mt-2">
            {activeTab === 'sent'
              ? 'Browse jobs and request referrals to get started'
              : 'Your referral requests from job seekers will appear here'}
          </p>
          {activeTab === 'sent' && (
            <Link to="/jobs" className="btn-primary inline-flex items-center mt-4">
              Browse Jobs <HiArrowRight className="ml-2" />
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {referrals.map((referral) => (
            <div key={referral._id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                    {activeTab === 'received' ? (
                      <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                        {referral.jobSeeker?.firstName?.[0]}{referral.jobSeeker?.lastName?.[0]}
                      </span>
                    ) : (
                      <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                        {referral.referrer?.firstName?.[0]}{referral.referrer?.lastName?.[0]}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {referral.job?.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activeTab === 'received' ? (
                        <>From: {referral.jobSeeker?.firstName} {referral.jobSeeker?.lastName}</>
                      ) : (
                        <>To: {referral.referrer?.firstName} {referral.referrer?.lastName}</>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(referral.createdAt), { addSuffix: true })}
                    </p>
                    {referral.message && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 max-w-lg">
                        "{referral.message.slice(0, 200)}{referral.message.length > 200 ? '...' : ''}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`badge ${statusColors[referral.status]}`}>
                    {referral.status}
                  </span>

                  {/* Actions for referrer */}
                  {activeTab === 'received' && referral.status === 'pending' && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleStatusUpdate(referral._id, 'accepted')}
                        className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                      >
                        <HiCheck className="mr-1" /> Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(referral._id, 'rejected')}
                        className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                      >
                        <HiX className="mr-1" /> Reject
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2 mt-1">
                    <Link
                      to={`/referrals/${referral._id}`}
                      className="text-sm text-primary-600 hover:underline flex items-center"
                    >
                      <HiEye className="mr-1" /> View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Referrals;
