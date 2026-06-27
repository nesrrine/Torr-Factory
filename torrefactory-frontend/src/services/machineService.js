import api from './api';

export const getAllMachines = async () => {
  try {
    const response = await api.get('/machines');
    return response.data;
  } catch (error) {
    console.error('Error fetching machines:', error);
    throw error;
  }
};

export const getMachineById = async (id) => {
  try {
    const response = await api.get(`/machines/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching machine:', error);
    throw error;
  }
};

export const createMachine = async (machineData) => {
  try {
    // Envoyer SEULEMENT les champs qui existent dans MachineCreateRequest.java
    const payload = {
      numeroSerie: machineData.numeroSerie,
      nom: machineData.nom,
      type: machineData.type,                          // TORREFACTEUR | BROYEUR | EMBALLEUSE
      dateMiseEnService: machineData.dateMiseEnService, // LocalDate format: "2026-06-27"
    };
    console.log('🔍 Payload envoyé:', JSON.stringify(payload));
    const response = await api.post('/machines', payload);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur détail:', error.response?.data);
    throw error;
  }
};

export const updateMachineStatus = async (id, statut) => {
  try {
    const response = await api.put(`/machines/${id}/statut`, null, { params: { statut } });
    return response.data;
  } catch (error) {
    console.error('Error updating machine status:', error);
    throw error;
  }
};

export const getMachinesByStatut = async (statut) => {
  try {
    const response = await api.get(`/machines/statut/${statut}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching machines by status:', error);
    throw error;
  }
};