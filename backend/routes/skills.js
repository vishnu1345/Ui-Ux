const express = require('express');
const Skill = require('../models/Skill');
const router = express.Router();

// Get all skills
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query = { name: { $regex: search, $options: 'i' } };
    }
    
    const skills = await Skill.find(query).sort({ name: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Initialize default skills (for seeding)
router.post('/seed', async (req, res) => {
  try {
    const defaultSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Express.js',
      'MongoDB', 'SQL', 'HTML', 'CSS', 'TypeScript', 'Vue.js', 'Angular',
      'Docker', 'Kubernetes', 'AWS', 'Git', 'REST API', 'GraphQL',
      'Redux', 'Next.js', 'Django', 'Flask', 'Spring Boot', 'C++',
      'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin', 'React Native',
      'Machine Learning', 'Data Science', 'DevOps', 'UI/UX Design',
      'Figma', 'Adobe XD', 'Agile', 'Scrum', 'Project Management'
    ];

    for (const skillName of defaultSkills) {
      await Skill.findOneAndUpdate(
        { name: skillName },
        { name: skillName },
        { upsert: true, new: true }
      );
    }

    res.json({ message: 'Skills seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

