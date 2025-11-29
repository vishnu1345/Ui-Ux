const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get assessment questions for a skill
router.get('/:skill', async (req, res) => {
  try {
    const { skill } = req.params;
    
    // Generate questions based on skill (in a real app, these would be stored in DB)
    const questions = generateQuestions(skill);
    res.json({ skill, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit assessment
router.post('/submit', auth, async (req, res) => {
  try {
    const { skill, answers } = req.body;
    const user = await User.findById(req.user._id);
    
    // Calculate score
    const questions = generateQuestions(skill);
    let score = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score++;
      }
    });
    
    const percentage = (score / questions.length) * 100;
    let level = 'beginner';
    if (percentage >= 80) level = 'expert';
    else if (percentage >= 50) level = 'intermediate';
    
    // Save assessment result
    user.assessments.push({
      skill,
      score,
      totalQuestions: questions.length,
      level
    });
    
    // Update skill level
    const skillIndex = user.skills.findIndex(s => s.skill === skill);
    if (skillIndex !== -1) {
      user.skills[skillIndex].level = level;
      user.skills[skillIndex].score = percentage;
    }
    
    await user.save();
    
    res.json({
      score,
      totalQuestions: questions.length,
      percentage: percentage.toFixed(2),
      level
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate questions for a skill
function generateQuestions(skill) {
  const questionTemplates = {
    'JavaScript': [
      {
        question: 'What is the output of: console.log(typeof null)?',
        options: ['null', 'object', 'undefined', 'boolean'],
        correctAnswer: 1
      },
      {
        question: 'Which method is used to add an element to the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 0
      },
      {
        question: 'What is a closure in JavaScript?',
        options: [
          'A function that has access to variables in its outer scope',
          'A way to close a browser tab',
          'A method to close a database connection',
          'A type of loop'
        ],
        correctAnswer: 0
      },
      {
        question: 'What does the "this" keyword refer to in JavaScript?',
        options: [
          'The current function',
          'The object that owns the function',
          'The global object',
          'The parent object'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which is NOT a way to declare a variable in JavaScript?',
        options: ['var', 'let', 'const', 'def'],
        correctAnswer: 3
      }
    ],
    'React': [
      {
        question: 'What is JSX?',
        options: [
          'A JavaScript extension that allows HTML-like syntax',
          'A database query language',
          'A CSS framework',
          'A testing library'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the purpose of useState hook?',
        options: [
          'To fetch data from an API',
          'To manage component state',
          'To handle side effects',
          'To optimize rendering'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the virtual DOM?',
        options: [
          'A copy of the real DOM kept in memory',
          'A database for React components',
          'A browser extension',
          'A server-side rendering technique'
        ],
        correctAnswer: 0
      },
      {
        question: 'Which lifecycle method is called after a component is rendered?',
        options: ['componentDidMount', 'componentWillMount', 'componentDidUpdate', 'render'],
        correctAnswer: 0
      },
      {
        question: 'What is the purpose of props in React?',
        options: [
          'To pass data from parent to child components',
          'To manage local state',
          'To handle events',
          'To style components'
        ],
        correctAnswer: 0
      }
    ],
    'Python': [
      {
        question: 'What is the output of: print(2 ** 3)?',
        options: ['6', '8', '9', '5'],
        correctAnswer: 1
      },
      {
        question: 'Which data type is mutable in Python?',
        options: ['tuple', 'string', 'list', 'int'],
        correctAnswer: 2
      },
      {
        question: 'What is a list comprehension?',
        options: [
          'A way to create lists using a concise syntax',
          'A method to read files',
          'A type of loop',
          'A database query'
        ],
        correctAnswer: 0
      },
      {
        question: 'What does the __init__ method do?',
        options: [
          'Initializes a class instance',
          'Terminates a program',
          'Imports a module',
          'Exports data'
        ],
        correctAnswer: 0
      },
      {
        question: 'Which is used to handle exceptions in Python?',
        options: ['try-except', 'if-else', 'for-while', 'switch-case'],
        correctAnswer: 0
      }
    ]
  };
  
  // Return questions for the skill, or default questions
  return questionTemplates[skill] || questionTemplates['JavaScript'].map(q => ({
    ...q,
    question: q.question.replace('JavaScript', skill)
  }));
}

module.exports = router;

