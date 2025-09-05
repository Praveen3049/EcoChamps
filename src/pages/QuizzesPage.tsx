import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzes } from '../services/apiService';

interface QuizListItem {
  id: string;
  title: string;
  topic: string;
}

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getQuizzes();
        setQuizzes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading quizzes...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Available Quizzes</h2>
      <div className="row">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{quiz.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{quiz.topic}</h6>
                <Link to={`/quizzes/${quiz.id}`} className="btn btn-primary mt-3">Start Quiz</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizzesPage;
