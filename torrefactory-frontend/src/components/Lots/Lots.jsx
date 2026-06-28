import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import lotService from '../../services/lotService';
import Sidebar from '../Common/Navbar';

const Lots = () => {
  const { user } = useAuth();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingLot, setEditingLot] = useState(null);
  const [filterStatut, setFilterStatut] = useState('');
  const [filterType, setFilterType] = useState('');

  const [formData, setFormData] = useState({
    numeroLot: '',
    typeCafe: 'ARABICA',
    origine: '',
    quantiteKg: '',
    dateReception: '',
    fournisseur: '',
    statut: 'EN_STOCK',
  });

  useEffect(() => {
    fetchLots();
  }, []);

  const fetchLots = async () => {
    try {
      setLoading(true);
      const data = await lotService.getAllLots();
      setLots(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching lots:', err);
      setError('Impossible de charger les lots');
    } finally {
      setLoading(false);
    }
  };

  const canEdit = () => {
    if (!user?.roles) return false;
    return user.roles.some(role => 
      role === 'ROLE_ADMIN' || role === 'ROLE_PRODUCTION_MANAGER'
    );
  };

  const isWorker = () => {
    return user?.roles?.some(role => role === 'ROLE_WORKER');
  };

  const handleCreate = () => {
    setEditingLot(null);
    setFormData({
      numeroLot: '',
      typeCafe: 'ARABICA',
      origine: '',
      quantiteKg: '',
      dateReception: new Date().toISOString().split('T')[0],
      fournisseur: '',
      statut: 'EN_STOCK',
    });
    setShowModal(true);
  };

  const handleEdit = (lot) => {
    setEditingLot(lot);
    setFormData({
      numeroLot: lot.numeroLot,
      typeCafe: lot.typeCafe,
      origine: lot.origine,
      quantiteKg: lot.quantiteKg,
      dateReception: lot.dateReception,
      fournisseur: lot.fournisseur,
      statut: lot.statut,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce lot ?')) return;
    
    try {
      await lotService.deleteLot(id);
      fetchLots();
    } catch (err) {
      console.error('Error deleting lot:', err);
      alert('Erreur lors de la suppression du lot');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingLot) {
        await lotService.updateLot(editingLot.id, formData);
      } else {
        await lotService.createLot(formData);
      }
      setShowModal(false);
      fetchLots();
    } catch (err) {
      console.error('Error saving lot:', err);
      alert('Erreur lors de l\'enregistrement du lot');
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'EN_STOCK': return '#81b29a';
      case 'EN_PRODUCTION': return '#ffe66d';
      case 'TORREFIE': return '#d4a574';
      case 'EXPIRE': return '#ff6b6b';
      default: return '#b0b0b0';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'ARABICA': return '#4ecdc4';
      case 'ROBUSTA': return '#ff6b6b';
      case 'MELANGE': return '#d4a574';
      default: return '#b0b0b0';
    }
  };

  const filteredLots = lots.filter(lot => {
    if (filterStatut && lot.statut !== filterStatut) return false;
    if (filterType && lot.typeCafe !== filterType) return false;
    return true;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#1a1410', color: '#d4a574' }}>
        ⏳ Chargement...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1410 0%, #2a2218 100%)', display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 260, padding: '40px 20px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 700, color: '#d4a574', margin: 0 }}>
                Lots de Café
              </h1>
              <p style={{ fontSize: 14, color: '#b0b0b0', margin: '8px 0 0 0' }}>
                Gestion des lots de grains verts
              </p>
            </div>
            {canEdit() && !isWorker() && (
              <button
                onClick={handleCreate}
                style={{
                  padding: '12px 24px',
                  background: '#d4a574',
                  color: '#1a1410',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + Nouveau Lot
              </button>
            )}
          </div>

          {/* Filters */}
          <div style={{ marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              style={{
                padding: '10px 16px',
                background: '#2a2218',
                border: '1px solid #3a3228',
                borderRadius: 8,
                color: '#d4a574',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              <option value="">Tous les statuts</option>
              <option value="EN_STOCK">En Stock</option>
              <option value="EN_PRODUCTION">En Production</option>
              <option value="TORREFIE">Torréfié</option>
              <option value="EXPIRE">Expiré</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '10px 16px',
                background: '#2a2218',
                border: '1px solid #3a3228',
                borderRadius: 8,
                color: '#f5f5f5',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              <option value="">Tous les types</option>
              <option value="ARABICA">Arabica</option>
              <option value="ROBUSTA">Robusta</option>
              <option value="MELANGE">Mélange</option>
            </select>
          </div>

          {/* Table */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid #3a3228',
            borderRadius: 12,
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(212, 165, 116, 0.1)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#d4a574', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
                    N° Lot
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#d4a574', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
                    Type
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#d4a574', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
                    Origine
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#d4a574', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
                    Quantité (kg)
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#d4a574', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
                    Fournisseur
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#d4a574', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
                    Statut
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', color: '#d4a574', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
                    Date Réception
                  </th>
                  {canEdit() && !isWorker() && (
                    <th style={{ padding: '16px', textAlign: 'right', color: '#d4a574', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredLots.length === 0 ? (
                  <tr>
                    <td colSpan={canEdit() ? 8 : 7} style={{ padding: 48, textAlign: 'center', color: '#888' }}>
                      Aucun lot trouvé
                    </td>
                  </tr>
                ) : (
                  filteredLots.map((lot) => (
                    <tr key={lot.id} style={{ borderBottom: '1px solid #3a3228' }}>
                      <td style={{ padding: '16px', color: '#f5f5f5', fontSize: 14, fontWeight: 600 }}>
                        {lot.numeroLot}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 600,
                          background: `${getTypeColor(lot.typeCafe)}20`,
                          color: getTypeColor(lot.typeCafe),
                        }}>
                          {lot.typeCafe}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#b0b0b0', fontSize: 14 }}>
                        {lot.origine}
                      </td>
                      <td style={{ padding: '16px', color: '#f5f5f5', fontSize: 14, fontWeight: 600 }}>
                        {lot.quantiteKg} kg
                      </td>
                      <td style={{ padding: '16px', color: '#b0b0b0', fontSize: 14 }}>
                        {lot.fournisseur}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 600,
                          background: `${getStatutColor(lot.statut)}20`,
                          color: getStatutColor(lot.statut),
                        }}>
                          {lot.statut.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#b0b0b0', fontSize: 14 }}>
                        {new Date(lot.dateReception).toLocaleDateString('fr-FR')}
                      </td>
                      {canEdit() && !isWorker() && (
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleEdit(lot)}
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(212, 165, 116, 0.1)',
                              border: '1px solid #d4a574',
                              borderRadius: 6,
                              color: '#d4a574',
                              fontSize: 12,
                              cursor: 'pointer',
                              marginRight: 8,
                            }}
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(lot.id)}
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(255, 107, 107, 0.1)',
                              border: '1px solid #ff6b6b',
                              borderRadius: 6,
                              color: '#ff6b6b',
                              fontSize: 12,
                              cursor: 'pointer',
                            }}
                          >
                            Supprimer
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
        }}>
          <div style={{
            background: '#2a2218',
            border: '1px solid #3a3228',
            borderRadius: 12,
            padding: 32,
            maxWidth: 500,
            width: '90%',
          }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f5f5f5', margin: '0 0 24px 0' }}>
              {editingLot ? 'Modifier le Lot' : 'Nouveau Lot'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: '#b0b0b0', fontSize: 14, marginBottom: 8 }}>
                  Numéro de Lot *
                </label>
                <input
                  type="text"
                  value={formData.numeroLot}
                  onChange={(e) => setFormData({ ...formData, numeroLot: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1410',
                    border: '1px solid #3a3228',
                    borderRadius: 8,
                    color: '#f5f5f5',
                    fontSize: 14,
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: '#b0b0b0', fontSize: 14, marginBottom: 8 }}>
                  Type de Café *
                </label>
                <select
                  value={formData.typeCafe}
                  onChange={(e) => setFormData({ ...formData, typeCafe: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1410',
                    border: '1px solid #3a3228',
                    borderRadius: 8,
                    color: '#f5f5f5',
                    fontSize: 14,
                  }}
                >
                  <option value="ARABICA">Arabica</option>
                  <option value="ROBUSTA">Robusta</option>
                  <option value="MELANGE">Mélange</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: '#b0b0b0', fontSize: 14, marginBottom: 8 }}>
                  Origine *
                </label>
                <input
                  type="text"
                  value={formData.origine}
                  onChange={(e) => setFormData({ ...formData, origine: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1410',
                    border: '1px solid #3a3228',
                    borderRadius: 8,
                    color: '#f5f5f5',
                    fontSize: 14,
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: '#b0b0b0', fontSize: 14, marginBottom: 8 }}>
                  Quantité (kg) *
                </label>
                <input
                  type="number"
                  value={formData.quantiteKg}
                  onChange={(e) => setFormData({ ...formData, quantiteKg: parseFloat(e.target.value) })}
                  required
                  min="0"
                  step="0.1"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1410',
                    border: '1px solid #3a3228',
                    borderRadius: 8,
                    color: '#f5f5f5',
                    fontSize: 14,
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: '#b0b0b0', fontSize: 14, marginBottom: 8 }}>
                  Fournisseur *
                </label>
                <input
                  type="text"
                  value={formData.fournisseur}
                  onChange={(e) => setFormData({ ...formData, fournisseur: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1410',
                    border: '1px solid #3a3228',
                    borderRadius: 8,
                    color: '#f5f5f5',
                    fontSize: 14,
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: '#b0b0b0', fontSize: 14, marginBottom: 8 }}>
                  Date de Réception *
                </label>
                <input
                  type="date"
                  value={formData.dateReception}
                  onChange={(e) => setFormData({ ...formData, dateReception: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1410',
                    border: '1px solid #3a3228',
                    borderRadius: 8,
                    color: '#f5f5f5',
                    fontSize: 14,
                  }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', color: '#b0b0b0', fontSize: 14, marginBottom: 8 }}>
                  Statut *
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1410',
                    border: '1px solid #3a3228',
                    borderRadius: 8,
                    color: '#f5f5f5',
                    fontSize: 14,
                  }}
                >
                  <option value="EN_STOCK">En Stock</option>
                  <option value="EN_PRODUCTION">En Production</option>
                  <option value="TORREFIE">Torréfié</option>
                  <option value="EXPIRE">Expiré</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: '1px solid #3a3228',
                    borderRadius: 8,
                    color: '#b0b0b0',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: '#d4a574',
                    color: '#1a1410',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {editingLot ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lots;
