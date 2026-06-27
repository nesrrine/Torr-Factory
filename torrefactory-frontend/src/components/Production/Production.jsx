import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllProductions, createProduction, updateProductionStatus } from '../../services/productionService';
import { getAllMachines } from '../../services/machineService';
import lotService from '../../services/lotService';
import Sidebar from '../Common/Navbar';

const Production = () => {
  const { user } = useAuth();
  const [productions, setProductions] = useState([]);
  const [machines, setMachines] = useState([]);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatut, setFilterStatut] = useState('');

  const [formData, setFormData] = useState({
    lotCafeId: '',
    machineId: '',
    operateurId: '',
    dateTorrefaction: new Date().toISOString().split('T')[0],
    temperatureCelsius: 200,
    dureeMinutes: 15,
    quantiteTorrefieeKg: '',
    observations: '',
  });

  useEffect(() => {
    fetchAll();
  }, []);

const fetchAll = async () => {
  try {
    setLoading(true);
    const [productionsData, machinesData, lotsData] = await Promise.all([
      getAllProductions(),
      getAllMachines(),
      lotService.getAllLots(), // ← avec lotService.
    ]);
    setProductions(productionsData);
    setMachines(machinesData);
    setLots(lotsData);
    setError(null);
  } catch (err) {
    setError('Impossible de charger les données');
  } finally {
    setLoading(false);
  }
};
  const canCreate = () => {
    if (!user?.roles) return false;
    return user.roles.some(role =>
      role === 'ROLE_ADMIN' || role === 'ROLE_PRODUCTION_MANAGER'
    );
  };

  const canUpdateStatus = () => {
    if (!user?.roles) return false;
    return user.roles.some(role =>
      role === 'ROLE_ADMIN' || role === 'ROLE_PRODUCTION_MANAGER' || role === 'ROLE_WORKER'
    );
  };

  const handleCreate = () => {
    setFormData({
      lotCafeId: lots[0]?.id || '',
      machineId: machines[0]?.id || '',
      operateurId: '',
      dateTorrefaction: new Date().toISOString().split('T')[0],
      temperatureCelsius: 200,
      dureeMinutes: 15,
      quantiteTorrefieeKg: '',
      observations: '',
    });
    setShowModal(true);
  };

  const handleStatusChange = async (id, newStatut) => {
    try {
      await updateProductionStatus(id, newStatut);
      fetchAll();
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduction(formData);
      setShowModal(false);
      fetchAll();
    } catch (err) {
      console.error('Error creating production:', err);
      alert('Erreur lors de la création de la production');
    }
  };

  const filteredProductions = filterStatut
    ? productions.filter(p => p.statut === filterStatut)
    : productions;

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'EN_COURS': return '#4CAF50';
      case 'TERMINEE': return '#2196F3';
      case 'ANNULEE': return '#f44336';
      case 'EN_PAUSE': return '#FF9800';
      default: return '#9e9e9e';
    }
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

  const thStyle = {
    color: '#d4a574',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #d4a574',
    fontSize: 14,
    fontWeight: 600,
  };

  const tdStyle = {
    color: '#b0b0b0',
    padding: '12px',
    borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', backgroundColor: '#1a1410', color: '#d4a574', fontSize: 18,
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
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '30px',
          }}>
            <h1 style={{ color: '#d4a574', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
              Gestion de la Production
            </h1>
            {canCreate() && (
              <button onClick={handleCreate} style={{
                padding: '12px 24px', background: '#d4a574', color: '#1a1410',
                border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>
                + Nouvelle Production
              </button>
            )}
          </div>

          {error && (
            <div style={{
              background: '#f44336', color: 'white',
              padding: '12px 20px', borderRadius: 8, marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          {/* Filtre */}
          <div style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: 12,
            padding: '20px', marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <label style={{ color: '#d4a574', fontSize: 14 }}>Filtrer par statut:</label>
              <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}
                style={{
                  padding: '8px 12px', background: '#2a2218', color: '#d4a574',
                  border: '1px solid #d4a574', borderRadius: 6, fontSize: 14,
                }}>
                <option value="">Tous</option>
                <option value="EN_COURS">En cours</option>
                <option value="TERMINEE">Terminée</option>
                <option value="ANNULEE">Annulée</option>
                <option value="EN_PAUSE">En pause</option>
              </select>
            </div>
          </div>

          {/* Tableau */}
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Lot</th>
                  <th style={thStyle}>Machine</th>
                  <th style={thStyle}>Quantité</th>
                  <th style={thStyle}>Température</th>
                  <th style={thStyle}>Durée</th>
                  <th style={thStyle}>Date Torréfaction</th>
                  <th style={thStyle}>Statut</th>
                  {canUpdateStatus() && <th style={thStyle}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredProductions.map((production) => (
                  <tr key={production.id}>
                    <td style={tdStyle}>{production.id}</td>
                    <td style={tdStyle}>{production.lotNumero || production.lotId}</td>
                    <td style={tdStyle}>{production.machineNom || production.machineId}</td>
                    <td style={tdStyle}>{production.quantiteTorrefieeKg} kg</td>
                    <td style={tdStyle}>{production.temperatureCelsius}°C</td>
                    <td style={tdStyle}>{production.dureeMinutes} min</td>
                    <td style={tdStyle}>{production.dateTorrefaction}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(212,165,116,0.1)' }}>
                      <span style={{
                        background: getStatutColor(production.statut),
                        color: 'white', padding: '4px 12px',
                        borderRadius: 12, fontSize: 12, fontWeight: 600,
                      }}>
                        {production.statut}
                      </span>
                    </td>
                    {canUpdateStatus() && (
                      <td style={{ padding: '12px', borderBottom: '1px solid rgba(212,165,116,0.1)' }}>
                        <select
                          value={production.statut}
                          onChange={(e) => handleStatusChange(production.id, e.target.value)}
                          style={{
                            padding: '6px 10px', background: '#2a2218', color: '#d4a574',
                            border: '1px solid #d4a574', borderRadius: 4, fontSize: 12,
                          }}
                        >
                          <option value="EN_COURS">En cours</option>
                          <option value="TERMINEE">Terminée</option>
                          <option value="ANNULEE">Annulée</option>
                          <option value="EN_PAUSE">En pause</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProductions.length === 0 && (
              <div style={{ textAlign: 'center', color: '#b0b0b0', padding: '40px' }}>
                Aucune production trouvée
              </div>
            )}
          </div>
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
              Nouvelle Production
            </h2>
            <form onSubmit={handleSubmit}>

              {/* Lot — DROPDOWN */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                  Lot de Café
                </label>
                <select
                  value={formData.lotCafeId}
                  onChange={(e) => setFormData({...formData, lotCafeId: e.target.value})}
                  required
                  style={inputStyle}
                >
                  <option value="">-- Choisir un lot --</option>
                  {lots.map(lot => (
                    <option key={lot.id} value={lot.id}>
                      {lot.numeroLot || lot.numero || `Lot #${lot.id}`} — {lot.typeCafe || lot.origine || ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Machine — DROPDOWN */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                  Machine
                </label>
                <select
                  value={formData.machineId}
                  onChange={(e) => setFormData({...formData, machineId: e.target.value})}
                  required
                  style={inputStyle}
                >
                  <option value="">-- Choisir une machine --</option>
                  {machines
                    .filter(m => m.statut === 'OPERATIONNELLE')
                    .map(machine => (
                      <option key={machine.id} value={machine.id}>
                        {machine.nom} — {machine.type}
                      </option>
                    ))
                  }
                </select>
              </div>

              {/* Date Torréfaction */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                  Date Torréfaction
                </label>
                <input
                  type="date"
                  value={formData.dateTorrefaction}
                  onChange={(e) => setFormData({...formData, dateTorrefaction: e.target.value})}
                  required
                  style={inputStyle}
                />
              </div>

              {/* Température */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                  Température (°C) — min: 100, max: 250
                </label>
                <input
                  type="number"
                  min="100" max="250"
                  value={formData.temperatureCelsius}
                  onChange={(e) => setFormData({...formData, temperatureCelsius: parseInt(e.target.value)})}
                  required
                  style={inputStyle}
                />
              </div>

              {/* Durée */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                  Durée (minutes)
                </label>
                <input
                  type="number" min="1"
                  value={formData.dureeMinutes}
                  onChange={(e) => setFormData({...formData, dureeMinutes: parseInt(e.target.value)})}
                  required
                  style={inputStyle}
                />
              </div>

              {/* Quantité */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                  Quantité Torréfiée (kg)
                </label>
                <input
                  type="number" min="0" step="0.1"
                  value={formData.quantiteTorrefieeKg}
                  onChange={(e) => setFormData({...formData, quantiteTorrefieeKg: parseFloat(e.target.value)})}
                  required
                  style={inputStyle}
                />
              </div>

              {/* Observations */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                  Observations
                </label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({...formData, observations: e.target.value})}
                  rows={3}
                  placeholder="Notes optionnelles..."
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  padding: '10px 20px', background: 'transparent', color: '#d4a574',
                  border: '1px solid #d4a574', borderRadius: 6, cursor: 'pointer',
                }}>
                  Annuler
                </button>
                <button type="submit" style={{
                  padding: '10px 20px', background: '#d4a574', color: '#1a1410',
                  border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600,
                }}>
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

export default Production;