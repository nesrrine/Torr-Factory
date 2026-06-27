import api from './api';

export const getAllFournisseurs = async () => {
  try {
    const response = await api.get('/fournisseurs');
    return response.data;
  } catch (error) {
    console.error('Error fetching fournisseurs:', error);
    throw error;
  }
};

export const getFournisseursActifs = async () => {
  try {
    const response = await api.get('/fournisseurs/actifs');
    return response.data;
  } catch (error) {
    console.error('Error fetching active fournisseurs:', error);
    throw error;
  }
};

export const getFournisseurById = async (id) => {
  try {
    const response = await api.get(`/fournisseurs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching fournisseur:', error);
    throw error;
  }
};

export const createFournisseur = async (fournisseurData) => {
  try {
    const response = await api.post('/fournisseurs', fournisseurData);
    return response.data;
  } catch (error) {
    console.error('Error creating fournisseur:', error);
    throw error;
  }
};

export const updateFournisseur = async (id, fournisseurData) => {
  try {
    const response = await api.put(`/fournisseurs/${id}`, fournisseurData);
    return response.data;
  } catch (error) {
    console.error('Error updating fournisseur:', error);
    throw error;
  }
};

export const deleteFournisseur = async (id) => {
  try {
    const response = await api.delete(`/fournisseurs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting fournisseur:', error);
    throw error;
  }
};
