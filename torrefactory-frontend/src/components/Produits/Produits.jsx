import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllProduits, createProduit, updateProduit, updateProduitStock, getProduitsStockFaible } from '../../services/produitService';
import Sidebar from '../Common/Navbar';

const Produits = () => {
  const { user } = useAuth();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [editingProduit, setEditingProduit] = useState(null);
  const [stockProduit, setStockProduit] = useState(null);
  const [filterLowStock, setFilterLowStock] = useState(false);

  const [formData, setFormData] = useState({
    reference: '',
    nom: '',
    description: '',
    typeCafe: 'ARABICA',
    niveauTorrefaction: 'MEDIUM',
    prixKg: '',
    stockDisponibleKg: '',
    stockMiniKg: 10,
  });

  const [stockFormData, setStockFormData] = useState({ quantite: '' });

  useEffect(() => {
    fetchProduits();
  }, [filterLowStock]);

  const fetchProduits = async () => {
    try {
      setLoading(true);
      const data = filterLowStock ? await getProduitsStockFaible() : await getAllProduits();
      setProduits(data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les produits');
    } finally {
      setLoading(false);
    }
  };

  const canEdit = () => {
    if (!user?.roles) return false;
    return user.roles.some(role => role === 'ROLE_ADMIN' || role === 'ROLE_PRODUCTION_MANAGER');
  };

  const isClient = () => user?.roles?.some(role => role === 'ROLE_CLIENT');

  const handleCreate = () => {
    setEditingProduit(null);
    setFormData({
      reference: `REF-${Date.now().toString().slice(-6)}`,
      nom: '',
      description: '',
      typeCafe: 'ARABICA',
      niveauTorrefaction: 'MEDIUM',
      prixKg: '',
      stockDisponibleKg: '',
      stockMiniKg: 10,
    });
    setShowModal(true);
  };

  const handleEdit = (produit) => {
    setEditingProduit(produit);
    setFormData({
      reference: produit.reference,
      nom: produit.nom,
      description: produit.description || '',
      typeCafe: produit.typeCafe,
      niveauTorrefaction: produit.niveauTorrefaction || 'MEDIUM',
      prixKg: produit.prixKg,
      stockDisponibleKg: produit.stockDisponibleKg,
      stockMiniKg: produit.stockMiniKg || 10,
    });
    setShowModal(true);
  };

  const handleStockUpdate = (produit) => {
    setStockProduit(produit);
    setStockFormData({ quantite: '' });
    setShowStockModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduit) {
        await updateProduit(editingProduit.id, formData);
      } else {
        await createProduit(formData);
      }
      setShowModal(false);
      fetchProduits();
    } catch (err) {
      alert('Erreur lors de la sauvegarde du produit');
    }
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduitStock(stockProduit.id, stockFormData.quantite);
      setShowStockModal(false);
      fetchProduits();
    } catch (err) {
      alert('Erreur lors de la mise à jour du stock');
    }
  };

  const getStockColor = (stock) => {
    if (stock < 10) return '#f44336';
    if (stock < 50) return '#FF9800';
    return '#4CAF50';
  };

  const inputStyle = {
    width: '100%', padding: '10px', background: '#1a1410',
    color: '#d4a574', border: '1px solid #d4a574', borderRadius: 6, boxSizing: 'border-box',
  };

  const thStyle = {
    color: '#d4a574', padding: '12px', textAlign: 'left',
    borderBottom: '1px solid #d4a574', fontSize: 14, fontWeight: 600,
  };

  const tdStyle = {
    color: '#b0b0b0', padding: '12px',
    borderBottom: '1px solid rgba(212, 165, 116, 0.1)',
  };

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', backgroundColor: '#1a1410', color: '#d4a574', fontSize: 18,
    }}>⏳ Chargement...</div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1410 0%, #2a2218 100%)', display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '40px', overflow: 'auto' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#d4a574', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
              Gestion des Produits
            </h1>
            {canEdit() && !isClient() && (
              <button onClick={handleCreate} style={{
                padding: '12px 24px', background: '#d4a574', color: '#1a1410',
                border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>
                + Nouveau Produit
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
            <label style={{ color: '#d4a574', fontSize: 14 }}>
              <input type="checkbox" checked={filterLowStock}
                onChange={(e) => setFilterLowStock(e.target.checked)}
                style={{ marginRight: '8px' }} />
              Afficher seulement le stock faible
            </label>
          </div>

          {/* Tableau */}
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Référence</th>
                  <th style={thStyle}>Nom</th>
                  <th style={thStyle}>Type Café</th>
                  <th style={thStyle}>Torréfaction</th>
                  <th style={thStyle}>Prix/kg</th>
                  <th style={thStyle}>Stock (kg)</th>
                  <th style={thStyle}>Stock Mini</th>
                  {canEdit() && !isClient() && <th style={thStyle}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {produits.map((produit) => (
                  <tr key={produit.id}>
                    <td style={tdStyle}>{produit.reference}</td>
                    <td style={tdStyle}>{produit.nom}</td>
                    <td style={tdStyle}>{produit.typeCafe}</td>
                    <td style={tdStyle}>{produit.niveauTorrefaction}</td>
                    <td style={tdStyle}>{produit.prixKg} DT/kg</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(212,165,116,0.1)' }}>
                      <span style={{
                        background: getStockColor(produit.stockDisponibleKg),
                        color: 'white', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                      }}>
                        {produit.stockDisponibleKg} kg
                      </span>
                    </td>
                    <td style={tdStyle}>{produit.stockMiniKg} kg</td>
                    {canEdit() && !isClient() && (
                      <td style={{ padding: '12px', borderBottom: '1px solid rgba(212,165,116,0.1)' }}>
                        <button onClick={() => handleEdit(produit)} style={{
                          padding: '6px 12px', background: '#2196F3', color: 'white',
                          border: 'none', borderRadius: 4, fontSize: 12, cursor: 'pointer', marginRight: '8px',
                        }}>Modifier</button>
                        <button onClick={() => handleStockUpdate(produit)} style={{
                          padding: '6px 12px', background: '#4CAF50', color: 'white',
                          border: 'none', borderRadius: 4, fontSize: 12, cursor: 'pointer',
                        }}>Stock</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {produits.length === 0 && (
              <div style={{ textAlign: 'center', color: '#b0b0b0', padding: '40px' }}>Aucun produit trouvé</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Création/Modification */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#2a2218', borderRadius: 12, padding: '30px',
            width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto',
          }}>
            <h2 style={{ color: '#d4a574', fontSize: '24px', marginBottom: '20px' }}>
              {editingProduit ? 'Modifier Produit' : 'Nouveau Produit'}
            </h2>
            <form onSubmit={handleSubmit}>

              {/* Référence */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>Référence</label>
                <input type="text" value={formData.reference} required style={inputStyle}
                  onChange={(e) => setFormData({...formData, reference: e.target.value})}
                  placeholder="ex: REF-001" />
              </div>

              {/* Nom */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>Nom</label>
                <input type="text" value={formData.nom} required style={inputStyle}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  placeholder="ex: Arabica Éthiopie" />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>Description</label>
                <textarea value={formData.description} rows={2} style={inputStyle}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description optionnelle..." />
              </div>

              {/* Type Café */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>Type de Café</label>
                <select value={formData.typeCafe} style={inputStyle}
                  onChange={(e) => setFormData({...formData, typeCafe: e.target.value})}>
                  <option value="ARABICA">Arabica</option>
                  <option value="ROBUSTA">Robusta</option>
                  <option value="MELANGE">Mélange</option>
                </select>
              </div>

              {/* Niveau Torréfaction */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>Niveau de Torréfaction</label>
                <select value={formData.niveauTorrefaction} style={inputStyle}
                  onChange={(e) => setFormData({...formData, niveauTorrefaction: e.target.value})}>
                  <option value="LIGHT">Light (Clair)</option>
                  <option value="MEDIUM">Medium (Moyen)</option>
                  <option value="DARK">Dark (Foncé)</option>
                  <option value="EXTRA_DARK">Extra Dark (Très foncé)</option>
                </select>
              </div>

              {/* Prix/kg */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>Prix (DT/kg)</label>
                <input type="number" step="0.01" min="0" value={formData.prixKg} required style={inputStyle}
                  onChange={(e) => setFormData({...formData, prixKg: e.target.value})}
                  placeholder="ex: 45.00" />
              </div>

              {/* Stock disponible */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>Stock Disponible (kg)</label>
                <input type="number" step="0.1" min="0" value={formData.stockDisponibleKg} required style={inputStyle}
                  onChange={(e) => setFormData({...formData, stockDisponibleKg: e.target.value})}
                  placeholder="ex: 100" />
              </div>

              {/* Stock mini */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>Stock Minimum (kg)</label>
                <input type="number" step="0.1" min="0" value={formData.stockMiniKg} style={inputStyle}
                  onChange={(e) => setFormData({...formData, stockMiniKg: e.target.value})}
                  placeholder="ex: 10" />
              </div>

              <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  padding: '10px 20px', background: 'transparent', color: '#d4a574',
                  border: '1px solid #d4a574', borderRadius: 6, cursor: 'pointer',
                }}>Annuler</button>
                <button type="submit" style={{
                  padding: '10px 20px', background: '#d4a574', color: '#1a1410',
                  border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600,
                }}>{editingProduit ? 'Modifier' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Stock */}
      {showStockModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{ background: '#2a2218', borderRadius: 12, padding: '30px', width: '100%', maxWidth: 400 }}>
            <h2 style={{ color: '#d4a574', fontSize: '24px', marginBottom: '20px' }}>Mettre à jour le stock</h2>
            <p style={{ color: '#b0b0b0', marginBottom: '20px' }}>
              Produit: {stockProduit?.nom} (Stock actuel: {stockProduit?.stockDisponibleKg} kg)
            </p>
            <form onSubmit={handleStockSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>Nouvelle quantité (kg)</label>
                <input type="number" step="0.1" min="0" value={stockFormData.quantite} required style={inputStyle}
                  onChange={(e) => setStockFormData({...stockFormData, quantite: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowStockModal(false)} style={{
                  padding: '10px 20px', background: 'transparent', color: '#d4a574',
                  border: '1px solid #d4a574', borderRadius: 6, cursor: 'pointer',
                }}>Annuler</button>
                <button type="submit" style={{
                  padding: '10px 20px', background: '#d4a574', color: '#1a1410',
                  border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600,
                }}>Mettre à jour</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produits;