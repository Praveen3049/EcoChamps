import React, { useState, useEffect } from 'react';
import { getUserProfile, getBadges } from '../services/apiService';
import { getToken } from '../services/auth';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  earnedBadges: string[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = getToken();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const profileData = await getUserProfile(userId);
        const badgesData = await getBadges();
        setUser(profileData);
        setAllBadges(badgesData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  if (loading) {
    return <div className="text-center mt-5">Loading profile...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">Error: {error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-5">User not found.</div>;
  }

  const earnedBadgeDetails = allBadges.filter(badge => user.earnedBadges.includes(badge.id));
  const unearnedBadgeDetails = allBadges.filter(badge => !user.earnedBadges.includes(badge.id));

  return (
    <div className="container mt-5">
      <h2>User Profile</h2>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{user.name}</h5>
          <p className="card-text">Email: {user.email}</p>
          <p className="card-text">Level: {user.level}</p>
          <p className="card-text">XP: {user.xp}</p>
        </div>
      </div>

      <h3>Earned Badges</h3>
      {earnedBadgeDetails.length === 0 ? (
        <p>No badges earned yet.</p>
      ) : (
        <div className="row">
          {earnedBadgeDetails.map(badge => (
            <div key={badge.id} className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body text-center">
                  <img src={`/images/${badge.icon}`} alt={badge.name} className="img-fluid mb-2" style={{ maxWidth: '80px' }} />
                  <h6 className="card-title">{badge.name}</h6>
                  <p className="card-text"><small>{badge.description}</small></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 className="mt-5">Badges to Earn</h3>
      {unearnedBadgeDetails.length === 0 ? (
        <p>You have earned all available badges!</p>
      ) : (
        <div className="row">
          {unearnedBadgeDetails.map(badge => (
            <div key={badge.id} className="col-md-4 mb-3">
              <div className="card h-100 text-muted" style={{ opacity: 0.6 }}>
                <div className="card-body text-center">
                  <img src={`/images/${badge.icon}`} alt={badge.name} className="img-fluid mb-2" style={{ maxWidth: '80px' }} />
                  <h6 className="card-title">{badge.name}</h6>
                  <p className="card-text"><small>{badge.description}</small></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
