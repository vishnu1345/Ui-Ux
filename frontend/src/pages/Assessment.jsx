import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './Assessment.css';

const Assessment = () => {
  const { skill } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [skill]);

  const loadQuestions = async () => {
    try {
      const response = await assessmentsAPI.getQuestions(skill);
      setQuestions(response.data.questions);
      setLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      setLoading(false);
    }
  };

  const handleAnswer = (questionIndex, answerIndex) => {
    setAnswers({ ...answers, [questionIndex]: answerIndex });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert('Please answer all questions');
      return;
    }

    setSubmitting(true);
    try {
      const answerArray = questions.map((_, index) => answers[index] ?? -1);
      const response = await assessmentsAPI.submitAssessment({
        skill,
        answers: answerArray
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Error submitting assessment');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="assessment">
        <Navbar />
        <div className="assessment-content">
          <div>Loading questions...</div>
        </div>
      </div>
    );
  }

  if (result) {
    const levelColors = {
      beginner: '#ff6b6b',
      intermediate: '#ffa500',
      expert: '#51cf66'
    };

    return (
      <div className="assessment">
        <Navbar />
        <div className="assessment-content">
          <div className="result-card">
            <h1>Assessment Results</h1>
            <div className="result-details">
              <h2>Skill: {skill}</h2>
              <div className="score-display">
                <div className="score-circle" style={{ borderColor: levelColors[result.level] }}>
                  <span className="score-value">{result.percentage}%</span>
                </div>
                <div className="level-badge" style={{ backgroundColor: levelColors[result.level] }}>
                  {result.level.toUpperCase()}
                </div>
              </div>
              <p>You scored {result.score} out of {result.totalQuestions} questions</p>
              <div className="result-actions">
                <button onClick={() => navigate('/dashboard')} className="btn-primary">
                  Back to Dashboard
                </button>
                <button onClick={() => navigate('/profile')} className="btn-secondary">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="assessment">
      <Navbar />
      <div className="assessment-content">
        <div className="assessment-header">
          <h1>{skill} Assessment</h1>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p>Question {currentQuestion + 1} of {questions.length}</p>
        </div>

        <div className="question-card">
          <h2>{currentQ.question}</h2>
          <div className="options">
            {currentQ.options.map((option, index) => (
              <label
                key={index}
                className={`option ${answers[currentQuestion] === index ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={index}
                  checked={answers[currentQuestion] === index}
                  onChange={() => handleAnswer(currentQuestion, index)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="assessment-actions">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="btn-secondary"
          >
            Previous
          </button>
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || answers[currentQuestion] === undefined}
              className="btn-primary"
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={answers[currentQuestion] === undefined}
              className="btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessment;

