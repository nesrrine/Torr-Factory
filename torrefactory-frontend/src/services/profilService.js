import api from './api';

export const getAllProfils = async () => {
  try {
    const response = await api.get('/profils-torrefaction');
    return response.data;
  } catch (error) {
    console.error('Error fetching profils:', error);
    throw error;
  }
};

export const getProfilsActifs = async () => {
  try {
    const response = await api.get('/profils-torrefaction/actifs');
    return response.data;
  } catch (error) {
    console.error('Error fetching active profils:', error);
    throw error;
  }
};

export const getProfilById = async (id) => {
  try {
    const response = await api.get(`/profils-torrefaction/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching profil:', error);
    throw error;
  }
};

export const createProfil = async (profilData) => {
  try {
    const response = await api.post('/profils-torrefaction', profilData);
    return response.data;
  } catch (error) {
    console.error('Error creating profil:', error);
    throw error;
  }
};

export const updateProfil = async (id, profilData) => {
  try {
    const response = await api.put(`/profils-torrefaction/${id}`, profilData);
    return response.data;
  } catch (error) {
    console.error('Error updating profil:', error);
    throw error;
  }
};

export const deleteProfil = async (id) => {
  try {
    const response = await api.delete(`/profils-torrefaction/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting profil:', error);
    throw error;
  }
};
