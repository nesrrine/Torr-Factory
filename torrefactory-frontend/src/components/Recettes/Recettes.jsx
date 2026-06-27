import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllRecettes, createRecette, updateRecette, deleteRecette, getLignesByRecette, addLigneRecette, deleteLigneRecette } from '../../services/recetteService';
import Sidebar from '../Common/Navbar';

const Recettes = () => {
  const { user } = useAuth();
  const [recettes, setRecettes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLignesModal, setShowLignesModal] = useState(false);
  const [editingRecette, setEditingRecette] = useState(null);
  const [selectedRecette, setSelectedRecette] = useState(null);
  const [lignes, setLignes] = useState([]);

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    quantiteTotale: '',
    produitId: '',
    actif: true,
  });

  const [ligneFormData, setLigneFormData] = useState({
    lotId: '',
    pourcentage: '',
    quantite: '',
  });

  useEffect(() => {
    fetchRecettes();
  }, []);

  const fetchRecettes = async () => {
    try {
      setLoading(true);
      const data = await getAllRecettes();
      setRecettes(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching recettes:', err);
      setError('Impossible de charger les recettes');
    } finally {
      setLoading(false);
    }
  };

  const fetchLignes = async (recetteId) => {
    try {
      const data = await getLignesByRecette(recetteId);
      setLignes(data);
    } catch (err) {
      console.error('Error fetching lignes:', err);
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

  const isWorker = () => {
    return user?.roles?.some(role => role === 'ROLE_WORKER');
  };

  const handleCreate = () => {
    setEditingRecette(null);
    setFormData({
      nom: '',
      description: '',
      quantiteTotale: '',
      produitId: '',
      actif: true,
    });
    setShowModal(true);
  };

  const handleEdit = (recette) => {
    setEditingRecette(recette);
    setFormData({
      nom: recette.nom,
      description: recette.description,
      quantiteTotale: recette.quantiteTotale,
      produitId: recette.produit?.id || '',
      actif: recette.actif,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) return;
    
    try {
      await deleteRecette(id);
      fetchRecettes();
    } catch (err) {
      console.error('Error deleting recette:', err);
      alert('Erreur lors de la suppression de la recette');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        produit: formData.produitId ? { id: formData.produitId } : null,
      };
      
      if (editingRecette) {
        await updateRecette(editingRecette.id, payload);
      } else {
        await createRecette(payload);
      }
      setShowModal(false);
      fetchRecettes();
    } catch (err) {
      console.error('Error saving recette:', err);
      alert('Erreur lors de la sauvegarde de la recette');
    }
  };

  const handleViewLignes = async (recette) => {
    setSelectedRecette(recette);
    await fetchLignes(recette.id);
    setShowLignesModal(true);
  };

  const handleAddLigne = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...ligneFormData,
        recette: { id: selectedRecette.id },
        lot: { id: ligneFormData.lotId },
      };
      
      await addLigneRecette(selectedRecette.id, payload);
      setLigneFormData({ lotId: '', pourcentage: '', quantite: '' });
      fetchLignes(selectedRecette.id);
    } catch (err) {
      console.error('Error adding ligne:', err);
      alert('Erreur lors de l\'ajout de la ligne');
    }
  };

  const handleDeleteLigne = async (ligneId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) return;
    
    try {
      await deleteLigneRecette(ligneId);
      fetchLignes(selectedRecette.id);
    } catch (err) {
      console.error('Error deleting ligne:', err);
      alert('Erreur lors de la suppression de la ligne');
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
              Recettes
            </h1>
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
                + Nouvelle Recette
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
                  }}>Description</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Quantité Totale</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>Produit</th>
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
                {recettes.map((recette) => (
                  <tr key={recette.id}>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{recette.nom}</td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{recette.description}</td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{recette.quantiteTotale} kg</td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>{recette.produit?.nom || '-'}</td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                    }}>
                      <span style={{
                        background: recette.actif ? '#4CAF50' : '#9e9e9e',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                      }}>
                        {recette.actif ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    {canEdit() && (
                      <td style={{
                        padding: '12px',
                        borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                      }}>
                        <button
                          onClick={() => handleViewLignes(recette)}
                          style={{
                            padding: '6px 12px',
                            background: '#9C27B0',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            fontSize: 12,
                            cursor: 'pointer',
                            marginRight: '8px',
                          }}
                        >
                          Lignes
                        </button>
                        <button
                          onClick={() => handleEdit(recette)}
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
                            onClick={() => handleDelete(recette.id)}
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

            {recettes.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: '#b0b0b0',
                padding: '40px',
              }}>
                Aucune recette trouvée
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
              {editingRecette ? 'Modifier Recette' : 'Nouvelle Recette'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>
                  Nom *
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
                    Quantité Totale (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.quantiteTotale}
                    onChange={(e) => setFormData({...formData, quantiteTotale: e.target.value})}
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
                    ID Produit
                  </label>
                  <input
                    type="number"
                    value={formData.produitId}
                    onChange={(e) => setFormData({...formData, produitId: e.target.value})}
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
              <div style={{ marginBottom: '20px' }}>
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
                  {editingRecette ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLignesModal && (
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
            maxWidth: 800,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <h2 style={{
              color: '#d4a574',
              fontSize: '24px',
              marginBottom: '20px',
            }}>
              Lignes de Recette: {selectedRecette?.nom}
            </h2>
            
            {canEdit() && (
              <form onSubmit={handleAddLigne} style={{ marginBottom: '20px', padding: '15px', background: 'rgba(212, 165, 116, 0.1)', borderRadius: 8 }}>
                <h3 style={{ color: '#d4a574', marginBottom: '15px' }}>Ajouter une ligne</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px', fontSize: 12 }}>
                      ID Lot
                    </label>
                    <input
                      type="number"
                      value={ligneFormData.lotId}
                      onChange={(e) => setLigneFormData({...ligneFormData, lotId: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: '#1a1410',
                        color: '#d4a574',
                        border: '1px solid #d4a574',
                        borderRadius: 4,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px', fontSize: 12 }}>
                      Pourcentage %
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={ligneFormData.pourcentage}
                      onChange={(e) => setLigneFormData({...ligneFormData, pourcentage: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: '#1a1410',
                        color: '#d4a574',
                        border: '1px solid #d4a574',
                        borderRadius: 4,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px', fontSize: 12 }}>
                      Quantité (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={ligneFormData.quantite}
                      onChange={(e) => setLigneFormData({...ligneFormData, quantite: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: '#1a1410',
                        color: '#d4a574',
                        border: '1px solid #d4a574',
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    background: '#d4a574',
                    color: '#1a1410',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Ajouter
                </button>
              </form>
            )}

            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}>
              <thead>
                <tr>
                  <th style={{
                    color: '#d4a574',
                    padding: '10px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 12,
                    fontWeight: 600,
                  }}>ID Lot</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '10px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 12,
                    fontWeight: 600,
                  }}>Pourcentage</th>
                  <th style={{
                    color: '#d4a574',
                    padding: '10px',
                    textAlign: 'left',
                    borderBottom: '1px solid #d4a574',
                    fontSize: 12,
                    fontWeight: 600,
                  }}>Quantité</th>
                  {canDelete() && (
                    <th style={{
                      color: '#d4a574',
                      padding: '10px',
                      textAlign: 'left',
                      borderBottom: '1px solid #d4a574',
                      fontSize: 12,
                      fontWeight: 600,
                    }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {lignes.map((ligne) => (
                  <tr key={ligne.id}>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '10px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                      fontSize: 13,
                    }}>{ligne.lot?.id || '-'}</td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '10px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                      fontSize: 13,
                    }}>{ligne.pourcentage}%</td>
                    <td style={{
                      color: '#b0b0b0',
                      padding: '10px',
                      borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                      fontSize: 13,
                    }}>{ligne.quantite} kg</td>
                    {canDelete() && (
                      <td style={{
                        padding: '10px',
                        borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
                      }}>
                        <button
                          onClick={() => handleDeleteLigne(ligne.id)}
                          style={{
                            padding: '4px 8px',
                            background: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            fontSize: 11,
                            cursor: 'pointer',
                          }}
                        >
                          Supprimer
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {lignes.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: '#b0b0b0',
                padding: '20px',
              }}>
                Aucune ligne trouvée
              </div>
            )}

            <button
              onClick={() => setShowLignesModal(false)}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: 'transparent',
                color: '#d4a574',
                border: '1px solid #d4a574',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recettes;
