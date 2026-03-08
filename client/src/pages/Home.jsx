import { Link } from 'react-router-dom';
import { HiSearch, HiBriefcase, HiUserGroup, HiShieldCheck, HiArrowRight } from 'react-icons/hi';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden min-h-[520px] lg:min-h-[600px]">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
            poster="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80"
          >
            <source
              src="/hero-bg.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/70 to-gray-900/40" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
              Get Referred to Your <span className="text-yellow-400">Dream Job</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-200 mb-8 leading-relaxed">
              Connect directly with employees at top companies who can refer you.
              Skip the queue, get noticed, and land your next role faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/jobs" className="inline-flex items-center justify-center bg-white text-gray-900 px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg">
                <HiSearch className="mr-2 h-5 w-5" />
                Browse Jobs
              </Link>
              <Link to="/register" className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-all backdrop-blur-sm">
                Join as Referrer
                <HiArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-gray-900 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '10K+', label: 'Job Openings' },
              { num: '5K+', label: 'Referrers' },
              { num: '500+', label: 'Companies' },
              { num: '85%', label: 'Success Rate' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{stat.num}</div>
                <div className="text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get referred in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: HiSearch,
                title: 'Find a Job',
                desc: 'Browse thousands of job openings from top companies and find the role that matches your skills.',
                step: '01',
              },
              {
                icon: HiUserGroup,
                title: 'Request a Referral',
                desc: 'Connect with verified employees at your target company and request a referral with your profile.',
                step: '02',
              },
              {
                icon: HiShieldCheck,
                title: 'Get Referred',
                desc: 'Once accepted, your referrer submits your profile directly, boosting your chances significantly.',
                step: '03',
              },
            ].map((item) => (
              <div key={item.step} className="card text-center group hover:shadow-md transition-shadow">
                <div className="text-5xl font-extrabold text-primary-100 dark:text-primary-900 mb-4">{item.step}</div>
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/40 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors">
                  <item.icon className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Referrers */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-info mb-4 inline-block">For Employees</span>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Help Others. Earn Rewards.
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                As a referrer, you can help talented professionals get noticed while earning referral bonuses from your company.
                It's a win-win.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Post job openings from your company',
                  'Review candidates and their profiles',
                  'Earn referral bonuses on successful hires',
                  'Build your professional network',
                ].map((item) => (
                  <li key={item} className="flex items-start">
                    <HiShieldCheck className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-primary inline-flex items-center">
                Become a Referrer
                <HiArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <HiBriefcase className="h-24 w-24 text-primary-300 dark:text-primary-600 mx-auto mb-4" />
                <p className="text-primary-600 dark:text-primary-400 font-medium">Join 5,000+ referrers helping shape careers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"
            alt="Team working together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/75" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Your Dream Job?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Sign up today and start connecting with referrers at top companies.
          </p>
          <Link to="/register" className="inline-flex items-center bg-white text-gray-900 px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg">
            Get Started — It's Free
            <HiArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
