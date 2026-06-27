import api from './api';

export const getAllRecettes = async () => {
  try {
    const response = await api.get('/recettes');
    return response.data;
  } catch (error) {
    console.error('Error fetching recettes:', error);
    throw error;
  }
};

export const getRecettesActives = async () => {
  try {
    const response = await api.get('/recettes/actives');
    return response.data;
  } catch (error) {
    console.error('Error fetching active recettes:', error);
    throw error;
  }
};

export const getRecetteById = async (id) => {
  try {
    const response = await api.get(`/recettes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recette:', error);
    throw error;
  }
};

export const getLignesByRecette = async (recetteId) => {
  try {
    const response = await api.get(`/recettes/${recetteId}/lignes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching lignes recette:', error);
    throw error;
  }
};

export const createRecette = async (recetteData) => {
  try {
    const response = await api.post('/recettes', recetteData);
    return response.data;
  } catch (error) {
    console.error('Error creating recette:', error);
    throw error;
  }
};

export const updateRecette = async (id, recetteData) => {
  try {
    const response = await api.put(`/recettes/${id}`, recetteData);
    return response.data;
  } catch (error) {
    console.error('Error updating recette:', error);
    throw error;
  }
};

export const deleteRecette = async (id) => {
  try {
    const response = await api.delete(`/recettes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting recette:', error);
    throw error;
  }
};

export const addLigneRecette = async (recetteId, ligneData) => {
  try {
    const response = await api.post(`/recettes/${recetteId}/lignes`, ligneData);
    return response.data;
  } catch (error) {
    console.error('Error adding ligne recette:', error);
    throw error;
  }
};

export const deleteLigneRecette = async (ligneId) => {
  try {
    const response = await api.delete(`/recettes/lignes/${ligneId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting ligne recette:', error);
    throw error;
  }
};
