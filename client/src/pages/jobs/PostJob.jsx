import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../../store/slices/jobSlice';
import toast from 'react-hot-toast';
import api from '../../services/api';
import {
  HiBriefcase,
  HiOfficeBuilding,
  HiLocationMarker,
  HiCurrencyDollar,
  HiIdentification,
  HiPlus,
  HiX,
} from 'react-icons/hi';

const PostJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [showNewCompany, setShowNewCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyIndustry, setNewCompanyIndustry] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [responsibilityInput, setResponsibilityInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    type: 'full-time',
    experienceLevel: 'mid',
    department: '',
    referralId: '',
    skills: [],
    requirements: [],
    responsibilities: [],
    salary: { min: '', max: '', currency: 'USD', isNegotiable: false },
    location: { city: '', state: '', country: '', remote: false },
    referralBonus: { amount: '', currency: 'USD' },
    applicationDeadline: '',
    applicationUrl: '',
    maxReferrals: 10,
    isReferralOnly: false,
  });

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const { data } = await api.get('/companies', { params: { limit: 100 } });
        setCompanies(data.data.companies || []);
      } catch (err) {
        console.error('Failed to load companies');
      }
    };
    loadCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: inputType === 'checkbox' ? checked : value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: inputType === 'checkbox' ? checked : value,
      }));
    }
  };

  const addToList = (field, value, setter) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      setter('');
    }
  };

  const removeFromList = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleCreateCompany = async () => {
    if (!newCompanyName.trim() || !newCompanyIndustry.trim()) {
      toast.error('Company name and industry are required');
      return;
    }
    try {
      const { data } = await api.post('/companies', {
        name: newCompanyName,
        industry: newCompanyIndustry,
      });
      const company = data.data.company;
      setCompanies((prev) => [...prev, company]);
      setFormData((prev) => ({ ...prev, company: company._id }));
      setShowNewCompany(false);
      setNewCompanyName('');
      setNewCompanyIndustry('');
      toast.success('Company created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create company');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company) {
      toast.error('Please select or create a company');
      return;
    }
    if (!formData.title.trim()) {
      toast.error('Job title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Job description is required');
      return;
    }

    setIsSubmitting(true);

    // Clean up data
    const submitData = { ...formData };
    if (!submitData.salary.min) delete submitData.salary;
    else {
      submitData.salary.min = Number(submitData.salary.min);
      submitData.salary.max = Number(submitData.salary.max) || submitData.salary.min;
    }
    if (!submitData.referralBonus.amount) delete submitData.referralBonus;
    else submitData.referralBonus.amount = Number(submitData.referralBonus.amount);
    if (!submitData.applicationDeadline) delete submitData.applicationDeadline;
    if (!submitData.applicationUrl) delete submitData.applicationUrl;
    if (!submitData.department) delete submitData.department;
    if (!submitData.referralId) delete submitData.referralId;

    const result = await dispatch(createJob(submitData));

    if (createJob.fulfilled.match(result)) {
      toast.success('Job posted successfully!');
      navigate('/my-jobs');
    } else {
      toast.error(result.payload || 'Failed to post job');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <HiBriefcase className="h-8 w-8 text-primary-600" />
          Post a Job
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Share a job opening from your company and help job seekers get referred
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Selection */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <HiOfficeBuilding className="h-5 w-5 text-primary-600" />
            Company Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company *
              </label>
              {!showNewCompany ? (
                <div className="flex gap-3">
                  <select
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="input-field flex-grow"
                  >
                    <option value="">Select a company</option>
                    {companies.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCompany(true)}
                    className="btn-secondary flex items-center gap-1 whitespace-nowrap"
                  >
                    <HiPlus className="h-4 w-4" /> New
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
                  <input
                    type="text"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="Company name"
                    className="input-field"
                  />
                  <input
                    type="text"
                    value={newCompanyIndustry}
                    onChange={(e) => setNewCompanyIndustry(e.target.value)}
                    placeholder="Industry (e.g., Technology, Finance)"
                    className="input-field"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={handleCreateCompany} className="btn-primary text-sm">
                      Create Company
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewCompany(false)}
                      className="btn-secondary text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <HiBriefcase className="h-5 w-5 text-primary-600" />
            Job Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Title / Position *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Engineering, Product, Marketing"
                className="input-field"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Type *
                </label>
                <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Experience Level *
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                className="input-field resize-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Referral ID */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <HiIdentification className="h-5 w-5 text-primary-600" />
            Referral Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Referral ID / Job Code
              </label>
              <input
                type="text"
                name="referralId"
                value={formData.referralId}
                onChange={handleChange}
                placeholder="e.g., REF-2026-ENG-042 or internal job code"
                className="input-field"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Internal referral ID or job code used by your company's referral system
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Referral Bonus Amount
                </label>
                <div className="relative">
                  <HiCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="referralBonus.amount"
                    value={formData.referralBonus.amount}
                    onChange={handleChange}
                    placeholder="e.g., 5000"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Referrals Allowed
                </label>
                <input
                  type="number"
                  name="maxReferrals"
                  value={formData.maxReferrals}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isReferralOnly"
                name="isReferralOnly"
                checked={formData.isReferralOnly}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 rounded border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="isReferralOnly" className="text-sm text-gray-700 dark:text-gray-300">
                This position is referral-only (no direct applications)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                External Application URL
              </label>
              <input
                type="url"
                name="applicationUrl"
                value={formData.applicationUrl}
                onChange={handleChange}
                placeholder="https://careers.company.com/apply/..."
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <HiLocationMarker className="h-5 w-5 text-primary-600" />
            Location
          </h2>

          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                placeholder="City"
                className="input-field"
              />
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                placeholder="State"
                className="input-field"
              />
              <input
                type="text"
                name="location.country"
                value={formData.location.country}
                onChange={handleChange}
                placeholder="Country"
                className="input-field"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remoteLocation"
                name="location.remote"
                checked={formData.location.remote}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 rounded border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="remoteLocation" className="text-sm text-gray-700 dark:text-gray-300">
                This is a remote position
              </label>
            </div>
          </div>
        </div>

        {/* Salary */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <HiCurrencyDollar className="h-5 w-5 text-primary-600" />
            Salary Range
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Minimum Salary
              </label>
              <input
                type="number"
                name="salary.min"
                value={formData.salary.min}
                onChange={handleChange}
                placeholder="e.g., 80000"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Maximum Salary
              </label>
              <input
                type="number"
                name="salary.max"
                value={formData.salary.max}
                onChange={handleChange}
                placeholder="e.g., 120000"
                className="input-field"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <input
              type="checkbox"
              id="salaryNegotiable"
              name="salary.isNegotiable"
              checked={formData.salary.isNegotiable}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 rounded border-gray-300 dark:border-gray-600"
            />
            <label htmlFor="salaryNegotiable" className="text-sm text-gray-700 dark:text-gray-300">
              Salary is negotiable
            </label>
          </div>
        </div>

        {/* Skills */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills Required</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); addToList('skills', skillInput, setSkillInput); }
              }}
              placeholder="Add a skill and press Enter"
              className="input-field flex-grow"
            />
            <button
              type="button"
              onClick={() => addToList('skills', skillInput, setSkillInput)}
              className="btn-secondary"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, i) => (
              <span key={i} className="badge-gray flex items-center gap-1">
                {skill}
                <button type="button" onClick={() => removeFromList('skills', i)}>
                  <HiX className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Requirements</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={requirementInput}
              onChange={(e) => setRequirementInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); addToList('requirements', requirementInput, setRequirementInput); }
              }}
              placeholder="Add a requirement and press Enter"
              className="input-field flex-grow"
            />
            <button
              type="button"
              onClick={() => addToList('requirements', requirementInput, setRequirementInput)}
              className="btn-secondary"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {formData.requirements.map((req, i) => (
              <li key={i} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full" />
                  {req}
                </span>
                <button type="button" onClick={() => removeFromList('requirements', i)}>
                  <HiX className="h-4 w-4 text-gray-400 hover:text-red-500" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Responsibilities */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Responsibilities</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={responsibilityInput}
              onChange={(e) => setResponsibilityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); addToList('responsibilities', responsibilityInput, setResponsibilityInput); }
              }}
              placeholder="Add a responsibility and press Enter"
              className="input-field flex-grow"
            />
            <button
              type="button"
              onClick={() => addToList('responsibilities', responsibilityInput, setResponsibilityInput)}
              className="btn-secondary"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {formData.responsibilities.map((resp, i) => (
              <li key={i} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  {resp}
                </span>
                <button type="button" onClick={() => removeFromList('responsibilities', i)}>
                  <HiX className="h-4 w-4 text-gray-400 hover:text-red-500" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary px-8"
          >
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
