import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-white">ReferHub</span>
            </div>
            <p className="text-sm text-gray-400">
              Connecting job seekers with employees who can refer them to their dream jobs.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-white transition-colors">Companies</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">For Referrers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-white transition-colors">Become a Referrer</Link></li>
              <li><Link to="/jobs" className="hover:text-white transition-colors">Post a Job</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 text-sm text-center text-gray-500">
          &copy; {new Date().getFullYear()} ReferHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
