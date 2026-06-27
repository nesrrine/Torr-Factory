import api from './api';

const lotService = {
  // ---------------- GET ALL LOTS ----------------
  getAllLots: async () => {
    try {
      const response = await api.get('/lots');
      return response.data;
    } catch (error) {
      console.error('Error fetching lots:', error);
      throw error;
    }
  },

  // ---------------- GET LOT BY ID ----------------
  getLotById: async (id) => {
    try {
      const response = await api.get(`/lots/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lot:', error);
      throw error;
    }
  },

  // ---------------- CREATE LOT ----------------
  createLot: async (lotData) => {
    try {
      const response = await api.post('/lots', lotData);
      return response.data;
    } catch (error) {
      console.error('Error creating lot:', error);
      throw error;
    }
  },

  // ---------------- UPDATE LOT ----------------
  updateLot: async (id, lotData) => {
    try {
      const response = await api.put(`/lots/${id}`, lotData);
      return response.data;
    } catch (error) {
      console.error('Error updating lot:', error);
      throw error;
    }
  },

  // ---------------- DELETE LOT ----------------
  deleteLot: async (id) => {
    try {
      await api.delete(`/lots/${id}`);
    } catch (error) {
      console.error('Error deleting lot:', error);
      throw error;
    }
  },

  // ---------------- GET LOTS BY STATUS ----------------
  getLotsByStatut: async (statut) => {
    try {
      const response = await api.get(`/lots/statut/${statut}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lots by status:', error);
      throw error;
    }
  },

  // ---------------- GET LOTS BY TYPE ----------------
  getLotsByType: async (type) => {
    try {
      const response = await api.get(`/lots/type/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lots by type:', error);
      throw error;
    }
  },
};

export default lotService;
