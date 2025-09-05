import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizQuestions, submitQuiz } from '../services/apiService';
import { getToken } from '../services/auth';

interface Question {
  id: string;
  text: string;
  options: string[];
}

interface QuizResult {
  score: number;
  xpEarned: number;
  newLevel: number;
  message: string;
}

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const userId = getToken(); // Get userId from localStorage

  useEffect(() => {
    const fetchQuestions = async () => {
      if (quizId && userId) {
        try {
          const data = await getQuizQuestions(quizId, userId);
          setQuestions(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuestions();
  }, [quizId, userId]);

  const handleOptionChange = (questionId: string, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const handleSubmitQuiz = async () => {
    if (!quizId || !userId) return;

    const answersArray = Object.keys(selectedAnswers).map(questionId => ({
      questionId,
      selectedOption: selectedAnswers[questionId],
    }));

    try {
      const result = await submitQuiz(quizId, userId, answersArray);
      setQuizResult(result);
      setQuizSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading quiz...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">Error: {error}</div>;
  }

  if (quizSubmitted && quizResult) {
    return (
      <div className="container mt-5 text-center">
        <h2>Quiz Completed!</h2>
        <div className="alert alert-success">
          <p>Your Score: {quizResult.score}</p>
          <p>XP Earned: {quizResult.xpEarned}</p>
          <p>New Level: {quizResult.newLevel}</p>
        </div>
        <p>{quizResult.message}</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div className="text-center mt-5">No questions found for this quiz.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="card-body">
          <h5 className="card-title">{currentQuestion.text}</h5>
          <div className="form-group">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  id={`option-${currentQuestion.id}-${index}`}
                  value={option}
                  checked={selectedAnswers[currentQuestion.id] === option}
                  onChange={() => handleOptionChange(currentQuestion.id, option)}
                />
                <label className="form-check-label" htmlFor={`option-${currentQuestion.id}-${index}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="card-footer text-end">
          {currentQuestionIndex < questions.length - 1 ? (
            <button className="btn btn-primary" onClick={handleNextQuestion} disabled={!selectedAnswers[currentQuestion.id]}>
              Next Question
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleSubmitQuiz} disabled={!selectedAnswers[currentQuestion.id]}>
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
