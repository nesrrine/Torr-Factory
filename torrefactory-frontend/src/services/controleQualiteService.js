import api from './api';

export const getAllControles = async () => {
  try {
    const response = await api.get('/controles-qualite');
    return response.data;
  } catch (error) {
    console.error('Error fetching controles:', error);
    throw error;
  }
};

export const getControlesByLot = async (lotId) => {
  try {
    const response = await api.get(`/controles-qualite/lot/${lotId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching controles by lot:', error);
    throw error;
  }
};

export const getControlesNonConformes = async () => {
  try {
    const response = await api.get('/controles-qualite/non-conformes');
    return response.data;
  } catch (error) {
    console.error('Error fetching non-conforme controles:', error);
    throw error;
  }
};

export const getControleById = async (id) => {
  try {
    const response = await api.get(`/controles-qualite/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching controle:', error);
    throw error;
  }
};

export const createControle = async (controleData) => {
  try {
    const response = await api.post('/controles-qualite', controleData);
    return response.data;
  } catch (error) {
    console.error('Error creating controle:', error);
    throw error;
  }
};

export const updateControle = async (id, controleData) => {
  try {
    const response = await api.put(`/controles-qualite/${id}`, controleData);
    return response.data;
  } catch (error) {
    console.error('Error updating controle:', error);
    throw error;
  }
};

export const deleteControle = async (id) => {
  try {
    const response = await api.delete(`/controles-qualite/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting controle:', error);
    throw error;
  }
};
