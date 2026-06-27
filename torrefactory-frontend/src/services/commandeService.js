import api from './api';

export const getAllCommandes = async () => {
  try {
    const response = await api.get('/commandes');
    return response.data;
  } catch (error) {
    console.error('Error fetching commandes:', error);
    throw error;
  }
};

export const getCommandeById = async (id) => {
  try {
    const response = await api.get(`/commandes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching commande:', error);
    throw error;
  }
};

export const createCommande = async (commandeData) => {
  try {
    const payload = {
      clientId: Number(commandeData.clientId),
      dateLivraisonPrevue: commandeData.dateLivraisonPrevue,
      adresseLivraison: commandeData.adresseLivraison,
      lignes: commandeData.lignes.map(l => ({
        produitId: Number(l.produitId),
        quantiteKg: Number(l.quantiteKg),
      })),
    };
    console.log('Payload commande:', JSON.stringify(payload));
    const response = await api.post('/commandes', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating commande:', error.response?.data);
    throw error;
  }
};

export const updateCommandeStatus = async (id, statut) => {
  try {
    const response = await api.put(`/commandes/${id}/statut`, null, { params: { statut } });
    return response.data;
  } catch (error) {
    console.error('Error updating commande status:', error);
    throw error;
  }
};

export const getCommandesByClient = async (clientId) => {
  try {
    const response = await api.get(`/commandes/client/${clientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching commandes by client:', error);
    throw error;
  }
};