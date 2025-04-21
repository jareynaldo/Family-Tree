const API_URL = 'http://localhost:3500/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}


// Auth API calls
export const authService = {
  register(userData) {
    return fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(userData),
    }).then(handleResponse);
  },

  login(credentials) {
    return fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(credentials),
    }).then(handleResponse);
  },
};

// Family API calls
export const familyService = {
  getFamilyMembers(token) {
    return fetch(`${API_URL}/family`, {
      headers: authHeaders(token),
    }).then(handleResponse);
  },

  addFamilyMember(memberData, token) {
    return fetch(`${API_URL}/family`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(memberData),
    }).then(handleResponse);
  },

  updateFamilyMember(id, memberData, token) {
    return fetch(`${API_URL}/family/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(memberData),
    }).then(handleResponse);
  },

  deleteFamilyMember(id, token) {
    return fetch(`${API_URL}/family/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    }).then(handleResponse);
  },
};

export const emailService = {
  sendEmail(data, token) {
    return fetch(`${API_URL}/email/send`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    }).then(handleResponse);
  },
};

export const convertService = {
  toPdf(htmlContent, token) {
    return fetch(`${API_URL}/convert`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ htmlContent }),
    })
    .then(res => {
      if (!res.ok) throw new Error('PDF conversion failed');
      return res.blob();
    });
  },
};