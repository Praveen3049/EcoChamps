import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLessons } from '../services/apiService';

interface LessonListItem {
  id: string;
  title: string;
  topic: string;
}

const LessonsPage = () => {
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getLessons();
        setLessons(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading lessons...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Available Lessons</h2>
      <div className="row">
        {lessons.map(lesson => (
          <div key={lesson.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{lesson.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{lesson.topic}</h6>
                <Link to={`/lessons/${lesson.id}`} className="btn btn-primary mt-3">Read Lesson</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonsPage;
