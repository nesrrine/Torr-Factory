import api from './api';

export const getAllProductions = async () => {
  try {
    const response = await api.get('/productions');
    return response.data;
  } catch (error) {
    console.error('Error fetching productions:', error);
    throw error;
  }
};

export const createProduction = async (productionData) => {
  try {
    const payload = {
      lotCafeId: Number(productionData.lotCafeId),   // ← nom exact du DTO Java
      machineId: Number(productionData.machineId),
      operateurId: productionData.operateurId ? Number(productionData.operateurId) : null,
      dateTorrefaction: productionData.dateTorrefaction,
      temperatureCelsius: Number(productionData.temperatureCelsius),
      dureeMinutes: Number(productionData.dureeMinutes),
      quantiteTorrefieeKg: Number(productionData.quantiteTorrefieeKg),
      observations: productionData.observations || '',
    };
    console.log('Payload envoyé:', payload);
    const response = await api.post('/productions', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating production:', error.response?.data);
    throw error;
  }
};

export const updateProductionStatus = async (id, statut) => {
  try {
    const response = await api.put(`/productions/${id}/statut`, null, { params: { statut } });
    return response.data;
  } catch (error) {
    console.error('Error updating production status:', error);
    throw error;
  }
};