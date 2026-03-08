import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiMail, HiArrowLeft, HiCheckCircle } from 'react-icons/hi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setIsSubmitted(true);
      toast.success('Check your email for reset instructions');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot password?</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <div className="card">
          {isSubmitted ? (
            <div className="text-center py-4">
              <HiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Check your email</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                We sent a password reset link to
              </p>
              <p className="font-medium text-gray-900 dark:text-white mb-6">{email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Didn't receive the email?{' '}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary-600 font-medium hover:underline"
                >
                  Click to resend
                </button>
              </p>
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-primary-600 font-medium hover:underline"
              >
                <HiArrowLeft className="mr-1 h-4 w-4" /> Back to login
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full"
                >
                  {isLoading ? 'Sending...' : 'Send reset link'}
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

export default ForgotPassword;
