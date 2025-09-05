const API_URL = 'http://localhost:5000/api';

export const signupUser = async (userData: any) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to sign up');
  }

  return response.json();
};

export const loginUser = async (credentials: any) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to log in');
  }

  return response.json();
};

export const getUserProfile = async (userId: string) => {
  // In a real app, you'd send an auth token in the headers
  const response = await fetch(`${API_URL}/users/${userId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch user profile');
  }

  return response.json();
};

export const getLessons = async () => {
  const response = await fetch(`${API_URL}/lessons`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch lessons');
  }

  return response.json();
};

export const getLessonById = async (lessonId: string) => {
  const response = await fetch(`${API_URL}/lessons/${lessonId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch lesson');
  }

  return response.json();
};

export const getQuizzes = async () => {
  const response = await fetch(`${API_URL}/quizzes`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch quizzes');
  }

  return response.json();
};

export const getQuizQuestions = async (quizId: string, userId: string) => {
  const response = await fetch(`${API_URL}/quizzes/${quizId}?userId=${userId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch quiz questions');
  }

  return response.json();
};

export const submitQuiz = async (quizId: string, userId: string, answers: any[]) => {
  const response = await fetch(`${API_URL}/quizzes/${quizId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, answers }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to submit quiz');
  }

  return response.json();
};

export const getEcoTasks = async () => {
  const response = await fetch(`${API_URL}/ecotasks`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch eco tasks');
  }

  return response.json();
};

export const completeEcoTask = async (taskId: string, userId: string, photoProof: File) => {
  // In a real app, you would upload the photoProof to a storage service
  // For this prototype, we'll just simulate the submission
  const response = await fetch(`${API_URL}/ecotasks/${taskId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, photoProof: photoProof.name }), // Sending just the name for simulation
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to complete eco task');
  }

  return response.json();
};

export const getLeaderboard = async () => {
  const response = await fetch(`${API_URL}/users/leaderboard`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch leaderboard');
  }

  return response.json();
};

// PvP Challenge API Calls
export const createPVPChallenge = async (challengerId: string, opponentId: string, quizId: string) => {
  const response = await fetch(`${API_URL}/pvp/challenge/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ challengerId, opponentId, quizId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create PvP challenge');
  }

  return response.json();
};

export const acceptPVPChallenge = async (challengeId: string, userId: string) => {
  const response = await fetch(`${API_URL}/pvp/challenge/${challengeId}/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to accept PvP challenge');
  }

  return response.json();
};

export const getPendingPVPChallenges = async (userId: string) => {
  const response = await fetch(`${API_URL}/pvp/challenges/pending/${userId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch pending PvP challenges');
  }

  return response.json();
};

export const getActivePVPChallenges = async (userId: string) => {
  const response = await fetch(`${API_URL}/pvp/challenges/active/${userId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch active PvP challenges');
  }

  return response.json();
};

export const getPVPChallengeDetails = async (challengeId: string) => {
  const response = await fetch(`${API_URL}/pvp/challenge/${challengeId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch PvP challenge details');
  }

  return response.json();
};

export const submitPVPChallengeQuiz = async (challengeId: string, userId: string, answers: any[]) => {
  const response = await fetch(`${API_URL}/pvp/challenge/${challengeId}/submit-quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, answers }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to submit PvP challenge quiz');
  }

  return response.json();
};

export const getBadges = async () => {
  const response = await fetch(`${API_URL}/badges`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch badges');
  }

  return response.json();
};
