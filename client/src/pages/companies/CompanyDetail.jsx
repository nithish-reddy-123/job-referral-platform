import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompany } from '../../store/slices/companySlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  HiOfficeBuilding,
  HiLocationMarker,
  HiStar,
  HiUsers,
  HiGlobe,
  HiCalendar,
  HiBriefcase,
  HiCurrencyDollar,
  HiExternalLink,
  HiCheckCircle,
  HiChip,
  HiHeart,
  HiChatAlt2,
} from 'react-icons/hi';

const CompanyDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentCompany: company, companyJobs: jobs, isLoading } = useSelector(
    (state) => state.companies
  );

  useEffect(() => {
    dispatch(fetchCompany(slug));
  }, [dispatch, slug]);

  if (isLoading || !company) return <LoadingSpinner size="lg" className="py-20" />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Card */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {/* Logo */}
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
            {company.logo?.url ? (
              <img src={company.logo.url} alt={company.name} className="w-full h-full object-contain p-2" />
            ) : (
              <HiOfficeBuilding className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {company.name}
              </h1>
              {company.isVerified && (
                <HiCheckCircle className="h-6 w-6 text-blue-500" title="Verified Company" />
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-3">{company.industry}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {company.headquarters?.city && (
                <span className="flex items-center gap-1">
                  <HiLocationMarker className="h-4 w-4" />
                  {company.headquarters.city}
                  {company.headquarters.state && `, ${company.headquarters.state}`}
                  {company.headquarters.country && `, ${company.headquarters.country}`}
                </span>
              )}
              {company.size && (
                <span className="flex items-center gap-1">
                  <HiUsers className="h-4 w-4" />
                  {company.size} employees
                </span>
              )}
              {company.founded && (
                <span className="flex items-center gap-1">
                  <HiCalendar className="h-4 w-4" />
                  Founded {company.founded}
                </span>
              )}
              {company.averageRating > 0 && (
                <span className="flex items-center gap-1">
                  <HiStar className="h-4 w-4 text-yellow-400" />
                  {company.averageRating.toFixed(1)} ({company.totalReviews?.toLocaleString()} reviews)
                </span>
              )}
            </div>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
              >
                <HiGlobe className="h-4 w-4" />
                {company.website.replace(/^https?:\/\//, '')}
                <HiExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          {company.description && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{company.description}</p>
            </div>
          )}

          {/* Culture */}
          {company.culture && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <HiChatAlt2 className="h-5 w-5 text-purple-500" />
                Culture
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{company.culture}</p>
            </div>
          )}

          {/* Open Positions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HiBriefcase className="h-5 w-5 text-primary-500" />
              Open Positions ({jobs?.length || 0})
            </h2>

            {jobs && jobs.length > 0 ? (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <Link
                    key={job._id}
                    to={`/jobs/${job._id}`}
                    className="block p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                          {job.location?.city && (
                            <span className="flex items-center gap-1">
                              <HiLocationMarker className="h-3.5 w-3.5" />
                              {job.location.city}
                            </span>
                          )}
                          {job.type && (
                            <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                              {job.type}
                            </span>
                          )}
                          {job.experienceLevel && (
                            <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
                              {job.experienceLevel}
                            </span>
                          )}
                        </div>
                      </div>
                      {job.salary?.min && (
                        <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1 whitespace-nowrap">
                          <HiCurrencyDollar className="h-4 w-4" />
                          {(job.salary.min / 1000).toFixed(0)}k - {(job.salary.max / 1000).toFixed(0)}k
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-6">
                No open positions at the moment.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tech Stack */}
          {company.techStack && company.techStack.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <HiChip className="h-5 w-5 text-indigo-500" />
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {company.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {company.benefits && company.benefits.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <HiHeart className="h-5 w-5 text-pink-500" />
                Benefits
              </h3>
              <ul className="space-y-2">
                {company.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <HiCheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Locations */}
          {company.locations && company.locations.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <HiLocationMarker className="h-5 w-5 text-red-500" />
                Office Locations
              </h3>
              <ul className="space-y-2">
                {company.locations.map((loc, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-300">
                    {loc.city}
                    {loc.state && `, ${loc.state}`}
                    {loc.country && ` — ${loc.country}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social Links */}
          {company.socialLinks && Object.keys(company.socialLinks).length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <HiGlobe className="h-5 w-5 text-blue-500" />
                Connect
              </h3>
              <div className="space-y-2">
                {Object.entries(company.socialLinks).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline capitalize"
                  >
                    <HiExternalLink className="h-3.5 w-3.5" />
                    {platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
