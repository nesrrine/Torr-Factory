import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllCommandes, createCommande, updateCommandeStatus, getCommandesByClient } from '../../services/commandeService';
import { getAllProduits } from '../../services/produitService';
import Layout from '../Common/Layout';

const Commandes = () => {
  const { user } = useAuth();
  const [commandes, setCommandes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatut, setFilterStatut] = useState('');

  const [formData, setFormData] = useState({
    clientId: '',
    dateLivraisonPrevue: '',
    adresseLivraison: '',
    lignes: [{ produitId: '', quantiteKg: '' }],
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [commandesData, produitsData] = await Promise.all([
        user?.roles?.includes('ROLE_CLIENT')
          ? getCommandesByClient(user.id)
          : getAllCommandes(),
        getAllProduits(),
      ]);
      setCommandes(commandesData);
      setProduits(produitsData);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const canCreate = () => {
    if (!user?.roles) return false;
    return user.roles.some(role => role === 'ROLE_ADMIN' || role === 'ROLE_CLIENT');
  };

  const canUpdateStatus = () => {
    if (!user?.roles) return false;
    return user.roles.some(role => role === 'ROLE_ADMIN' || role === 'ROLE_PRODUCTION_MANAGER');
  };

  const handleCreate = () => {
    setFormData({
      clientId: user?.roles?.includes('ROLE_CLIENT') ? user.id : '',
      dateLivraisonPrevue: '',
      adresseLivraison: '',
      lignes: [{ produitId: produits[0]?.id || '', quantiteKg: '' }],
    });
    setShowModal(true);
  };

  const addLigne = () => {
    setFormData({
      ...formData,
      lignes: [...formData.lignes, { produitId: produits[0]?.id || '', quantiteKg: '' }],
    });
  };

  const removeLigne = (index) => {
    if (formData.lignes.length === 1) return;
    setFormData({
      ...formData,
      lignes: formData.lignes.filter((_, i) => i !== index),
    });
  };

  const updateLigne = (index, field, value) => {
    const newLignes = [...formData.lignes];
    newLignes[index] = { ...newLignes[index], [field]: value };
    setFormData({ ...formData, lignes: newLignes });
  };

  const calculerTotal = () => {
    return formData.lignes.reduce((total, ligne) => {
      const produit = produits.find(p => p.id === Number(ligne.produitId));
      if (produit && ligne.quantiteKg) {
        return total + (produit.prixKg * Number(ligne.quantiteKg));
      }
      return total;
    }, 0).toFixed(2);
  };

  const handleStatusChange = async (id, newStatut) => {
    try {
      await updateCommandeStatus(id, newStatut);
      fetchAll();
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCommande(formData);
      setShowModal(false);
      fetchAll();
    } catch (err) {
      alert('Erreur lors de la création de la commande');
    }
  };

  const filteredCommandes = filterStatut
    ? commandes.filter(c => c.statut === filterStatut)
    : commandes;

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'EN_ATTENTE': return '#FF9800';
      case 'CONFIRMEE': return '#2196F3';
      case 'EN_PREPARATION': return '#9C27B0';
      case 'PRETE': return '#4CAF50';
      case 'LIVREE': return '#00BCD4';
      case 'ANNULEE': return '#f44336';
      default: return '#9e9e9e';
    }
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
    <Layout>  {/* ✅ remplace le div wrapper + Sidebar */}
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#d4a574', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
            Gestion des Commandes
          </h1>
          {canCreate() && (
            <button onClick={handleCreate} style={{
              padding: '12px 24px', background: '#d4a574', color: '#1a1410',
              border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>
              + Nouvelle Commande
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
            <label style={{ color: '#d4a574', fontSize: 14 }}>Filtrer par statut:</label>
            <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}
              style={{ padding: '8px 12px', background: '#2a2218', color: '#d4a574', border: '1px solid #d4a574', borderRadius: 6, fontSize: 14 }}>
              <option value="">Tous</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="CONFIRMEE">Confirmée</option>
              <option value="EN_PREPARATION">En préparation</option>
              <option value="PRETE">Prête</option>
              <option value="LIVREE">Livrée</option>
              <option value="ANNULEE">Annulée</option>
            </select>
          </div>
        </div>

        {/* Tableau */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Client</th>
                <th style={thStyle}>Date Commande</th>
                <th style={thStyle}>Date Livraison</th>
                <th style={thStyle}>Montant Total</th>
                <th style={thStyle}>Adresse</th>
                <th style={thStyle}>Statut</th>
                {canUpdateStatus() && <th style={thStyle}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredCommandes.map((commande) => (
                <tr key={commande.id}>
                  <td style={tdStyle}>{commande.id}</td>
                  <td style={tdStyle}>{commande.clientNom || commande.clientId}</td>
                  <td style={tdStyle}>{commande.dateCommande}</td>
                  <td style={tdStyle}>{commande.dateLivraisonPrevue || '-'}</td>
                  <td style={tdStyle}>{commande.montantTotal} DT</td>
                  <td style={tdStyle}>{commande.adresseLivraison || '-'}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid rgba(212,165,116,0.1)' }}>
                    <span style={{
                      background: getStatutColor(commande.statut), color: 'white',
                      padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                    }}>
                      {commande.statut}
                    </span>
                  </td>
                  {canUpdateStatus() && (
                    <td style={{ padding: '12px', borderBottom: '1px solid rgba(212,165,116,0.1)' }}>
                      <select value={commande.statut}
                        onChange={(e) => handleStatusChange(commande.id, e.target.value)}
                        style={{ padding: '6px 10px', background: '#2a2218', color: '#d4a574', border: '1px solid #d4a574', borderRadius: 4, fontSize: 12 }}>
                        <option value="EN_ATTENTE">En attente</option>
                        <option value="CONFIRMEE">Confirmée</option>
                        <option value="EN_PREPARATION">En préparation</option>
                        <option value="PRETE">Prête</option>
                        <option value="LIVREE">Livrée</option>
                        <option value="ANNULEE">Annulée</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCommandes.length === 0 && (
            <div style={{ textAlign: 'center', color: '#b0b0b0', padding: '40px' }}>
              Aucune commande trouvée
            </div>
          )}
        </div>
      </div>

      {/* Modal — reste dans Layout */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: '#2a2218', borderRadius: 12, padding: '30px',
            width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto',
          }}>
            <h2 style={{ color: '#d4a574', fontSize: '24px', marginBottom: '20px' }}>Nouvelle Commande</h2>
            <form onSubmit={handleSubmit}>

              {!user?.roles?.includes('ROLE_CLIENT') && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>ID Client</label>
                  <input type="number" value={formData.clientId} required style={inputStyle}
                    onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                    placeholder="ID du client" />
                </div>
              )}

              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>Date Livraison Prévue</label>
                <input type="date" value={formData.dateLivraisonPrevue} required style={inputStyle}
                  onChange={(e) => setFormData({...formData, dateLivraisonPrevue: e.target.value})}
                  min={new Date().toISOString().split('T')[0]} />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#d4a574', display: 'block', marginBottom: '5px' }}>Adresse de Livraison</label>
                <input type="text" value={formData.adresseLivraison} required style={inputStyle}
                  onChange={(e) => setFormData({...formData, adresseLivraison: e.target.value})}
                  placeholder="ex: 12 Rue de Tunis, Sfax" />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ color: '#d4a574', fontWeight: 600 }}>Produits commandés</label>
                  <button type="button" onClick={addLigne} style={{
                    padding: '6px 14px', background: '#4CAF50', color: 'white',
                    border: 'none', borderRadius: 4, fontSize: 12, cursor: 'pointer',
                  }}>+ Ajouter produit</button>
                </div>

                {formData.lignes.map((ligne, index) => (
                  <div key={index} style={{
                    display: 'flex', gap: '10px', alignItems: 'center',
                    marginBottom: '10px', background: 'rgba(255,255,255,0.03)',
                    padding: '10px', borderRadius: 8,
                  }}>
                    <select value={ligne.produitId}
                      onChange={(e) => updateLigne(index, 'produitId', e.target.value)}
                      style={{ ...inputStyle, flex: 2 }} required>
                      <option value="">-- Produit --</option>
                      {produits.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nom} — {p.prixKg} DT/kg
                        </option>
                      ))}
                    </select>

                    <input type="number" min="0.1" step="0.1"
                      value={ligne.quantiteKg} required
                      onChange={(e) => updateLigne(index, 'quantiteKg', e.target.value)}
                      placeholder="kg"
                      style={{ ...inputStyle, flex: 1 }} />

                    {formData.lignes.length > 1 && (
                      <button type="button" onClick={() => removeLigne(index)} style={{
                        padding: '8px 12px', background: '#f44336', color: 'white',
                        border: 'none', borderRadius: 4, fontSize: 12, cursor: 'pointer', flexShrink: 0,
                      }}>✕</button>
                    )}
                  </div>
                ))}

                <div style={{
                  background: 'rgba(212, 165, 116, 0.1)', borderRadius: 8,
                  padding: '12px', marginTop: '10px',
                  display: 'flex', justifyContent: 'space-between',
                }}>
                  <span style={{ color: '#d4a574', fontWeight: 600 }}>Total estimé :</span>
                  <span style={{ color: '#d4a574', fontWeight: 700, fontSize: 16 }}>
                    {calculerTotal()} DT
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  padding: '10px 20px', background: 'transparent', color: '#d4a574',
                  border: '1px solid #d4a574', borderRadius: 6, cursor: 'pointer',
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

export default Commandes;