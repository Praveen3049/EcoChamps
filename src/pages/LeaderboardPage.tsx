import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/apiService';

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  xp: number;
  level: number;
}

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Leaderboard</h2>
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Level</th>
            <th>XP</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map(entry => (
            <tr key={entry.id}>
              <td>{entry.rank}</td>
              <td>{entry.name}</td>
              <td>{entry.level}</td>
              <td>{entry.xp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardPage;
