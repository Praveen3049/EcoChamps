import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createPVPChallenge,
  getPendingPVPChallenges,
  getActivePVPChallenges,
  acceptPVPChallenge,
  getQuizzes,
  getLeaderboard,
} from '../services/apiService';
import { getToken } from '../services/auth';

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

interface QuizListItem {
  id: string;
  title: string;
  topic: string;
}

interface LeaderboardEntry {
  id: string;
  name: string;
}

const PVPChallengesPage = () => {
  const navigate = useNavigate();
  const userId = getToken();

  const [pendingChallenges, setPendingChallenges] = useState<PVPChallenge[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<PVPChallenge[]>([]);
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [users, setUsers] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [selectedOpponent, setSelectedOpponent] = useState<string>('');
  const [selectedQuiz, setSelectedQuiz] = useState<string>('');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [pending, active, allQuizzes, leaderboardUsers] = await Promise.all([
          getPendingPVPChallenges(userId),
          getActivePVPChallenges(userId),
          getQuizzes(),
          getLeaderboard(),
        ]);
        setPendingChallenges(pending);
        setActiveChallenges(active);
        setQuizzes(allQuizzes);
        setUsers(leaderboardUsers.filter((user: any) => user.id !== userId)); // Exclude current user
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchData();
  }, [userId, navigate]);

  const handleCreateChallenge = async () => {
    if (!userId || !selectedOpponent || !selectedQuiz) {
      setError('Please select an opponent and a quiz.');
      return;
    }
    try {
      await createPVPChallenge(userId, selectedOpponent, selectedQuiz);
      setMessage('Challenge created successfully!');
      setSelectedOpponent('');
      setSelectedQuiz('');
      // Refresh pending/active challenges
      if (userId) {
        const pending = await getPendingPVPChallenges(userId);
        setPendingChallenges(pending);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAcceptChallenge = async (challengeId: string) => {
    if (!userId) return;
    try {
      await acceptPVPChallenge(challengeId, userId);
      setMessage('Challenge accepted!');
      // Refresh pending/active challenges
      if (userId) {
        const pending = await getPendingPVPChallenges(userId);
        setPendingChallenges(pending);
        const active = await getActivePVPChallenges(userId);
        setActiveChallenges(active);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePlayChallenge = (challengeId: string) => {
    navigate(`/pvp/play/${challengeId}`);
  };

  if (error) {
    return <div className="alert alert-danger mt-4">Error: {error}</div>;
  }

  if (!userId) {
    return <div className="alert alert-warning mt-4">Please log in to view PvP Challenges.</div>;
  }

  return (
    <div className="container mt-4">
      <h2>PvP Challenges</h2>
      {message && <div className="alert alert-success">{message}</div>}

      <div className="card mb-4">
        <div className="card-header">Create New Challenge</div>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="opponentSelect" className="form-label">Challenge Opponent:</label>
            <select
              id="opponentSelect"
              className="form-select"
              value={selectedOpponent}
              onChange={(e) => setSelectedOpponent(e.target.value)}
            >
              <option value="">Select an opponent</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="quizSelect" className="form-label">Select Quiz:</label>
            <select
              id="quizSelect"
              className="form-select"
              value={selectedQuiz}
              onChange={(e) => setSelectedQuiz(e.target.value)}
            >
              <option value="">Select a quiz</option>
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleCreateChallenge}>
            Create Challenge
          </button>
        </div>
      </div>

      <h3>Pending Challenges (Awaiting Your Acceptance)</h3>
      {pendingChallenges.length === 0 ? (
        <p>No pending challenges.</p>
      ) : (
        <div className="row">
          {pendingChallenges.map((challenge) => (
            <div key={challenge.id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Challenge from {users.find(u => u.id === challenge.challengerId)?.name}</h5>
                  <p className="card-text">Quiz: {quizzes.find(q => q.id === challenge.quizId)?.title}</p>
                  <button
                    className="btn btn-success"
                    onClick={() => handleAcceptChallenge(challenge.id)}
                  >
                    Accept Challenge
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3>Active Challenges</h3>
      {activeChallenges.length === 0 ? (
        <p>No active challenges.</p>
      ) : (
        <div className="row">
          {activeChallenges.map((challenge) => (
            <div key={challenge.id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Challenge with {users.find(u => u.id === challenge.challengerId)?.name === users.find(u => u.id === userId)?.name ? users.find(u => u.id === challenge.opponentId)?.name : users.find(u => u.id === challenge.challengerId)?.name}</h5>
                  <p className="card-text">Quiz: {quizzes.find(q => q.id === challenge.quizId)?.title}</p>
                  <p className="card-text">Status: {challenge.status}</p>
                  <button
                    className="btn btn-info"
                    onClick={() => handlePlayChallenge(challenge.id)}
                  >
                    Play Challenge
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PVPChallengesPage;
