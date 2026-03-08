import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies } from '../../store/slices/companySlice';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { HiOfficeBuilding, HiLocationMarker, HiStar } from 'react-icons/hi';

const Companies = () => {
  const dispatch = useDispatch();
  const { companies, isLoading } = useSelector((state) => state.companies);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Companies</h1>

      {companies.length === 0 ? (
        <div className="text-center py-20">
          <HiOfficeBuilding className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">No companies yet</h3>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Link
              key={company._id}
              to={`/companies/${company.slug}`}
              className="card hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {company.logo?.url ? (
                    <img src={company.logo.url} alt="" className="w-full h-full object-contain p-2" />
                  ) : (
                    <HiOfficeBuilding className="h-7 w-7 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{company.industry}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                {company.headquarters?.city && (
                  <span className="flex items-center">
                    <HiLocationMarker className="mr-1 h-4 w-4" />
                    {company.headquarters.city}
                  </span>
                )}
                {company.size && <span>{company.size} employees</span>}
                {company.averageRating > 0 && (
                  <span className="flex items-center">
                    <HiStar className="mr-1 h-4 w-4 text-yellow-400" />
                    {company.averageRating.toFixed(1)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;
