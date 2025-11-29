import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI, skillsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    experiences: [],
    projects: [],
    skills: [],
    achievements: [],
    certifications: []
  });
  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileSubmitted, setProfileSubmitted] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadProfile();
    loadSkills();
    seedSkillsIfNeeded();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSkillDropdown && !event.target.closest('.skill-input-container')) {
        setShowSkillDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSkillDropdown]);

  const seedSkillsIfNeeded = async () => {
    try {
      await skillsAPI.seedSkills();
    } catch (error) {
      console.log('Skills already seeded or error:', error);
    }
  };

  const loadProfile = async () => {
    try {
      const response = await profileAPI.getProfile();
      const profile = response.data;
      setUserProfile(profile);
      setFormData({
        name: profile.name || '',
        contact: profile.contact || '',
        experiences: profile.experiences || [],
        projects: profile.projects || [],
        skills: profile.skills?.map(s => s.skill) || [],
        achievements: profile.achievements || [],
        certifications: profile.certifications || []
      });
      setProfileSubmitted(profile.skills && profile.skills.length > 0);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadSkills = async (search = '') => {
    try {
      const response = await skillsAPI.getSkills(search);
      setAvailableSkills(response.data);
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  };

  const handleSkillSearch = (e) => {
    const search = e.target.value;
    setSkillSearch(search);
    loadSkills(search);
    setShowSkillDropdown(true);
  };

  const addSkill = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill]
      });
    }
    setSkillSearch('');
    setShowSkillDropdown(false);
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [...formData.experiences, { company: '', position: '', duration: '', description: '' }]
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...formData.experiences];
    updated[index][field] = value;
    setFormData({ ...formData, experiences: updated });
  };

  const removeExperience = (index) => {
    setFormData({
      ...formData,
      experiences: formData.experiences.filter((_, i) => i !== index)
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', description: '', technologies: '', link: '' }]
    });
  };

  const updateProject = (index, field, value) => {
    const updated = [...formData.projects];
    updated[index][field] = value;
    setFormData({ ...formData, projects: updated });
  };

  const removeProject = (index) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await profileAPI.updateProfile(formData);
      setProfileSubmitted(true);
      await loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
    setLoading(false);
  };

  const handleTakeAssessment = () => {
    if (formData.skills.length === 0) {
      alert('Please add at least one skill to take assessment');
      return;
    }
    // Navigate to assessment selection or first skill
    navigate(`/assessment/${formData.skills[0]}`);
  };

  const filteredSkills = availableSkills.filter(skill =>
    skill.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !formData.skills.includes(skill.name)
  );

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <h1>Profile Setup</h1>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-section">
            <label>Contact</label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
          </div>

          <div className="form-section">
            <div className="section-header">
              <label>Experience</label>
              <button type="button" onClick={addExperience} className="add-btn">
                + Add Experience
              </button>
            </div>
            {formData.experiences.map((exp, index) => (
              <div key={index} className="multi-item">
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={exp.duration}
                  onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                />
                <textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                />
                <button type="button" onClick={() => removeExperience(index)} className="remove-btn">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="form-section">
            <div className="section-header">
              <label>Projects</label>
              <button type="button" onClick={addProject} className="add-btn">
                + Add Project
              </button>
            </div>
            {formData.projects.map((project, index) => (
              <div key={index} className="multi-item">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={project.name}
                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                />
                <textarea
                  placeholder="Description"
                  value={project.description}
                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Technologies (comma separated)"
                  value={project.technologies}
                  onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Link (optional)"
                  value={project.link}
                  onChange={(e) => updateProject(index, 'link', e.target.value)}
                />
                <button type="button" onClick={() => removeProject(index)} className="remove-btn">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="form-section">
            <label>Skills</label>
            <div className="skill-input-container">
              <input
                type="text"
                placeholder="Search and select skills"
                value={skillSearch}
                onChange={handleSkillSearch}
                onFocus={() => setShowSkillDropdown(true)}
              />
              {showSkillDropdown && filteredSkills.length > 0 && (
                <div className="skill-dropdown">
                  {filteredSkills.slice(0, 10).map((skill) => (
                    <div
                      key={skill._id}
                      className="skill-option"
                      onClick={() => addSkill(skill.name)}
                    >
                      {skill.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="selected-skills">
              {formData.skills.map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label>Achievements</label>
            <textarea
              value={formData.achievements.join('\n')}
              onChange={(e) => setFormData({
                ...formData,
                achievements: e.target.value.split('\n').filter(a => a.trim())
              })}
              placeholder="Enter achievements (one per line)"
              rows="4"
            />
          </div>

          <div className="form-section">
            <label>Certifications</label>
            <textarea
              value={formData.certifications.join('\n')}
              onChange={(e) => setFormData({
                ...formData,
                certifications: e.target.value.split('\n').filter(c => c.trim())
              })}
              placeholder="Enter certifications (one per line)"
              rows="4"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Saving...' : 'Submit Profile'}
          </button>
        </form>

        {profileSubmitted && (
          <div className="assessment-section">
            <h2>Take Skill Assessments</h2>
            <p>Test your skills and get certified levels!</p>
            <div className="skill-buttons">
              {formData.skills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => navigate(`/assessment/${skill}`)}
                  className="skill-assessment-btn"
                >
                  Take {skill} Assessment
                </button>
              ))}
            </div>
            <button onClick={() => navigate('/profile')} className="view-profile-btn">
              View Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

