import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiLockClosed, HiCheckCircle, HiArrowLeft } from 'react-icons/hi';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await api.post(`/auth/reset-password/${token}`, {
        password: formData.password,
      });
      setIsReset(true);
      toast.success('Password reset successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isReset ? 'Password reset!' : 'Set new password'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {isReset
              ? 'Your password has been successfully reset.'
              : 'Your new password must be at least 8 characters.'}
          </p>
        </div>

        <div className="card">
          {isReset ? (
            <div className="text-center py-4">
              <HiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You can now sign in with your new password.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="btn-primary w-full"
              >
                Go to login
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New password
                  </label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm password
                  </label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || formData.password !== formData.confirmPassword}
                  className="btn-primary w-full"
                >
                  {isLoading ? 'Resetting...' : 'Reset password'}
                </button>
              </form>

              <div className="text-center mt-6">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-primary-600 font-medium hover:underline"
                >
                  <HiArrowLeft className="mr-1 h-4 w-4" /> Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
