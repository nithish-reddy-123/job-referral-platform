import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJob } from '../../store/slices/jobSlice';
import { createReferral } from '../../store/slices/referralSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  HiLocationMarker, HiBriefcase, HiClock, HiCurrencyDollar,
  HiUserGroup, HiBookmark, HiExternalLink, HiChat,
  HiIdentification,
} from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';

const JobDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentJob: job, isLoading } = useSelector((state) => state.jobs);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralMessage, setReferralMessage] = useState('');

  useEffect(() => {
    dispatch(fetchJob(id));
  }, [dispatch, id]);

  const handleRequestReferral = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to request a referral');
      return;
    }

    const result = await dispatch(
      createReferral({
        job: job._id,
        referrer: job.postedBy._id,
        message: referralMessage,
      })
    );

    if (createReferral.fulfilled.match(result)) {
      toast.success('Referral request sent!');
      setShowReferralModal(false);
      setReferralMessage('');
    } else {
      toast.error(result.payload || 'Failed to send request');
    }
  };

  if (isLoading || !job) {
    return <LoadingSpinner size="lg" className="py-20" />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="card mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden">
              {job.company?.logo?.url ? (
                <img src={job.company.logo.url} alt="" className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-gray-400 font-bold text-2xl">{job.company?.name?.[0]}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
              <Link to={`/companies/${job.company?.slug}`} className="text-primary-600 hover:underline font-medium">
                {job.company?.name}
              </Link>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                {job.location?.city && (
                  <span className="flex items-center">
                    <HiLocationMarker className="mr-1" /> {job.location.city}, {job.location.country}
                  </span>
                )}
                <span className="flex items-center">
                  <HiBriefcase className="mr-1" /> {job.type}
                </span>
                <span className="flex items-center">
                  <HiClock className="mr-1" /> {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </span>
                {job.salary?.min && (
                  <span className="flex items-center">
                    <HiCurrencyDollar className="mr-1" />
                    ${job.salary.min.toLocaleString()} - ${job.salary.max?.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {user?.role === 'jobseeker' && (
              <button
                onClick={() => setShowReferralModal(true)}
                className="btn-primary"
              >
                Request Referral
              </button>
            )}
          </div>
        </div>

        {/* Posted by */}
        {job.postedBy && (
          <div className="mt-6 pt-4 border-t dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                {job.postedBy.avatar?.url ? (
                  <img src={job.postedBy.avatar.url} alt="" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Posted by {job.postedBy.firstName} {job.postedBy.lastName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{job.postedBy.currentPosition}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <HiUserGroup className="h-4 w-4" />
              {job.views} views · {job.currentReferrals}/{job.maxReferrals} referrals
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Job Description</h2>
            <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {job.description}
            </div>
          </div>

          {job.requirements?.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.responsibilities?.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Responsibilities</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold mb-3 dark:text-white">Job Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Experience Level</dt>
                <dd className="font-medium capitalize dark:text-white">{job.experienceLevel}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Job Type</dt>
                <dd className="font-medium capitalize dark:text-white">{job.type}</dd>
              </div>
              {job.department && (
                <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Department</dt>
                <dd className="font-medium dark:text-white">{job.department}</dd>
                </div>
              )}
              {job.referralBonus?.amount && (
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Referral Bonus</dt>
                  <dd className="font-medium text-green-600">
                    ${job.referralBonus.amount.toLocaleString()}
                  </dd>
                </div>
              )}
              {job.referralId && (
                <div className="flex justify-between items-center">
                  <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <HiIdentification className="h-4 w-4" /> Referral ID
                  </dt>
                  <dd className="font-medium text-primary-600 dark:text-primary-400">{job.referralId}</dd>
                </div>
              )}
            </dl>
          </div>

          {job.skills?.length > 0 && (
            <div className="card">
              <h3 className="font-semibold mb-3 dark:text-white">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span key={skill} className="badge-gray">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Referral Request Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Request a Referral</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Send a referral request to <strong>{job.postedBy?.firstName}</strong> for <strong>{job.title}</strong>.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Why should they refer you? *
              </label>
              <textarea
                value={referralMessage}
                onChange={(e) => setReferralMessage(e.target.value)}
                className="input-field h-32 resize-none"
                placeholder="Explain why you're a great fit for this role..."
                maxLength={2000}
              />
              <p className="text-xs text-gray-400 mt-1">{referralMessage.length}/2000</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReferralModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestReferral}
                disabled={!referralMessage.trim()}
                className="btn-primary"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
