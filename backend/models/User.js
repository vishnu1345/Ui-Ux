const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    default: ''
  },
  experiences: [{
    company: String,
    position: String,
    duration: String,
    description: String
  }],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    link: String
  }],
  skills: [{
    skill: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert'],
      default: 'beginner'
    },
    score: {
      type: Number,
      default: 0
    }
  }],
  achievements: [String],
  certifications: [String],
  assessments: [{
    skill: String,
    score: Number,
    totalQuestions: Number,
    level: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);

