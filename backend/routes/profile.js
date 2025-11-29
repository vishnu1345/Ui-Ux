const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/', auth, async (req, res) => {
  try {
    const { name, contact, experiences, projects, skills, achievements, certifications } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (contact) user.contact = contact;
    if (experiences) user.experiences = experiences;
    if (projects) user.projects = projects;
    if (skills) {
      // Merge with existing skills, update if exists, add if new
      skills.forEach(newSkill => {
        const existingSkillIndex = user.skills.findIndex(s => s.skill === newSkill);
        if (existingSkillIndex === -1) {
          user.skills.push({ skill: newSkill, level: 'beginner', score: 0 });
        }
      });
    }
    if (achievements) user.achievements = achievements;
    if (certifications) user.certifications = certifications;
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

