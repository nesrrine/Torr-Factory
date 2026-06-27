import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllMaintenances, createMaintenance, updateMaintenanceStatus } from '../../services/maintenanceService';
import Sidebar from '../Common/Navbar';

const Maintenance = () => {
  const { user } = useAuth();
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterMachine, setFilterMachine] = useState('');

  const [formData, setFormData] = useState({
    machineId: '',
    type: 'PREVENTIVE',
    description: '',
    datePlanifiee: '',
    dateRealisee: '',
    statut: 'PLANIFIEE',
  });

  useEffect(() => {
    fetchMaintenances();
  }, []);

  const fetchMaintenances = async () => {
    try {
      setLoading(true);
      const data = await getAllMaintenances();
      setMaintenances(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching maintenances:', err);
      setError('Impossible de charger les maintenances');
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
      datePlanifiee: new Date().toISOString().split('T')[0],
      dateRealisee: '',
      statut: 'PLANIFIEE',
    });
    setShowModal(true);
  };

  const handleStatusChange = async (id, newStatut) => {
    try {
      await updateMaintenanceStatus(id, newStatut);
      fetchMaintenances();
    } catch (err) {
      console.error('Error updating maintenance status:', err);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMaintenance(formData);
      setShowModal(false);
      fetchMaintenances();
    } catch (err) {
      console.error('Error creating maintenance:', err);
      alert('Erreur lors de la création de la maintenance');
    }
  };

  const filteredMaintenances = filterMachine 
    ? maintenances.filter(m => m.machineId == filterMachine)
    : maintenances;

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
      <div style={{
        flex: 1,
        padding: '40px',
        overflow: 'auto',
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
          }}>
            <h1 style={{
              color: '#d4a574',
              fontSize: '32px',
              fontWeight: 'bold',
              margin: 0,
            }}>
              Gestion de la Maintenance
            </h1>
            {canCreate() && (
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
                + Nouvelle Maintenance
              </button>
            )}
          </div>

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

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 12,
            padding: '20px',
            marginBottom: '20px',
          }}>
            <div style={{
              display: 'flex',
              gap: '15px',
              alignItems: 'center',
            }}>
              <label style={{ color: '#d4a574', fontSize: 14 }}>Filtrer par machine:</label>
              <input
                type="number"
                value={filterMachine}
                onChange={(e) => setFilterMachine(e.target.value)}
                placeholder="ID Machine"
                style={{
                  padding: '8px 12px',
                  background: '#2a2218',
                  color: '#d4a574',
                  border: '1px solid #d4a574',
                  borderRadius: 6,
                  fontSize: 14,
                }}
              />
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 12,
            padding: '20px',
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}>
              <thead>
                <tr>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>ID</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Machine</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Type</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Description</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Date Planifiée</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Date Réalisée</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Statut</th>
                  {canUpdateStatus() && (
                    <th style={{
                      color: '#d4a574',
                      padding: '12px',
                      textAlign: 'left',
                      borderBottom: '1px solid #d4a574',
                      fontSize: 14,
                      fontWeight: 600,
                    }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredMaintenances.map((maintenance) => (
                  <tr key={maintenance.id}>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{maintenance.id}</td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{maintenance.machineId}</td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>
                      <span style={{
                        background: getTypeColor(maintenance.type),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                      }}>
                        {maintenance.type}
                      </span>
                    </td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{maintenance.description}</td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{maintenance.datePlanifiee}</td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{maintenance.dateRealisee || '-'}</td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>
                      <span style={{
                        background: getStatutColor(maintenance.statut),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                      }}>
                        {maintenance.statut}
                      </span>
                    </td>
                    {canUpdateStatus() && (
                      <td style={{
                        padding: '12px',
                        borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                      }}>
                        <select
                          value={maintenance.statut}
                          onChange={(e) => handleStatusChange(maintenance.id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            background: '#2a2218',
                            color: '#d4a574',
                            border: '1px solid #d4a574',
                            borderRadius: 4,
                            fontSize: 12,
                          }}
                        >
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
              <div style={{
                textAlign: 'center',
                color: '#b0b0b0',
                padding: '40px',
              }}>
                Aucune maintenance trouvée
              </div>
            )}
          </div>
        </div>
      </div>

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
          zIndex: 1000,
        }}>
          <div style={{
            background: '#2a2218',
            borderRadius: 12,
            padding: '30px',
            width: '100%',
            maxWidth: 500,
          }}>
            <h2 style={{
              color: '#d4a574',
              fontSize: '24px',
              marginBottom: '20px',
            }}>
              Nouvelle Maintenance
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                  ID Machine
                </label>
                <input
                  type="number"
                  value={formData.machineId}
                  onChange={(e) => setFormData({...formData, machineId: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#1a1410',
                    color: '#d4a574',
                    border: '1px solid #d4a574',
                    borderRadius: 6,
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#1a1410',
                    color: '#d4a574',
                    border: '1px solid #d4a574',
                    borderRadius: 6,
                  }}
                >
                  <option value="PREVENTIVE">Préventive</option>
                  <option value="CORRECTIVE">Corrective</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#1a1410',
                    color: '#d4a574',
                    border: '1px solid #d4a574',
                    borderRadius: 6,
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                  Date Planifiée
                </label>
                <input
                  type="date"
                  value={formData.datePlanifiee}
                  onChange={(e) => setFormData({...formData, datePlanifiee: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#1a1410',
                    color: '#d4a574',
                    border: '1px solid #d4a574',
                    borderRadius: 6,
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                  Date Réalisée
                </label>
                <input
                  type="date"
                  value={formData.dateRealisee}
                  onChange={(e) => setFormData({...formData, dateRealisee: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#1a1410',
                    color: '#d4a574',
                    border: '1px solid #d4a574',
                    borderRadius: 6,
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                  Statut
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({...formData, statut: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#1a1410',
                    color: '#d4a574',
                    border: '1px solid #d4a574',
                    borderRadius: 6,
                  }}
                >
                  <option value="PLANIFIEE">Planifiée</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="TERMINEE">Terminée</option>
                  <option value="ANNULEE">Annulée</option>
                </select>
              </div>
              <div style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'flex-end',
              }}>
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

export default Maintenance;
