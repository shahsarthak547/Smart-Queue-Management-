const API_BASE_URL = 'http://localhost:8000/api';

// --- Auth Services ---
export const loginUser = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/user/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    return data;
};

export const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/user/signup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Registration failed');
    return data;
};

export const loginInstitution = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/institution/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Institution login failed');
    return data;
};

export const registerInstitution = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/institution/signup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Institution registration failed');
    return data;
};

// --- Discovery & User Dashboard Services ---
export const fetchInstitutions = async (query = '') => {
    const response = await fetch(`${API_BASE_URL}/institutions/?search=${query}`);
    if (!response.ok) throw new Error('Failed to fetch institutions');
    return response.json();
};

export const getUserDashboard = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/user/dashboard/${userId}/`);
    if (!response.ok) throw new Error('Failed to fetch user dashboard');
    return response.json();
};

export const bookToken = async (userId, queueId) => {
    const response = await fetch(`${API_BASE_URL}/book-token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, queue_id: queueId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Booking failed');
    return data;
};

export const manageTokenPosition = async (tokenId, action, additionalData = {}) => {
    const response = await fetch(`${API_BASE_URL}/token/manage/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token_id: tokenId, action, ...additionalData }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Operation failed');
    return data;
};

export const acceptSwap = async (swapId) => {
    const response = await fetch(`${API_BASE_URL}/swap/accept/${swapId}/`, {
        method: 'POST',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Accept swap failed');
    return data;
};

export const rejectSwap = async (swapId) => {
    const response = await fetch(`${API_BASE_URL}/swap/reject/${swapId}/`, {
        method: 'POST',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Reject swap failed');
    return data;
};

// --- Institution Dashboard Services ---
export const getInstitutionDashboard = async (instId) => {
    const response = await fetch(`${API_BASE_URL}/institution/dashboard/${instId}/`);
    if (!response.ok) throw new Error('Failed to fetch institution dashboard');
    return response.json();
};

export const callNextToken = async (queueId, instId) => {
    const response = await fetch(`${API_BASE_URL}/queue/call-next/${queueId}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institution_id: instId }),
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to call next token');
    }
    return response.json();
};

export const confirmToken = async (tokenId) => {
    const response = await fetch(`${API_BASE_URL}/token/confirm/${tokenId}/`, {
        method: 'POST',
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Confirm failed');
    }
    return response.json();
};

export const snoozeToken = async (tokenId) => {
    const response = await fetch(`${API_BASE_URL}/token/snooze/${tokenId}/`, {
        method: 'POST',
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Snooze failed');
    }
    return response.json();
};

export const createQueue = async (instId, queueData) => {
    const response = await fetch(`${API_BASE_URL}/queue/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institution_id: instId, ...queueData }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Create queue failed');
    return data;
};
