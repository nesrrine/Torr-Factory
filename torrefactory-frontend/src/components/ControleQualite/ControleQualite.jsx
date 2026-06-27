import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllControles, createControle, updateControle, deleteControle } from '../../services/controleQualiteService';
import Sidebar from '../Common/Navbar';

const ControleQualite = () => {
  const { user } = useAuth();
  const [controles, setControles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingControle, setEditingControle] = useState(null);

  const [formData, setFormData] = useState({
    lotId: '',
    dateControle: new Date().toISOString().split('T')[0],
    humidite: '',
    densite: '',
    pourcentageDefauts: '',
    couleur: 5,
    noteDegustation: '',
    conforme: true,
    observations: '',
  });

  useEffect(() => {
    fetchControles();
  }, []);

  const fetchControles = async () => {
    try {
      setLoading(true);
      const data = await getAllControles();
      setControles(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching controles:', err);
      setError('Impossible de charger les contrôles');
    } finally {
      setLoading(false);
    }
  };

  const canEdit = () => {
    if (!user?.roles) return false;
    return user.roles.some(role => 
      role === 'ROLE_ADMIN' || role === 'ROLE_PRODUCTION_MANAGER' || role === 'ROLE_WORKER'
    );
  };

  const canDelete = () => {
    return user?.roles?.some(role => role === 'ROLE_ADMIN');
  };

  const handleCreate = () => {
    setEditingControle(null);
    setFormData({
      lotId: '',
      dateControle: new Date().toISOString().split('T')[0],
      humidite: '',
      densite: '',
      pourcentageDefauts: '',
      couleur: 5,
      noteDegustation: '',
      conforme: true,
      observations: '',
    });
    setShowModal(true);
  };

  const handleEdit = (controle) => {
    setEditingControle(controle);
    setFormData({
      lotId: controle.lot?.id || '',
      dateControle: controle.dateControle ? controle.dateControle.split('T')[0] : '',
      humidite: controle.humidite,
      densite: controle.densite,
      pourcentageDefauts: controle.pourcentageDefauts,
      couleur: controle.couleur,
      noteDegustation: controle.noteDegustation,
      conforme: controle.conforme,
      observations: controle.observations,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce contrôle ?')) return;
    
    try {
      await deleteControle(id);
      fetchControles();
    } catch (err) {
      console.error('Error deleting controle:', err);
      alert('Erreur lors de la suppression du contrôle');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        lot: { id: formData.lotId },
      };
      
      if (editingControle) {
        await updateControle(editingControle.id, payload);
      } else {
        await createControle(payload);
      }
      setShowModal(false);
      fetchControles();
    } catch (err) {
      console.error('Error saving controle:', err);
      alert('Erreur lors de la sauvegarde du contrôle');
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
              Contrôles Qualité
            </h1>
            {canEdit() && (
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
                + Nouveau Contrôle
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
                  }}>Date</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Lot</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Humidité %</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Densité</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Défauts %</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Couleur</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Conforme</th>
                  {canEdit() && (
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
                {controles.map((controle) => (
                  <tr key={controle.id}>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{controle.dateControle?.split('T')[0]}</td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{controle.lot?.numeroLot || '-'}</td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{controle.humidite}%</td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{controle.densite}</td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{controle.pourcentageDefauts}%</td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{controle.couleur}/10</td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>
                      <span style={{
                        background: controle.conforme ? '#4CAF50' : '#f44336',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                      }}>
                        {controle.conforme ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    {canEdit() && (
                      <td style={{
                        padding: '12px',
                        borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                      }}>
                        <button
                          onClick={() => handleEdit(controle)}
                          style={{
                            padding: '6px 12px',
                            background: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            fontSize: 12,
                            cursor: 'pointer',
                            marginRight: '8px',
                          }}
                        >
                          Modifier
                        </button>
                        {canDelete() && (
                          <button
                            onClick={() => handleDelete(controle.id)}
                            style={{
                              padding: '6px 12px',
                              background: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: 4,
                              fontSize: 12,
                              cursor: 'pointer',
                            }}
                          >
                            Supprimer
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {controles.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: '#b0b0b0',
                padding: '40px',
              }}>
                Aucun contrôle trouvé
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
            maxWidth: 600,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <h2 style={{
              color: '#d4a574',
              fontSize: '24px',
              marginBottom: '20px',
            }}>
              {editingControle ? 'Modifier Contrôle' : 'Nouveau Contrôle'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                  ID Lot
                </label>
                <input
                  type="number"
                  value={formData.lotId}
                  onChange={(e) => setFormData({...formData, lotId: e.target.value})}
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
                  Date Contrôle
                </label>
                <input
                  type="date"
                  value={formData.dateControle}
                  onChange={(e) => setFormData({...formData, dateControle: e.target.value})}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                    Humidité %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.humidite}
                    onChange={(e) => setFormData({...formData, humidite: e.target.value})}
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
                <div>
                  <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                    Densité (g/L)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.densite}
                    onChange={(e) => setFormData({...formData, densite: e.target.value})}
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
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                    Défauts %
                  </label>
                  <input
                    type="number"
                    value={formData.pourcentageDefauts}
                    onChange={(e) => setFormData({...formData, pourcentageDefauts: e.target.value})}
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
                <div>
                  <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                    Couleur (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.couleur}
                    onChange={(e) => setFormData({...formData, couleur: parseInt(e.target.value)})}
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
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                  Notes de Dégustation
                </label>
                <textarea
                  value={formData.noteDegustation}
                  onChange={(e) => setFormData({...formData, noteDegustation: e.target.value})}
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
                  Observations
                </label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({...formData, observations: e.target.value})}
                  rows={2}
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
                  Conforme aux normes
                </label>
                <select
                  value={formData.conforme}
                  onChange={(e) => setFormData({...formData, conforme: e.target.value === 'true'})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#1a1410',
                    color: '#d4a574',
                    border: '1px solid #d4a574',
                    borderRadius: 6,
                  }}
                >
                  <option value="true">Oui</option>
                  <option value="false">Non</option>
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
                  {editingControle ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControleQualite;
