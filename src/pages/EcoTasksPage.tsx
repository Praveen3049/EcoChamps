import React, { useState, useEffect } from 'react';
import { getEcoTasks, completeEcoTask } from '../services/apiService';
import { getToken } from '../services/auth';

interface EcoTask {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  badgeRewardId: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const EcoTasksPage = () => {
  const [ecoTasks, setEcoTasks] = useState<EcoTask[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [awardedBadge, setAwardedBadge] = useState<Badge | null>(null);

  const userId = getToken();

  useEffect(() => {
    const fetchEcoTasks = async () => {
      try {
        const data = await getEcoTasks();
        setEcoTasks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEcoTasks();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleCompleteClick = (taskId: string) => {
    setCurrentTaskId(taskId);
    setShowModal(true);
    setMessage('');
    setError('');
    setSelectedFile(null);
    setAwardedBadge(null);
  };

  const handleSubmitProof = async () => {
    if (!currentTaskId || !userId || !selectedFile) {
      setError('Please select a photo and ensure you are logged in.');
      return;
    }

    try {
      // Simulate photo upload by sending just the file name
      const result = await completeEcoTask(currentTaskId, userId, selectedFile);
      setMessage(result.message);
      setAwardedBadge(result.badgeAwarded);
      // Optionally, refresh user data on dashboard or update local state
    } catch (err: any) {
      setError(err.message);
    } finally {
      setShowModal(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading EcoTasks...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>EcoTasks</h2>
      {message && <div className="alert alert-success mt-3">{message}</div>}
      {awardedBadge && (
        <div className="alert alert-info mt-3">
          You earned a new badge: <strong>{awardedBadge.name}</strong>! ({awardedBadge.description})
        </div>
      )}
      <div className="row">
        {ecoTasks.map(task => (
          <div key={task.id} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{task.title}</h5>
                <p className="card-text">{task.description}</p>
                <p className="card-text"><strong>XP Reward:</strong> {task.xpReward}</p>
                <button
                  className="btn btn-success"
                  onClick={() => handleCompleteClick(task.id)}
                >
                  Complete Task
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Proof Modal */}
      {showModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Submit Photo Proof</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Please upload a photo to prove you completed the task.</p>
                <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
                {selectedFile && <p className="mt-2">Selected file: {selectedFile.name}</p>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmitProof} disabled={!selectedFile}>Submit Proof</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcoTasksPage;
