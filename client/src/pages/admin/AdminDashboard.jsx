import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  HiUsers, HiBriefcase, HiSwitchHorizontal, HiOfficeBuilding,
  HiCheckCircle, HiClock,
} from 'react-icons/hi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data.data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;
  if (!stats) return <p className="text-center py-20 text-gray-500">Failed to load dashboard</p>;

  const statCards = [
    { label: 'Total Users', value: stats.overview.totalUsers, icon: HiUsers, color: 'bg-blue-500' },
    { label: 'Active Jobs', value: stats.overview.activeJobs, icon: HiBriefcase, color: 'bg-green-500' },
    { label: 'Total Referrals', value: stats.overview.totalReferrals, icon: HiSwitchHorizontal, color: 'bg-purple-500' },
    { label: 'Companies', value: stats.overview.totalCompanies, icon: HiOfficeBuilding, color: 'bg-orange-500' },
    { label: 'Pending Referrals', value: stats.overview.pendingReferrals, icon: HiClock, color: 'bg-yellow-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="card">
            <div className="flex items-center space-x-3">
              <div className={`${stat.color} p-2.5 rounded-lg`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <div className="card">
          <h3 className="font-semibold mb-4 dark:text-white">Users by Role</h3>
          <div className="space-y-3">
            {stats.usersByRole.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="capitalize text-gray-700 dark:text-gray-300">{item._id}</span>
                <span className="font-semibold dark:text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Referrals by Status */}
        <div className="card">
          <h3 className="font-semibold mb-4 dark:text-white">Referrals by Status</h3>
          <div className="space-y-3">
            {stats.referralsByStatus.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="capitalize text-gray-700 dark:text-gray-300">{item._id}</span>
                <span className="font-semibold dark:text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="card">
          <h3 className="font-semibold mb-4 dark:text-white">Recent Users</h3>
          <div className="space-y-3">
            {stats.recentUsers?.map((user) => (
              <div key={user._id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium dark:text-white">{user.firstName} {user.lastName}</p>
                  <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <span className="badge-gray capitalize">{user.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="card">
          <h3 className="font-semibold mb-4 dark:text-white">Recent Referrals</h3>
          <div className="space-y-3">
            {stats.recentReferrals?.map((ref) => (
              <div key={ref._id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium dark:text-white">{ref.job?.title}</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {ref.jobSeeker?.firstName} → {ref.referrer?.firstName}
                  </p>
                </div>
                <span className="badge-info capitalize">{ref.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
