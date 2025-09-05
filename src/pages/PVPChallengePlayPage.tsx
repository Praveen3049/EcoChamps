import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getPVPChallengeDetails,
  getQuizQuestions,
  submitPVPChallengeQuiz,
} from '../services/apiService';
import { getToken } from '../services/auth';

interface Question {
  id: string;
  text: string;
  options: string[];
}

interface PVPChallenge {
  id: string;
  challengerId: string;
  opponentId: string;
  quizId: string;
  status: 'pending' | 'active' | 'completed';
  challengerScore: number;
  opponentScore: number;
  winnerId: string | null;
  createdAt: number;
  updatedAt: number;
}

const PVPChallengePlayPage = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const userId = getToken();

  const [challenge, setChallenge] = useState<PVPChallenge | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchChallengeAndQuestions = async () => {
      if (challengeId && userId) {
        try {
          const challengeData = await getPVPChallengeDetails(challengeId);
          setChallenge(challengeData);

          // Fetch quiz questions based on the challenge's quizId
          const quizQuestionsData = await getQuizQuestions(challengeData.quizId, userId);
          setQuestions(quizQuestionsData);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchChallengeAndQuestions();
  }, [challengeId, userId, navigate]);

  const handleOptionChange = (questionId: string, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const handleSubmitQuiz = async () => {
    if (!challengeId || !userId) return;

    const answersArray = Object.keys(selectedAnswers).map(questionId => ({
      questionId,
      selectedOption: selectedAnswers[questionId],
    }));

    try {
      const result = await submitPVPChallengeQuiz(challengeId, userId, answersArray);
      setSubmissionResult(result);
      setQuizSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading challenge...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">Error: {error}</div>;
  }

  if (!challenge || !questions.length) {
    return <div className="text-center mt-5">Challenge or questions not found.</div>;
  }

  if (quizSubmitted && submissionResult) {
    return (
      <div className="container mt-5 text-center">
        <h2>Quiz Submitted!</h2>
        <div className="alert alert-success">
          <p>Your Score: {submissionResult.score}</p>
          <p>{submissionResult.message}</p>
          {submissionResult.challengeStatus === 'completed' && (
            <p>Winner: {submissionResult.winnerId === userId ? 'You' : 'Opponent'}</p>
          )}
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/pvp')}>Back to PvP Challenges</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

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

export default PVPChallengePlayPage;
