import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllMaintenances, createMaintenance, updateMaintenanceStatus } from '../../services/maintenanceService';
import { getAllMachines } from '../../services/machineService';
import Layout from '../Common/Layout';

const Maintenance = () => {
  const { user } = useAuth();
  const [maintenances, setMaintenances] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterMachine, setFilterMachine] = useState('');

  const [formData, setFormData] = useState({
    machineId: '',
    type: 'PREVENTIVE',
    description: '',
    dateIntervention: '',
    coutEuros: 0,
    technicienId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [maintenancesData, machinesData] = await Promise.all([
        getAllMaintenances(),
        getAllMachines(),
      ]);
      setMaintenances(maintenancesData);
      setMachines(machinesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const canCreate = () => {
    if (!user?.roles) return false;
    return user.roles.some(role =>
      role === 'ROLE_ADMIN' || role === 'ROLE_MAINTENANCE'
    );
  };

  const canUpdateStatus = () => {
    if (!user?.roles) return false;
    return user.roles.some(role =>
      role === 'ROLE_ADMIN' || role === 'ROLE_MAINTENANCE'
    );
  };

  const handleCreate = () => {
    setFormData({
      machineId: '',
      type: 'PREVENTIVE',
      description: '',
      dateIntervention: new Date().toISOString().split('T')[0],
      coutEuros: 0,
      technicienId: '',
    });
    setShowModal(true);
  };

  const handleStatusChange = async (id, newStatut) => {
    try {
      await updateMaintenanceStatus(id, newStatut);
      fetchData();
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.machineId) { alert('Veuillez sélectionner une machine'); return; }
    if (!formData.dateIntervention) { alert("Veuillez saisir la date d'intervention"); return; }

    try {
      const dataToSend = {
        machineId: Number(formData.machineId),
        type: formData.type,
        description: formData.description,
        dateIntervention: formData.dateIntervention,
        coutEuros: formData.coutEuros || 0,
        technicienId: formData.technicienId ? Number(formData.technicienId) : null,
      };
      await createMaintenance(dataToSend);
      setShowModal(false);
      fetchData();
      alert('Maintenance créée avec succès');
    } catch (err) {
      alert('Erreur: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredMaintenances = filterMachine
    ? maintenances.filter(m => m.machineId === Number(filterMachine))
    : maintenances;

  const getMachineName = (machineId) => {
    const machine = machines.find(m => m.id === machineId);
    return machine ? machine.nom || `Machine #${machineId}` : `Machine #${machineId}`;
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'PLANIFIEE': return '#FF9800';
      case 'EN_COURS': return '#4CAF50';
      case 'TERMINEE': return '#2196F3';
      case 'ANNULEE': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'PREVENTIVE': return '#9C27B0';
      case 'CORRECTIVE': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const thStyle = {
    color: '#d4a574', padding: '12px', textAlign: 'left',
    borderBottom: '1px solid #d4a574', fontSize: 14, fontWeight: 600,
  };

  const tdStyle = {
    color: '#b0b0b0', padding: '12px',
    borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
  };

  const inputStyle = {
    width: '100%', padding: '10px', background: '#1a1410',
    color: '#d4a574', border: '1px solid #d4a574',
    borderRadius: 6, fontSize: 14, boxSizing: 'border-box',
  };

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', backgroundColor: '#1a1410', color: '#d4a574', fontSize: 18,
    }}>⏳ Chargement...</div>
  );

  return (
    <Layout>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#d4a574', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
            Gestion de la Maintenance
          </h1>
          {canCreate() && (
            <button onClick={handleCreate} style={{
              padding: '12px 24px', background: '#d4a574', color: '#1a1410',
              border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>
              + Nouvelle Maintenance
            </button>
          )}
        </div>

        {error && (
          <div style={{ background: '#f44336', color: 'white', padding: '12px 20px', borderRadius: 8, marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {/* Filtre */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <label style={{ color: '#d4a574', fontSize: 14 }}>Filtrer par machine:</label>
            <select value={filterMachine} onChange={(e) => setFilterMachine(e.target.value)}
              style={{ padding: '8px 12px', background: '#2a2218', color: '#d4a574', border: '1px solid #d4a574', borderRadius: 6, fontSize: 14 }}>
              <option value="">-- Toutes les machines --</option>
              {machines.map((machine) => (
                <option key={machine.id} value={machine.id}>
                  {machine.nom || `Machine #${machine.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tableau */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Machine</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Date Intervention</th>
                <th style={thStyle}>Coût (€)</th>
                <th style={thStyle}>Statut</th>
                {canUpdateStatus() && <th style={thStyle}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredMaintenances.map((maintenance) => (
                <tr key={maintenance.id}>
                  <td style={tdStyle}>{maintenance.id}</td>
                  <td style={tdStyle}>{getMachineName(maintenance.machineId)}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid rgba(212,165,116,0.1)' }}>
                    <span style={{
                      background: getTypeColor(maintenance.type), color: 'white',
                      padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                    }}>
                      {maintenance.type}
                    </span>
                  </td>
                  <td style={tdStyle}>{maintenance.description}</td>
                  <td style={tdStyle}>{maintenance.dateIntervention || '-'}</td>
                  <td style={tdStyle}>{maintenance.coutEuros ? `${maintenance.coutEuros}€` : '-'}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid rgba(212,165,116,0.1)' }}>
                    <span style={{
                      background: getStatutColor(maintenance.statut), color: 'white',
                      padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                    }}>
                      {maintenance.statut}
                    </span>
                  </td>
                  {canUpdateStatus() && (
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(212,165,116,0.1)' }}>
                      <select value={maintenance.statut}
                        onChange={(e) => handleStatusChange(maintenance.id, e.target.value)}
                        style={{ padding: '6px 10px', background: '#2a2218', color: '#d4a574', border: '1px solid #d4a574', borderRadius: 4, fontSize: 12 }}>
                        <option value="PLANIFIEE">Planifiée</option>
                        <option value="EN_COURS">En cours</option>
                        <option value="TERMINEE">Terminée</option>
                        <option value="ANNULEE">Annulée</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMaintenances.length === 0 && (
            <div style={{ textAlign: 'center', color: '#b0b0b0', padding: '40px' }}>
              Aucune maintenance trouvée
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#2a2218', borderRadius: 12, padding: '30px',
            width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto',
          }}>
            <h2 style={{ color: '#d4a574', fontSize: '24px', marginBottom: '20px' }}>
              Nouvelle Maintenance
            </h2>
            <form onSubmit={handleSubmit}>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px', fontWeight: 600 }}>Machine *</label>
                <select value={formData.machineId}
                  onChange={(e) => setFormData({...formData, machineId: e.target.value})}
                  required style={inputStyle}>
                  <option value="">-- Sélectionner une machine --</option>
                  {machines.map((machine) => (
                    <option key={machine.id} value={machine.id}>
                      {machine.nom || `Machine #${machine.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px', fontWeight: 600 }}>Type *</label>
                <select value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  style={inputStyle}>
                  <option value="PREVENTIVE">Préventive</option>
                  <option value="CORRECTIVE">Corrective</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px', fontWeight: 600 }}>Description *</label>
                <textarea value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required rows={3} placeholder="Décrivez la maintenance..."
                  style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }} />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px', fontWeight: 600 }}>Date d'Intervention *</label>
                <input type="date" value={formData.dateIntervention}
                  onChange={(e) => setFormData({...formData, dateIntervention: e.target.value})}
                  required style={inputStyle} />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px', fontWeight: 600 }}>Coût (€)</label>
                <input type="number" min="0" step="0.01" value={formData.coutEuros}
                  onChange={(e) => setFormData({...formData, coutEuros: parseFloat(e.target.value) || 0})}
                  placeholder="0.00" style={inputStyle} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px', fontWeight: 600 }}>Technicien (Optionnel)</label>
                <input type="number" value={formData.technicienId}
                  onChange={(e) => setFormData({...formData, technicienId: e.target.value})}
                  placeholder="ID du technicien" style={inputStyle} />
              </div>

              <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  padding: '10px 20px', background: 'transparent', color: '#d4a574',
                  border: '1px solid #d4a574', borderRadius: 6, cursor: 'pointer', fontWeight: 600,
                }}>Annuler</button>
                <button type="submit" style={{
                  padding: '10px 20px', background: '#d4a574', color: '#1a1410',
                  border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600,
                }}>Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Maintenance;