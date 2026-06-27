import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllMachines, createMachine, updateMachineStatus } from '../../services/machineService';
import Sidebar from '../Common/Navbar';

const Machines = () => {
  const { user } = useAuth();
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatut, setFilterStatut] = useState('');

  const [formData, setFormData] = useState({
    nom: '',
    type: 'TORREFACTEUR',
    numeroSerie: '',
    capacite: '',
    dateMiseEnService: new Date().toISOString().split('T')[0],
    statut: 'OPERATIONNELLE',
  });

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const data = await getAllMachines();
      setMachines(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching machines:', err);
      setError('Impossible de charger les machines');
    } finally {
      setLoading(false);
    }
  };

  const canCreate = () => {
    if (!user?.roles) return false;
    return user.roles.some(role => role === 'ROLE_ADMIN');
  };

  const canUpdateStatus = () => {
    if (!user?.roles) return false;
    return user.roles.some(role =>
      role === 'ROLE_ADMIN' || role === 'ROLE_MAINTENANCE'
    );
  };

  const handleCreate = () => {
    const uniqueNum = `SN-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    setFormData({
      nom: '',
      type: 'TORREFACTEUR',
      numeroSerie: uniqueNum,
      capacite: '',
      dateMiseEnService: new Date().toISOString().split('T')[0],
      statut: 'OPERATIONNELLE',
    });
    setShowModal(true);
  };

  const handleStatusChange = async (id, newStatut) => {
    try {
      await updateMachineStatus(id, newStatut);
      fetchMachines();
    } catch (err) {
      console.error('Error updating machine status:', err);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMachine(formData);
      setShowModal(false);
      fetchMachines();
    } catch (err) {
      console.error('Error creating machine:', err);
      alert('Erreur lors de la création de la machine');
    }
  };

  const filteredMachines = filterStatut
    ? machines.filter(m => m.statut === filterStatut)
    : machines;

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'OPERATIONNELLE': return '#4CAF50';
      case 'EN_MAINTENANCE': return '#FF9800';
      case 'HORS_SERVICE': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const tdStyle = {
    color: '#b0b0b0',
    padding: '12px',
    borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
  };

  const thStyle = {
    color: '#d4a574',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #d4a574',
    fontSize: 14,
    fontWeight: 600,
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    background: '#1a1410',
    color: '#d4a574',
    border: '1px solid #d4a574',
    borderRadius: 6,
    boxSizing: 'border-box',
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#1a1410',
        color: '#d4a574',
        fontSize: 18,
      }}>
        ⏳ Chargement...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1410 0%, #2a2218 100%)',
      display: 'flex',
    }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '40px', overflow: 'auto' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>

          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
          }}>
            <h1 style={{ color: '#d4a574', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
              Gestion des Machines
            </h1>
            {canCreate() && (
              <button onClick={handleCreate} style={{
                padding: '12px 24px',
                background: '#d4a574',
                color: '#1a1410',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}>
                + Nouvelle Machine
              </button>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#f44336',
              color: 'white',
              padding: '12px 20px',
              borderRadius: 8,
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          {/* Filtre */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 12,
            padding: '20px',
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <label style={{ color: '#d4a574', fontSize: 14 }}>Filtrer par statut:</label>
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                style={{
                  padding: '8px 12px',
                  background: '#2a2218',
                  color: '#d4a574',
                  border: '1px solid #d4a574',
                  borderRadius: 6,
                  fontSize: 14,
                }}
              >
                <option value="">Tous</option>
                <option value="OPERATIONNELLE">Opérationnelle</option>
                <option value="EN_MAINTENANCE">En maintenance</option>
                <option value="HORS_SERVICE">Hors service</option>
              </select>
            </div>
          </div>

          {/* Tableau */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 12,
            padding: '20px',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Nom</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>N° Série</th>
                  <th style={thStyle}>Capacité</th>
                  <th style={thStyle}>Date Mise en Service</th>
                  <th style={thStyle}>Dernière Maintenance</th>
                  <th style={thStyle}>Statut</th>
                  {canUpdateStatus() && <th style={thStyle}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredMachines.map((machine) => (
                  <tr key={machine.id}>
                    <td style={tdStyle}>{machine.id}</td>
                    <td style={tdStyle}>{machine.nom}</td>
                    <td style={tdStyle}>{machine.type}</td>
                    <td style={tdStyle}>{machine.numeroSerie}</td>
                    <td style={tdStyle}>{machine.capacite} kg/h</td>
                    <td style={tdStyle}>{machine.dateMiseEnService}</td>
                    <td style={tdStyle}>{machine.dateDerniereMaintenance || '-'}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(212, 165, 116, 0.1)' }}>
                      <span style={{
                        background: getStatutColor(machine.statut),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                      }}>
                        {machine.statut}
                      </span>
                    </td>
                    {canUpdateStatus() && (
                      <td style={{ padding: '12px', borderBottom: '1px solid rgba(212, 165, 116, 0.1)' }}>
                        <select
                          value={machine.statut}
                          onChange={(e) => handleStatusChange(machine.id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            background: '#2a2218',
                            color: '#d4a574',
                            border: '1px solid #d4a574',
                            borderRadius: 4,
                            fontSize: 12,
                          }}
                        >
                          <option value="OPERATIONNELLE">Opérationnelle</option>
                          <option value="EN_MAINTENANCE">En maintenance</option>
                          <option value="HORS_SERVICE">Hors service</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredMachines.length === 0 && (
              <div style={{ textAlign: 'center', color: '#b0b0b0', padding: '40px' }}>
                Aucune machine trouvée
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Création */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#2a2218',
            borderRadius: 12,
            padding: '30px',
            width: '100%',
            maxWidth: 500,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <h2 style={{ color: '#d4a574', fontSize: '24px', marginBottom: '20px' }}>
              Nouvelle Machine
            </h2>
            <form onSubmit={handleSubmit}>

              {/* Nom */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>Nom</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  required
                  placeholder="ex: Torréfacteur Principal"
                  style={inputStyle}
                />
              </div>

              {/* Type — SELECT avec enums Java */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  style={inputStyle}
                >
                  <option value="TORREFACTEUR">Torréfacteur</option>
                  <option value="BROYEUR">Broyeur</option>
                  <option value="EMBALLEUSE">Emballeuse</option>
                </select>
              </div>

              {/* Numéro Série */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>Numéro de Série</label>
                <input
                  type="text"
                  value={formData.numeroSerie}
                  onChange={(e) => setFormData({...formData, numeroSerie: e.target.value})}
                  required
                  placeholder="ex: SN-2026-001"
                  style={inputStyle}
                />
              </div>

              {/* Capacité */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>Capacité (kg/h)</label>
                <input
                  type="number"
                  value={formData.capacite}
                  onChange={(e) => setFormData({...formData, capacite: e.target.value})}
                  required
                  min="1"
                  placeholder="ex: 100"
                  style={inputStyle}
                />
              </div>

              {/* Date Mise en Service */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>Date Mise en Service</label>
                <input
                  type="date"
                  value={formData.dateMiseEnService}
                  onChange={(e) => setFormData({...formData, dateMiseEnService: e.target.value})}
                  required
                  style={inputStyle}
                />
              </div>

              {/* Statut — avec OPERATIONNELLE (avec E) */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>Statut</label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({...formData, statut: e.target.value})}
                  style={inputStyle}
                >
                  <option value="OPERATIONNELLE">Opérationnelle</option>
                  <option value="EN_MAINTENANCE">En maintenance</option>
                  <option value="HORS_SERVICE">Hors service</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 20px',
                    background: 'transparent',
                    color: '#d4a574',
                    border: '1px solid #d4a574',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    background: '#d4a574',
                    color: '#1a1410',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Machines;