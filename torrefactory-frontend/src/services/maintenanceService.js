import api from './api';

export const getAllMaintenances = async () => {
  try {
    const response = await api.get('/maintenances');
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenances:', error);
    throw error;
  }
};

export const getMaintenanceById = async (id) => {
  try {
    const response = await api.get(`/maintenances/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenance:', error);
    throw error;
  }
};

export const createMaintenance = async (maintenanceData) => {
  try {
    const response = await api.post('/maintenances', maintenanceData);
    return response.data;
  } catch (error) {
    console.error('Error creating maintenance:', error);
    throw error;
  }
};

export const updateMaintenanceStatus = async (id, statut) => {
  try {
    const response = await api.put(`/maintenances/${id}/statut`, null, { params: { statut } });
    return response.data;
  } catch (error) {
    console.error('Error updating maintenance status:', error);
    throw error;
  }
};

export const getMaintenancesByMachine = async (machineId) => {
  try {
    const response = await api.get(`/maintenances/machine/${machineId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenances by machine:', error);
    throw error;
  }
};
