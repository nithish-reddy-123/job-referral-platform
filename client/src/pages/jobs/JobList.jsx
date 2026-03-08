import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchJobs, setFilters } from '../../store/slices/jobSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { HiLocationMarker, HiBriefcase, HiClock, HiBookmark, HiSearch } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';

const JobList = () => {
  const dispatch = useDispatch();
  const { jobs, pagination, isLoading, filters } = useSelector((state) => state.jobs);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = {
      q: searchParams.get('q') || filters.q,
      type: searchParams.get('type') || filters.type,
      experienceLevel: searchParams.get('level') || filters.experienceLevel,
      page: searchParams.get('page') || 1,
    };
    dispatch(fetchJobs(params));
  }, [dispatch, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const q = formData.get('search');
    setSearchParams({ q });
    dispatch(setFilters({ q }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Find Jobs</h1>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-grow">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="search"
              defaultValue={filters.q}
              placeholder="Search jobs by title, skill, or company..."
              className="input-field pl-12"
            />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {['full-time', 'part-time', 'contract', 'internship', 'remote'].map((type) => (
          <button
            key={type}
            onClick={() => {
              setSearchParams({ type });
              dispatch(setFilters({ type }));
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              filters.type === type
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-primary-300'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Job List */}
      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : jobs.length === 0 ? (
        <div className="text-center py-20">
          <HiBriefcase className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">No jobs found</h3>
          <p className="text-gray-400 dark:text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link
              key={job._id}
              to={`/jobs/${job._id}`}
              className="card block hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {/* Company Logo */}
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {job.company?.logo?.url ? (
                      <img src={job.company.logo.url} alt="" className="w-full h-full object-contain p-2" />
                    ) : (
                      <span className="text-gray-400 font-bold text-lg">
                        {job.company?.name?.[0]}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{job.company?.name}</p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {job.location?.city && (
                        <span className="flex items-center">
                          <HiLocationMarker className="mr-1 h-4 w-4" />
                          {job.location.city}, {job.location.country}
                        </span>
                      )}
                      <span className="flex items-center">
                        <HiBriefcase className="mr-1 h-4 w-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center">
                        <HiClock className="mr-1 h-4 w-4" />
                        {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    {/* Skills */}
                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills.slice(0, 5).map((skill) => (
                          <span key={skill} className="badge-gray">{skill}</span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="badge-gray">+{job.skills.length - 5}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Salary & Bookmark */}
                <div className="text-right flex-shrink-0">
                  {job.salary?.min && (
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${job.salary.min.toLocaleString()} - ${job.salary.max?.toLocaleString()}
                    </p>
                  )}
                  <span className={`mt-2 inline-block ${
                    job.experienceLevel === 'entry' ? 'badge-success' :
                    job.experienceLevel === 'mid' ? 'badge-info' :
                    job.experienceLevel === 'senior' ? 'badge-warning' : 'badge-gray'
                  }`}>
                    {job.experienceLevel}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setSearchParams({ page: page.toString() })}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                pagination.page === page
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
