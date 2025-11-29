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
      // Frontend Technologies
      'JavaScript', 'TypeScript', 'HTML', 'CSS', 'React', 'React.js', 'Vue.js', 'Angular',
      'Next.js', 'Svelte', 'Ember.js', 'jQuery', 'Bootstrap', 'Tailwind CSS', 'SASS', 'SCSS',
      'Webpack', 'Vite', 'Parcel', 'Redux', 'Zustand', 'MobX', 'React Query',
      
      // Backend Technologies
      'Node.js', 'Express.js', 'Nest.js', 'Fastify', 'Koa.js', 'Python', 'Django', 'Flask',
      'FastAPI', 'Java', 'Spring Boot', 'C#', '.NET', 'ASP.NET', 'PHP', 'Laravel',
      'Symfony', 'Ruby', 'Ruby on Rails', 'Go', 'Golang', 'Rust', 'Elixir', 'Phoenix',
      
      // Databases
      'MongoDB', 'MySQL', 'PostgreSQL', 'SQL', 'SQLite', 'Redis', 'Cassandra', 'DynamoDB',
      'Firebase', 'Supabase', 'Prisma', 'Sequelize', 'Mongoose', 'TypeORM',
      
      // Mobile Development
      'React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Xamarin', 'Android Development',
      'iOS Development',
      
      // Cloud & DevOps
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Git',
      'GitHub Actions', 'Terraform', 'Ansible', 'Linux', 'Bash', 'Shell Scripting',
      
      // APIs & Web Services
      'REST API', 'GraphQL', 'gRPC', 'WebSocket', 'RESTful API', 'API Design', 'Microservices',
      
      // Testing
      'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium', 'Unit Testing', 'Integration Testing',
      'Test-Driven Development', 'TDD',
      
      // Tools & Others
      'Git', 'GitHub', 'GitLab', 'Bitbucket', 'VS Code', 'WebStorm', 'Postman', 'Figma',
      'Adobe XD', 'Sketch', 'Jira', 'Confluence', 'Slack', 'Trello',
      
      // Methodologies
      'Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD', 'Project Management', 'Software Architecture',
      
      // Specialized Fields
      'Machine Learning', 'Data Science', 'Artificial Intelligence', 'Deep Learning',
      'Computer Vision', 'Natural Language Processing', 'Blockchain', 'Web3', 'Solidity',
      'UI/UX Design', 'User Experience', 'User Interface Design', 'Responsive Design',
      
      // Additional Technologies
      'C++', 'C', 'R', 'MATLAB', 'Scala', 'Haskell', 'Clojure', 'Perl', 'Shell',
      'PowerShell', 'Nginx', 'Apache', 'Elasticsearch', 'Kibana', 'Logstash', 'ELK Stack'
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

