import api from './api';

/**
 * Service pour gérer les opérations CRUD et requêtes sur les Lots
 */
const lotService = {
  
  // ==================== GET OPERATIONS ====================

  /**
   * Récupère tous les lots
   * @returns {Promise<Array>} Liste de tous les lots
   */
  getAllLots: async () => {
    try {
      const response = await api.get('/lots');
      if (!response.data) {
        throw new Error('Aucun lot trouvé');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching lots:', error);
      throw error;
    }
  },

  /**
   * Récupère un lot par son ID
   * @param {number} id - L'ID du lot
   * @returns {Promise<Object>} Les données du lot
   */
  getLotById: async (id) => {
    if (!id || id <= 0) {
      throw new Error('ID du lot invalide');
    }
    try {
      const response = await api.get(`/lots/${id}`);
      if (!response.data) {
        throw new Error(`Lot #${id} non trouvé`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching lot ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les lots par statut
   * @param {string} statut - Le statut des lots (ex: EN_COURS, TERMINE)
   * @returns {Promise<Array>} Liste des lots avec ce statut
   */
  getLotsByStatut: async (statut) => {
    if (!statut || typeof statut !== 'string') {
      throw new Error('Statut du lot invalide');
    }
    try {
      const response = await api.get(`/lots/statut/${statut}`);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching lots by statut "${statut}":`, error);
      throw error;
    }
  },

  /**
   * Récupère les lots par type
   * @param {string} type - Le type de lot (ex: ARABICA, ROBUSTA)
   * @returns {Promise<Array>} Liste des lots de ce type
   */
  getLotsByType: async (type) => {
    if (!type || typeof type !== 'string') {
      throw new Error('Type de lot invalide');
    }
    try {
      const response = await api.get(`/lots/type/${type}`);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching lots by type "${type}":`, error);
      throw error;
    }
  },

  /**
   * Récupère les lots non conformes
   * @returns {Promise<Array>} Liste des lots non conformes
   */
  getLotsNonConformes: async () => {
    try {
      const response = await api.get('/lots/conformite/non-conformes');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching non-conformes lots:', error);
      throw error;
    }
  },

  /**
   * Récupère les lots en attente de contrôle
   * @returns {Promise<Array>} Liste des lots en attente
   */
  getLotsEnAttente: async () => {
    try {
      const response = await api.get('/lots/statut/EN_ATTENTE');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching lots en attente:', error);
      throw error;
    }
  },

  // ==================== CREATE OPERATIONS ====================

  /**
   * Crée un nouveau lot
   * @param {Object} lotData - Les données du lot à créer
   * @returns {Promise<Object>} Le lot créé avec son ID
   */
  createLot: async (lotData) => {
    if (!lotData || Object.keys(lotData).length === 0) {
      throw new Error('Les données du lot sont requises');
    }

    try {
      const response = await api.post('/lots', lotData);
      if (!response.data) {
        throw new Error('Erreur lors de la création du lot');
      }
      console.log('Lot créé avec succès:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating lot:', error);
      throw error;
    }
  },

  // ==================== UPDATE OPERATIONS ====================

  /**
   * Met à jour un lot
   * @param {number} id - L'ID du lot à mettre à jour
   * @param {Object} lotData - Les nouvelles données du lot
   * @returns {Promise<Object>} Le lot mis à jour
   */
  updateLot: async (id, lotData) => {
    if (!id || id <= 0) {
      throw new Error('ID du lot invalide');
    }
    if (!lotData || Object.keys(lotData).length === 0) {
      throw new Error('Les données du lot sont requises');
    }

    try {
      const response = await api.put(`/lots/${id}`, lotData);
      if (!response.data) {
        throw new Error('Erreur lors de la mise à jour du lot');
      }
      console.log(`Lot ${id} mis à jour avec succès`);
      return response.data;
    } catch (error) {
      console.error(`Error updating lot ${id}:`, error);
      throw error;
    }
  },

  /**
   * Met à jour le statut d'un lot
   * @param {number} id - L'ID du lot
   * @param {string} statut - Le nouveau statut
   * @returns {Promise<Object>} Le lot avec le nouveau statut
   */
  updateLotStatut: async (id, statut) => {
    if (!id || id <= 0) {
      throw new Error('ID du lot invalide');
    }
    if (!statut || typeof statut !== 'string') {
      throw new Error('Statut invalide');
    }

    try {
      const response = await api.put(`/lots/${id}/statut`, null, {
        params: { statut },
      });
      if (!response.data) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }
      console.log(`Statut du lot ${id} mis à jour à ${statut}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating lot ${id} status:`, error);
      throw error;
    }
  },

  /**
   * Valide un lot
   * @param {number} id - L'ID du lot à valider
   * @returns {Promise<Object>} Le lot validé
   */
  validateLot: async (id) => {
    if (!id || id <= 0) {
      throw new Error('ID du lot invalide');
    }

    try {
      const response = await api.put(`/lots/${id}/valider`);
      if (!response.data) {
        throw new Error('Erreur lors de la validation du lot');
      }
      console.log(`Lot ${id} validé avec succès`);
      return response.data;
    } catch (error) {
      console.error(`Error validating lot ${id}:`, error);
      throw error;
    }
  },

  /**
   * Rejette un lot
   * @param {number} id - L'ID du lot à rejeter
   * @param {string} raison - La raison du rejet
   * @returns {Promise<Object>} Le lot rejeté
   */
  rejectLot: async (id, raison) => {
    if (!id || id <= 0) {
      throw new Error('ID du lot invalide');
    }
    if (!raison || typeof raison !== 'string') {
      throw new Error('Une raison de rejet est requise');
    }

    try {
      const response = await api.put(`/lots/${id}/rejeter`, { raison });
      if (!response.data) {
        throw new Error('Erreur lors du rejet du lot');
      }
      console.log(`Lot ${id} rejeté`);
      return response.data;
    } catch (error) {
      console.error(`Error rejecting lot ${id}:`, error);
      throw error;
    }
  },

  // ==================== DELETE OPERATIONS ====================

  /**
   * Supprime un lot
   * @param {number} id - L'ID du lot à supprimer
   * @returns {Promise<void>}
   */
  deleteLot: async (id) => {
    if (!id || id <= 0) {
      throw new Error('ID du lot invalide');
    }

    try {
      await api.delete(`/lots/${id}`);
      console.log(`Lot ${id} supprimé avec succès`);
    } catch (error) {
      console.error(`Error deleting lot ${id}:`, error);
      throw error;
    }
  },

  // ==================== UTILITY OPERATIONS ====================

  /**
   * Récupère les statistiques des lots
   * @returns {Promise<Object>} Statistiques globales des lots
   */
  getStatistics: async () => {
    try {
      const response = await api.get('/lots/statistics');
      return response.data || {};
    } catch (error) {
      console.error('Error fetching lots statistics:', error);
      throw error;
    }
  },

  /**
   * Exporte les lots en PDF
   * @returns {Promise<Blob>} Le fichier PDF
   */
  exportToPDF: async () => {
    try {
      const response = await api.get('/lots/export/pdf', {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting lots to PDF:', error);
      throw error;
    }
  },

  /**
   * Exporte les lots en Excel
   * @returns {Promise<Blob>} Le fichier Excel
   */
  exportToExcel: async () => {
    try {
      const response = await api.get('/lots/export/excel', {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting lots to Excel:', error);
      throw error;
    }
  },

  /**
   * Recherche les lots par critères
   * @param {Object} criteria - Les critères de recherche
   * @returns {Promise<Array>} Les lots correspondant aux critères
   */
  searchLots: async (criteria) => {
    if (!criteria || Object.keys(criteria).length === 0) {
      throw new Error('Au moins un critère de recherche est requis');
    }

    try {
      const response = await api.post('/lots/search', criteria);
      return response.data || [];
    } catch (error) {
      console.error('Error searching lots:', error);
      throw error;
    }
  },
};

export default lotService;