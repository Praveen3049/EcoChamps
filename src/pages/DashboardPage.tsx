import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../services/apiService';
import { getToken } from '../services/auth';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  earnedBadges: string[];
}

const DashboardPage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = getToken();
      if (token) {
        try {
          const profileData = await getUserProfile(token);
          setUser(profileData);
        } catch (err: any) {
          setError(err.message);
        }
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>Welcome, {user.name}!</h3>
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Your Stats</h5>
          <p className="card-text">Level: {user.level}</p>
          <p className="card-text">XP: {user.xp}</p>
          <p className="card-text">Badges Earned: {user.earnedBadges.length}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
