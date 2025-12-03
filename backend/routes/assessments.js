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
    else if (percentage >= 60) level = 'intermediate';
    
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
    'React.js': [
      {
        question: 'What is the purpose of useEffect hook?',
        options: [
          'To manage component state',
          'To perform side effects in functional components',
          'To create new components',
          'To handle form submissions'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the difference between controlled and uncontrolled components?',
        options: [
          'Controlled components use state, uncontrolled use refs',
          'There is no difference',
          'Controlled components are faster',
          'Uncontrolled components are more secure'
        ],
        correctAnswer: 0
      },
      {
        question: 'What does React.memo() do?',
        options: [
          'Creates a memoized component',
          'Stores data in memory',
          'Optimizes component re-renders',
          'Handles async operations'
        ],
        correctAnswer: 2
      },
      {
        question: 'What is the purpose of keys in React lists?',
        options: [
          'To style list items',
          'To help React identify which items have changed',
          'To sort the list',
          'To filter the list'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the Context API used for?',
        options: [
          'To manage global state',
          'To pass data through component tree without props',
          'To handle routing',
          'To make API calls'
        ],
        correctAnswer: 1
      }
    ],
    'Express.js': [
      {
        question: 'What is Express.js?',
        options: [
          'A frontend framework',
          'A minimal web application framework for Node.js',
          'A database',
          'A testing library'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is middleware in Express?',
        options: [
          'Functions that execute during the request-response cycle',
          'A database layer',
          'A frontend component',
          'A routing mechanism'
        ],
        correctAnswer: 0
      },
      {
        question: 'How do you handle POST request data in Express?',
        options: [
          'Using req.body with body-parser middleware',
          'Using req.params',
          'Using req.query',
          'Using req.headers'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the purpose of app.use() in Express?',
        options: [
          'To define routes',
          'To mount middleware functions',
          'To start the server',
          'To handle errors'
        ],
        correctAnswer: 1
      },
      {
        question: 'How do you handle errors in Express?',
        options: [
          'Using try-catch blocks',
          'Using error-handling middleware with 4 parameters',
          'Using console.error',
          'Using throw statements'
        ],
        correctAnswer: 1
      }
    ],
    'Node.js': [
      {
        question: 'What is Node.js?',
        options: [
          'A frontend framework',
          'A JavaScript runtime built on Chrome\'s V8 engine',
          'A database',
          'A CSS framework'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the purpose of package.json?',
        options: [
          'To store project dependencies and scripts',
          'To write application code',
          'To configure the database',
          'To style components'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the event loop in Node.js?',
        options: [
          'A mechanism that handles asynchronous operations',
          'A type of loop',
          'A database query',
          'A file system operation'
        ],
        correctAnswer: 0
      },
      {
        question: 'How do you read a file asynchronously in Node.js?',
        options: [
          'Using fs.readFile()',
          'Using fs.readFileSync()',
          'Using require()',
          'Using import'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is npm?',
        options: [
          'Node Package Manager',
          'Node Program Manager',
          'New Project Manager',
          'Network Package Manager'
        ],
        correctAnswer: 0
      }
    ],
    'MongoDB': [
      {
        question: 'What is MongoDB?',
        options: [
          'A relational database',
          'A NoSQL document database',
          'A frontend framework',
          'A programming language'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is a collection in MongoDB?',
        options: [
          'A group of databases',
          'A group of documents (similar to a table in SQL)',
          'A query result',
          'A data type'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the primary key in MongoDB called?',
        options: ['_id', 'id', 'key', 'primary'],
        correctAnswer: 0
      },
      {
        question: 'Which method is used to insert a document in MongoDB?',
        options: ['insertOne()', 'add()', 'create()', 'save()'],
        correctAnswer: 0
      },
      {
        question: 'What is Mongoose?',
        options: [
          'A MongoDB object modeling tool for Node.js',
          'A database',
          'A frontend library',
          'A testing framework'
        ],
        correctAnswer: 0
      }
    ],
    'TypeScript': [
      {
        question: 'What is TypeScript?',
        options: [
          'A superset of JavaScript with static typing',
          'A database',
          'A CSS framework',
          'A testing library'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the file extension for TypeScript files?',
        options: ['.js', '.ts', '.tsx', '.typescript'],
        correctAnswer: 1
      },
      {
        question: 'What is an interface in TypeScript?',
        options: [
          'A way to define the structure of an object',
          'A function',
          'A class',
          'A variable'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the purpose of type annotations?',
        options: [
          'To specify the type of variables and functions',
          'To add comments',
          'To format code',
          'To optimize performance'
        ],
        correctAnswer: 0
      },
      {
        question: 'What does "strict mode" do in TypeScript?',
        options: [
          'Enables additional type checking',
          'Disables type checking',
          'Makes code run faster',
          'Changes syntax'
        ],
        correctAnswer: 0
      }
    ],
    'Vue.js': [
      {
        question: 'What is Vue.js?',
        options: [
          'A progressive JavaScript framework',
          'A database',
          'A CSS framework',
          'A testing library'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the Vue instance?',
        options: [
          'The root of a Vue application',
          'A component',
          'A directive',
          'A method'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is v-model used for?',
        options: [
          'Two-way data binding',
          'One-way data binding',
          'Event handling',
          'Styling'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is a Vue component?',
        options: [
          'A reusable Vue instance',
          'A database table',
          'A CSS class',
          'A JavaScript function'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is Vuex?',
        options: [
          'State management library for Vue',
          'A routing library',
          'A testing framework',
          'A CSS framework'
        ],
        correctAnswer: 0
      }
    ],
    'Angular': [
      {
        question: 'What is Angular?',
        options: [
          'A TypeScript-based web application framework',
          'A database',
          'A CSS framework',
          'A testing library'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is a component in Angular?',
        options: [
          'A class with a template and metadata',
          'A function',
          'A variable',
          'A service'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is dependency injection in Angular?',
        options: [
          'A design pattern for providing dependencies',
          'A database operation',
          'A routing mechanism',
          'A styling technique'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the purpose of services in Angular?',
        options: [
          'To share data and functionality across components',
          'To style components',
          'To handle routing',
          'To create components'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is NgModule?',
        options: [
          'A decorator that marks a class as an Angular module',
          'A component',
          'A service',
          'A directive'
        ],
        correctAnswer: 0
      }
    ],
    'Next.js': [
      {
        question: 'What is Next.js?',
        options: [
          'A React framework for production',
          'A database',
          'A CSS framework',
          'A testing library'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is Server-Side Rendering (SSR) in Next.js?',
        options: [
          'Rendering React components on the server',
          'Rendering on the client only',
          'A database operation',
          'A styling technique'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the purpose of getServerSideProps?',
        options: [
          'To fetch data on each request',
          'To style pages',
          'To handle routing',
          'To create components'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the file-based routing in Next.js?',
        options: [
          'Routes are created based on file structure',
          'Routes are defined in a config file',
          'Routes are created manually',
          'Routes are generated automatically'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the purpose of API routes in Next.js?',
        options: [
          'To create backend API endpoints',
          'To style pages',
          'To handle routing',
          'To create components'
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
    ],
    'Django': [
      {
        question: 'What is Django?',
        options: [
          'A high-level Python web framework',
          'A database',
          'A CSS framework',
          'A testing library'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the Django ORM?',
        options: [
          'Object-Relational Mapping for database operations',
          'A routing system',
          'A templating engine',
          'A testing framework'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is a Django model?',
        options: [
          'A Python class that defines database structure',
          'A view',
          'A template',
          'A URL pattern'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the purpose of migrations in Django?',
        options: [
          'To manage database schema changes',
          'To handle routing',
          'To style templates',
          'To create views'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the Django admin?',
        options: [
          'An automatic admin interface',
          'A database',
          'A CSS framework',
          'A testing library'
        ],
        correctAnswer: 0
      }
    ],
    'Git': [
      {
        question: 'What is Git?',
        options: [
          'A distributed version control system',
          'A database',
          'A CSS framework',
          'A testing library'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the purpose of git commit?',
        options: [
          'To save changes to the repository',
          'To create a new branch',
          'To merge branches',
          'To clone a repository'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is a branch in Git?',
        options: [
          'A parallel version of the repository',
          'A file',
          'A commit',
          'A remote'
        ],
        correctAnswer: 0
      },
      {
        question: 'What does git pull do?',
        options: [
          'Fetches and merges changes from remote',
          'Pushes changes to remote',
          'Creates a new branch',
          'Deletes a branch'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the purpose of git merge?',
        options: [
          'To combine branches',
          'To create a branch',
          'To delete a branch',
          'To clone a repository'
        ],
        correctAnswer: 0
      }
    ],
    'Docker': [
      {
        question: 'What is Docker?',
        options: [
          'A containerization platform',
          'A database',
          'A CSS framework',
          'A testing library'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is a Docker image?',
        options: [
          'A read-only template for creating containers',
          'A running container',
          'A Dockerfile',
          'A volume'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is a Docker container?',
        options: [
          'A running instance of a Docker image',
          'A Docker image',
          'A Dockerfile',
          'A volume'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the purpose of Dockerfile?',
        options: [
          'To define how to build a Docker image',
          'To run a container',
          'To create a volume',
          'To manage networks'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is docker-compose?',
        options: [
          'A tool for defining multi-container applications',
          'A Docker image',
          'A container',
          'A volume'
        ],
        correctAnswer: 0
      }
    ],
    'AWS': [
      {
        question: 'What is AWS?',
        options: [
          'Amazon Web Services - cloud computing platform',
          'A database',
          'A CSS framework',
          'A testing library'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is EC2?',
        options: [
          'Elastic Compute Cloud - virtual servers',
          'A database service',
          'A storage service',
          'A networking service'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is S3?',
        options: [
          'Simple Storage Service - object storage',
          'A compute service',
          'A database service',
          'A networking service'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is Lambda?',
        options: [
          'Serverless compute service',
          'A database',
          'A storage service',
          'A networking service'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is RDS?',
        options: [
          'Relational Database Service',
          'A compute service',
          'A storage service',
          'A networking service'
        ],
        correctAnswer: 0
      }
    ],
    'GraphQL': [
      {
        question: 'What is GraphQL?',
        options: [
          'A query language for APIs',
          'A database',
          'A CSS framework',
          'A testing library'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is a GraphQL query?',
        options: [
          'A request for specific data',
          'A mutation',
          'A subscription',
          'A schema'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is a GraphQL mutation?',
        options: [
          'An operation that modifies data',
          'A query',
          'A subscription',
          'A schema'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the GraphQL schema?',
        options: [
          'The type system that defines the API',
          'A query',
          'A mutation',
          'A resolver'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is a resolver in GraphQL?',
        options: [
          'A function that fetches data for a field',
          'A query',
          'A mutation',
          'A schema'
        ],
        correctAnswer: 0
      }
    ],
    'Redux': [
      {
        question: 'What is Redux?',
        options: [
          'A state management library for JavaScript',
          'A database',
          'A CSS framework',
          'A testing library'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is a Redux store?',
        options: [
          'A single source of truth for application state',
          'A component',
          'A function',
          'A variable'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is an action in Redux?',
        options: [
          'An object that describes what happened',
          'A reducer',
          'A store',
          'A component'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is a reducer in Redux?',
        options: [
          'A pure function that takes state and action, returns new state',
          'An action',
          'A store',
          'A component'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the purpose of dispatch in Redux?',
        options: [
          'To send actions to the store',
          'To create actions',
          'To create reducers',
          'To create stores'
        ],
        correctAnswer: 0
      }
    ]
  };
  
  // Normalize skill name (handle variations)
  const normalizedSkill = skill.replace(/\s+/g, '').toLowerCase();
  const skillMap = {
    'react': 'React',
    'reactjs': 'React',
    'react.js': 'React',
    'express': 'Express.js',
    'expressjs': 'Express.js',
    'express.js': 'Express.js',
    'node': 'Node.js',
    'nodejs': 'Node.js',
    'node.js': 'Node.js',
    'mongodb': 'MongoDB',
    'typescript': 'TypeScript',
    'vue': 'Vue.js',
    'vuejs': 'Vue.js',
    'vue.js': 'Vue.js',
    'angular': 'Angular',
    'next': 'Next.js',
    'nextjs': 'Next.js',
    'next.js': 'Next.js',
    'python': 'Python',
    'django': 'Django',
    'git': 'Git',
    'docker': 'Docker',
    'aws': 'AWS',
    'graphql': 'GraphQL',
    'redux': 'Redux'
  };
  
  const mappedSkill = skillMap[normalizedSkill] || skill;
  
  // Return questions for the skill, or default JavaScript questions
  return questionTemplates[mappedSkill] || questionTemplates['JavaScript'].map(q => ({
    ...q,
    question: q.question.replace('JavaScript', skill)
  }));
}

module.exports = router;

