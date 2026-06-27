import api from './api';

export const getAllProduits = async () => {
  try {
    const response = await api.get('/produits');
    return response.data;
  } catch (error) {
    console.error('Error fetching produits:', error);
    throw error;
  }
};

export const getProduitById = async (id) => {
  try {
    const response = await api.get(`/produits/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching produit:', error);
    throw error;
  }
};

export const createProduit = async (produitData) => {
  try {
    const payload = {
      reference: produitData.reference,
      nom: produitData.nom,
      description: produitData.description || '',
      typeCafe: produitData.typeCafe,
      niveauTorrefaction: produitData.niveauTorrefaction || '',
      prixKg: Number(produitData.prixKg),
      stockDisponibleKg: Number(produitData.stockDisponibleKg),
      stockMiniKg: Number(produitData.stockMiniKg) || 10.0,
    };
    console.log('Payload produit:', payload);
    const response = await api.post('/produits', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating produit:', error.response?.data);
    throw error;
  }
};

export const updateProduit = async (id, produitData) => {
  try {
    const payload = {
      reference: produitData.reference,
      nom: produitData.nom,
      description: produitData.description || '',
      typeCafe: produitData.typeCafe,
      niveauTorrefaction: produitData.niveauTorrefaction || '',
      prixKg: Number(produitData.prixKg),
      stockDisponibleKg: Number(produitData.stockDisponibleKg),
      stockMiniKg: Number(produitData.stockMiniKg) || 10.0,
    };
    const response = await api.put(`/produits/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating produit:', error.response?.data);
    throw error;
  }
};

export const updateProduitStock = async (id, quantite) => {
  try {
    const response = await api.put(`/produits/${id}/stock`, null, { params: { quantite } });
    return response.data;
  } catch (error) {
    console.error('Error updating produit stock:', error);
    throw error;
  }
};

export const getProduitsStockFaible = async () => {
  try {
    const response = await api.get('/produits/stock-faible');
    return response.data;
  } catch (error) {
    console.error('Error fetching low stock produits:', error);
    throw error;
  }
};