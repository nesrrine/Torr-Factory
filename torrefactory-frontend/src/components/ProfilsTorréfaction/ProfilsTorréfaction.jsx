import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllProfils, createProfil, updateProfil, deleteProfil } from '../../services/profilService';
import Sidebar from '../Common/Navbar';

const ProfilsTorréfaction = () => {
  const { user } = useAuth();
  const [profils, setProfils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProfil, setEditingProfil] = useState(null);

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    temperatureCharge: '',
    temperatureFin: '',
    dureeTotale: '',
    temperaturePremierCrack: '',
    dureeDeveloppement: '',
    typeCafe: 'ARABICA',
    niveauTorréfaction: 5,
    actif: true,
  });

  useEffect(() => {
    fetchProfils();
  }, []);

  const fetchProfils = async () => {
    try {
      setLoading(true);
      const data = await getAllProfils();
      setProfils(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching profils:', err);
      setError('Impossible de charger les profils');
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

  const canDelete = () => {
    return user?.roles?.some(role => role === 'ROLE_ADMIN');
  };

  const handleCreate = () => {
    setEditingProfil(null);
    setFormData({
      nom: '',
      description: '',
      temperatureCharge: '',
      temperatureFin: '',
      dureeTotale: '',
      temperaturePremierCrack: '',
      dureeDeveloppement: '',
      typeCafe: 'ARABICA',
      niveauTorréfaction: 5,
      actif: true,
    });
    setShowModal(true);
  };

  const handleEdit = (profil) => {
    setEditingProfil(profil);
    setFormData({
      nom: profil.nom,
      description: profil.description,
      temperatureCharge: profil.temperatureCharge,
      temperatureFin: profil.temperatureFin,
      dureeTotale: profil.dureeTotale,
      temperaturePremierCrack: profil.temperaturePremierCrack,
      dureeDeveloppement: profil.dureeDeveloppement,
      typeCafe: profil.typeCafe,
      niveauTorréfaction: profil.niveauTorréfaction,
      actif: profil.actif,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) return;
    
    try {
      await deleteProfil(id);
      fetchProfils();
    } catch (err) {
      console.error('Error deleting profil:', err);
      alert('Erreur lors de la suppression du profil');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProfil) {
        await updateProfil(editingProfil.id, formData);
      } else {
        await createProfil(formData);
      }
      setShowModal(false);
      fetchProfils();
    } catch (err) {
      console.error('Error saving profil:', err);
      alert('Erreur lors de la sauvegarde du profil');
    }
  };

  const getNiveauColor = (niveau) => {
    if (niveau <= 3) return '#4CAF50';
    if (niveau <= 6) return '#FF9800';
    return '#f44336';
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
              Profils de Torréfaction
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
                + Nouveau Profil
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
                  }}>Nom</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Type Café</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Temp. Charge</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Temp. Fin</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Durée</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Niveau</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Actif</th>
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
                {profils.map((profil) => (
                  <tr key={profil.id}>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{profil.nom}</td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{profil.typeCafe}</td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{profil.temperatureCharge}°C</td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{profil.temperatureFin}°C</td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{profil.dureeTotale} min</td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>
                      <span style={{
                        background: getNiveauColor(profil.niveauTorréfaction),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                      }}>
                        {profil.niveauTorréfaction}/10
                      </span>
                    </td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>
                      <span style={{
                        background: profil.actif ? '#4CAF50' : '#9e9e9e',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                      }}>
                        {profil.actif ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    {canEdit() && (
                      <td style={{
                        padding: '12px',
                        borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                      }}>
                        <button
                          onClick={() => handleEdit(profil)}
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
                            onClick={() => handleDelete(profil.id)}
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

            {profils.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: '#b0b0b0',
                padding: '40px',
              }}>
                Aucun profil trouvé
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
              {editingProfil ? 'Modifier Profil' : 'Nouveau Profil'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
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
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                    Temp. Charge (°C)
                  </label>
                  <input
                    type="number"
                    value={formData.temperatureCharge}
                    onChange={(e) => setFormData({...formData, temperatureCharge: e.target.value})}
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
                    Temp. Fin (°C)
                  </label>
                  <input
                    type="number"
                    value={formData.temperatureFin}
                    onChange={(e) => setFormData({...formData, temperatureFin: e.target.value})}
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
                    Durée Totale (min)
                  </label>
                  <input
                    type="number"
                    value={formData.dureeTotale}
                    onChange={(e) => setFormData({...formData, dureeTotale: e.target.value})}
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
                    Temp. 1er Crack (°C)
                  </label>
                  <input
                    type="number"
                    value={formData.temperaturePremierCrack}
                    onChange={(e) => setFormData({...formData, temperaturePremierCrack: e.target.value})}
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
                    Durée Développement (min)
                  </label>
                  <input
                    type="number"
                    value={formData.dureeDeveloppement}
                    onChange={(e) => setFormData({...formData, dureeDeveloppement: e.target.value})}
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
                    Type Café
                  </label>
                  <select
                    value={formData.typeCafe}
                    onChange={(e) => setFormData({...formData, typeCafe: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#1a1410',
                      color: '#d4a574',
                      border: '1px solid #d4a574',
                      borderRadius: 6,
                    }}
                  >
                    <option value="ARABICA">Arabica</option>
                    <option value="ROBUSTA">Robusta</option>
                    <option value="MELANGE">Mélange</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                    Niveau Torréfaction (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.niveauTorréfaction}
                    onChange={(e) => setFormData({...formData, niveauTorréfaction: parseInt(e.target.value)})}
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
                    Actif
                  </label>
                  <select
                    value={formData.actif}
                    onChange={(e) => setFormData({...formData, actif: e.target.value === 'true'})}
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
                  {editingProfil ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilsTorréfaction;
