import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, getMe } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { HiPencil, HiUpload, HiTrash, HiPlus } from 'react-icons/hi';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    headline: '',
    bio: '',
    phone: '',
    location: { city: '', state: '', country: '' },
    skills: [],
    socialLinks: { linkedin: '', github: '', portfolio: '' },
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        headline: user.headline || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || { city: '', state: '', country: '' },
        skills: user.skills || [],
        socialLinks: user.socialLinks || { linkedin: '', github: '', portfolio: '' },
      });
    }
  }, [user]);

  const handleSave = async () => {
    const result = await dispatch(updateProfile(formData));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated!');
      setIsEditing(false);
    } else {
      toast.error(result.payload || 'Update failed');
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append('resume', file);

    try {
      await api.post('/users/resume', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Resume uploaded!');
      dispatch(getMe());
    } catch (err) {
      toast.error('Failed to upload resume');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append('avatar', file);

    try {
      await api.post('/users/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Avatar uploaded!');
      dispatch(getMe());
    } catch (err) {
      toast.error('Failed to upload avatar');
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={isEditing ? 'btn-primary' : 'btn-secondary'}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      {/* Avatar & Basic Info */}
      <div className="card mb-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden">
              {user.avatar?.url ? (
                <img src={user.avatar.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary-600 dark:text-primary-400 font-bold text-2xl">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700">
                <HiPencil className="h-4 w-4 text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            )}
          </div>

          <div className="flex-1">
            {isEditing ? (
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="input-field"
                  placeholder="First Name"
                />
                <input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="input-field"
                  placeholder="Last Name"
                />
                <input
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="input-field col-span-2"
                  placeholder="Headline (e.g., Senior Developer at Google)"
                />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h2>
                {user.headline && <p className="text-gray-600 dark:text-gray-400 mt-1">{user.headline}</p>}
                <div className="flex items-center gap-3 mt-2">
                  <span className={`badge ${
                    user.role === 'referrer' ? 'badge-info' :
                    user.role === 'admin' ? 'badge-warning' : 'badge-success'
                  }`}>
                    {user.role}
                  </span>
                  {user.location?.city && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {user.location.city}, {user.location.country}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* About */}
        <div className="card">
          <h3 className="font-semibold mb-3 dark:text-white">About</h3>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="input-field h-32 resize-none"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{user.bio || 'No bio added yet'}</p>
          )}
        </div>

        {/* Resume */}
        <div className="card">
          <h3 className="font-semibold mb-3 dark:text-white">Resume</h3>
          {user.resume?.url ? (
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div>
                <p className="font-medium text-sm dark:text-white">{user.resume.fileName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Uploaded {user.resume.uploadedAt ? new Date(user.resume.uploadedAt).toLocaleDateString() : ''}
                </p>
              </div>
              <a href={user.resume.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-sm font-medium hover:underline">
                View
              </a>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No resume uploaded</p>
          )}
          <label className="btn-secondary mt-3 inline-flex items-center cursor-pointer text-sm">
            <HiUpload className="mr-2" />
            {user.resume ? 'Update Resume' : 'Upload Resume'}
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
          </label>
        </div>

        {/* Skills */}
        <div className="card">
          <h3 className="font-semibold mb-3 dark:text-white">Skills</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.skills.map((skill) => (
              <span key={skill} className="badge-gray flex items-center gap-1">
                {skill}
                {isEditing && (
                  <button onClick={() => removeSkill(skill)} className="text-gray-500 hover:text-red-500">
                    <HiTrash className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
            {formData.skills.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No skills added</p>}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="input-field flex-1"
                placeholder="Add a skill"
              />
              <button type="button" onClick={addSkill} className="btn-secondary px-3">
                <HiPlus className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="card">
          <h3 className="font-semibold mb-3 dark:text-white">Social Links</h3>
          {isEditing ? (
            <div className="space-y-3">
              <input
                value={formData.socialLinks.linkedin}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                })}
                className="input-field"
                placeholder="LinkedIn URL"
              />
              <input
                value={formData.socialLinks.github}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, github: e.target.value },
                })}
                className="input-field"
                placeholder="GitHub URL"
              />
              <input
                value={formData.socialLinks.portfolio}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, portfolio: e.target.value },
                })}
                className="input-field"
                placeholder="Portfolio URL"
              />
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              {user.socialLinks?.linkedin && (
                <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="block text-primary-600 hover:underline">LinkedIn</a>
              )}
              {user.socialLinks?.github && (
                <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="block text-primary-600 hover:underline">GitHub</a>
              )}
              {user.socialLinks?.portfolio && (
                <a href={user.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="block text-primary-600 hover:underline">Portfolio</a>
              )}
              {!user.socialLinks?.linkedin && !user.socialLinks?.github && !user.socialLinks?.portfolio && (
                <p className="text-gray-500 dark:text-gray-400">No social links added</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
