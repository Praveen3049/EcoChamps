import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLessonById } from '../services/apiService';

interface Lesson {
  id: string;
  title: string;
  topic: string;
  content: string;
}

const LessonDetailPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      if (lessonId) {
        try {
          const data = await getLessonById(lessonId);
          setLesson(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLesson();
  }, [lessonId]);

  if (loading) {
    return <div className="text-center mt-5">Loading lesson...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">Error: {error}</div>;
  }

  if (!lesson) {
    return <div className="text-center mt-5">Lesson not found.</div>;
  }

  return (
    <div className="container mt-5">
      <h2>{lesson.title}</h2>
      <h5 className="text-muted mb-4">Topic: {lesson.topic}</h5>
      <div className="card">
        <div className="card-body">
          <p className="card-text">{lesson.content}</p>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;
