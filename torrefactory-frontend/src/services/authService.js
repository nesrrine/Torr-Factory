import api from './api';

const authService = {

  // ---------------- LOGIN ----------------
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response.data;

    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data);
      throw error.response?.data?.message || 'Erreur de connexion';
    }
  },

  // ---------------- REGISTER ----------------
  register: async (signupData) => {
    try {

      console.log("DATA SENT =>", signupData); // 🔥 debug مهم

      const response = await api.post('/auth/register', {
        username: signupData.username?.trim(),
        email: signupData.email?.trim(),
        password: signupData.password,
        fullName: signupData.fullName?.trim(),
        phoneNumber: signupData.phoneNumber || null,
        roles: signupData.roles || []
      });

      return response.data;

    } catch (error) {
      console.log("REGISTER ERROR:", error.response?.data);

      throw error.response?.data?.message ||
            'Erreur lors de l\'inscription';
    }
  },

  // ---------------- LOGOUT ----------------
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // ---------------- USER ----------------
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // ---------------- AUTH CHECK ----------------
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;