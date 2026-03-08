import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyJobs, deleteJob } from '../../store/slices/jobSlice';
import toast from 'react-hot-toast';
import {
  HiBriefcase,
  HiPlus,
  HiEye,
  HiTrash,
  HiLocationMarker,
  HiCurrencyDollar,
  HiClock,
  HiUsers,
  HiIdentification,
  HiExternalLink,
} from 'react-icons/hi';

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  closed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const MyJobs = () => {
  const dispatch = useDispatch();
  const { myJobs, myJobsPagination, isLoading } = useSelector((state) => state.jobs);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchMyJobs({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handleDelete = async (jobId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    const result = await dispatch(deleteJob(jobId));
    if (deleteJob.fulfilled.match(result)) {
      toast.success('Job deleted');
    } else {
      toast.error(result.payload || 'Failed to delete job');
    }
  };

  const formatSalary = (salary) => {
    if (!salary || !salary.min) return null;
    const fmt = (n) => Number(n).toLocaleString();
    return salary.max && salary.max !== salary.min
      ? `$${fmt(salary.min)} - $${fmt(salary.max)}`
      : `$${fmt(salary.min)}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <HiBriefcase className="h-8 w-8 text-primary-600" />
            My Posted Jobs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {myJobsPagination?.total || 0} job{(myJobsPagination?.total || 0) !== 1 ? 's' : ''} posted
          </p>
        </div>
        <Link to="/post-job" className="btn-primary flex items-center gap-2">
          <HiPlus className="h-5 w-5" />
          Post New Job
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && myJobs.length === 0 && (
        <div className="text-center py-16 card">
          <HiBriefcase className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No jobs posted yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Start by posting a job to help job seekers get referred
          </p>
          <Link to="/post-job" className="btn-primary inline-flex items-center gap-2">
            <HiPlus className="h-5 w-5" />
            Post Your First Job
          </Link>
        </div>
      )}

      {/* Job Cards */}
      {!isLoading && myJobs.length > 0 && (
        <div className="space-y-4">
          {myJobs.map((job) => (
            <div
              key={job._id}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Job Info */}
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {job.title}
                    </Link>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[job.status] || statusColors.active}`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                    {job.company?.name && (
                      <span className="flex items-center gap-1">
                        <HiBriefcase className="h-4 w-4" />
                        {job.company.name}
                      </span>
                    )}
                    {(job.location?.city || job.location?.remote) && (
                      <span className="flex items-center gap-1">
                        <HiLocationMarker className="h-4 w-4" />
                        {job.location?.remote ? 'Remote' : `${job.location.city}${job.location.state ? `, ${job.location.state}` : ''}`}
                      </span>
                    )}
                    {formatSalary(job.salary) && (
                      <span className="flex items-center gap-1">
                        <HiCurrencyDollar className="h-4 w-4" />
                        {formatSalary(job.salary)}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <HiClock className="h-4 w-4" />
                      {job.type}
                    </span>
                  </div>

                  {/* Referral ID & Stats Row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-2">
                    {job.referralId && (
                      <span className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium">
                        <HiIdentification className="h-4 w-4" />
                        Referral ID: {job.referralId}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <HiEye className="h-4 w-4" />
                      {job.views || 0} views
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <HiUsers className="h-4 w-4" />
                      {job.currentReferrals || 0} / {job.maxReferrals || 10} referrals
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                    title="View Job"
                  >
                    <HiExternalLink className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(job._id, job.title)}
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                    title="Delete Job"
                  >
                    <HiTrash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {myJobsPagination && myJobsPagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: myJobsPagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
