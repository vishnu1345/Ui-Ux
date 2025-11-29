import { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await profileAPI.getProfile();
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'expert': return '#51cf66';
      case 'intermediate': return '#ffa500';
      case 'beginner': return '#ff6b6b';
      default: return '#868e96';
    }
  };

  if (loading) {
    return (
      <div className="profile">
        <Navbar />
        <div className="profile-content">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile">
        <Navbar />
        <div className="profile-content">No profile found</div>
      </div>
    );
  }

  return (
    <div className="profile">
      <Navbar />
      <div className="profile-content">
        <div className="profile-header">
          <h1>{profile.name}'s Profile</h1>
          <p className="contact-info">Contact: {profile.contact || 'Not provided'}</p>
        </div>

        <div className="profile-section">
          <h2>Skills Report</h2>
          <div className="skills-grid">
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill, index) => (
                <div key={index} className="skill-card">
                  <h3>{skill.skill}</h3>
                  <div className="skill-level">
                    <span
                      className="level-badge"
                      style={{ backgroundColor: getLevelColor(skill.level) }}
                    >
                      {skill.level.toUpperCase()}
                    </span>
                    {skill.score > 0 && (
                      <span className="skill-score">Score: {skill.score.toFixed(1)}%</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No skills added yet</p>
            )}
          </div>
        </div>

        {profile.experiences && profile.experiences.length > 0 && (
          <div className="profile-section">
            <h2>Experience</h2>
            {profile.experiences.map((exp, index) => (
              <div key={index} className="experience-card">
                <h3>{exp.position}</h3>
                <p className="company">{exp.company}</p>
                <p className="duration">{exp.duration}</p>
                {exp.description && <p className="description">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {profile.projects && profile.projects.length > 0 && (
          <div className="profile-section">
            <h2>Projects</h2>
            {profile.projects.map((project, index) => (
              <div key={index} className="project-card">
                <h3>{project.name}</h3>
                {project.description && <p className="description">{project.description}</p>}
                {project.technologies && (
                  <p className="technologies">Technologies: {project.technologies}</p>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                    View Project
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {profile.achievements && profile.achievements.length > 0 && (
          <div className="profile-section">
            <h2>Achievements</h2>
            <ul className="achievements-list">
              {profile.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        )}

        {profile.certifications && profile.certifications.length > 0 && (
          <div className="profile-section">
            <h2>Certifications</h2>
            <ul className="certifications-list">
              {profile.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </div>
        )}

        {profile.assessments && profile.assessments.length > 0 && (
          <div className="profile-section">
            <h2>Assessment History</h2>
            <div className="assessments-table">
              <table>
                <thead>
                  <tr>
                    <th>Skill</th>
                    <th>Score</th>
                    <th>Level</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.assessments.map((assessment, index) => (
                    <tr key={index}>
                      <td>{assessment.skill}</td>
                      <td>{assessment.score}/{assessment.totalQuestions}</td>
                      <td>
                        <span
                          className="level-badge-small"
                          style={{ backgroundColor: getLevelColor(assessment.level) }}
                        >
                          {assessment.level}
                        </span>
                      </td>
                      <td>{new Date(assessment.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

