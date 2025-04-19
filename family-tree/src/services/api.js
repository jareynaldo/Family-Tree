const API_URL = 'http://localhost:3000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Auth API calls
export const authService = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },
};

// Family API calls
export const familyService = {
  getFamilyMembers: async (token) => {
    const response = await fetch(`${API_URL}/family`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  addFamilyMember: async (memberData, token) => {
    const response = await fetch(`${API_URL}/family`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(memberData),
    });
    return handleResponse(response);
  },

  updateFamilyMember: async (id, memberData, token) => {
    const response = await fetch(`${API_URL}/family/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(memberData),
    });
    return handleResponse(response);
  },

  deleteFamilyMember: async (id, token) => {
    const response = await fetch(`${API_URL}/family/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse(response);
  },
}; 