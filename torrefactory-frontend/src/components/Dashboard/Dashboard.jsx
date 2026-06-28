import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardData } from '../../services/dashboardService';
import Sidebar from '../Common/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard data...');
      console.log('Current user:', user);
      console.log('Token:', localStorage.getItem('token'));
      const data = await getDashboardData();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      console.error('Error details:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError('Impossible de charger les données du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
        ⏳ Chargement des données...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1410 0%, #2a2218 100%)',
        padding: '40px 20px',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <h2 style={{ color: '#ff6b6b', marginBottom: 20 }}>Erreur</h2>
          <p style={{ color: '#b0b0b0', marginBottom: 20 }}>{error}</p>
          <button
            onClick={fetchDashboardData}
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
            Réessayer
          </button>
        </div>
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
        marginLeft: 260,
        padding: '40px 20px',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {/* Header */}
          <div style={{
            marginBottom: 40,
          }}>
            <h1 style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#d4a574',
              margin: 0,
            }}>
              Tableau de bord
            </h1>
            <p style={{
              fontSize: 14,
              color: '#b0b0b0',
              margin: '8px 0 0 0',
            }}>
              Bienvenue, {user?.username}!
            </p>
          </div>

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          marginBottom: 40,
        }}>
          <StatCard
            title="Lots de café"
            value={dashboardData?.statistiques?.nombreLots || 0}
            icon="📦"
            color="#d4a574"
          />
          <StatCard
            title="Productions"
            value={dashboardData?.statistiques?.nombreProductions || 0}
            icon="🔥"
            color="#e07a5f"
          />
          <StatCard
            title="Commandes"
            value={dashboardData?.statistiques?.nombreCommandes || 0}
            icon="📋"
            color="#81b29a"
          />
          <StatCard
            title="Machines"
            value={dashboardData?.statistiques?.nombreMachines || 0}
            icon="⚙️"
            color="#3d405b"
          />
          <StatCard
            title="Stock Total (kg)"
            value={dashboardData?.statistiques?.stockTotalKg?.toFixed(2) || '0.00'}
            icon="⚖️"
            color="#f2cc8f"
          />
          <StatCard
            title="CA du mois (€)"
            value={dashboardData?.statistiques?.chiffreAffaireMois?.toFixed(2) || '0.00'}
            icon="💰"
            color="#4ecdc4"
          />
          <StatCard
            title="Commandes en cours"
            value={dashboardData?.statistiques?.nombreCommandesEnCours || 0}
            icon="⏳"
            color="#ff6b6b"
          />
          <StatCard
            title="Machines en panne"
            value={dashboardData?.statistiques?.machinesEnPanne || 0}
            icon="🔧"
            color="#ffe66d"
          />
        </div>

        {/* Monthly Production Chart */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid #3a3228',
          borderRadius: 12,
          padding: 24,
          marginBottom: 40,
        }}>
          <h3 style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#d4a574',
            marginBottom: 20,
          }}>
            📈 Production mensuelle (6 derniers mois)
          </h3>
          <div style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
          }}>
            {dashboardData?.productionMensuelle?.map((prod, index) => (
              <div key={index} style={{
                background: 'rgba(212, 165, 116, 0.1)',
                border: '1px solid #d4a574',
                borderRadius: 8,
                padding: 16,
                minWidth: 150,
                flex: 1,
              }}>
                <div style={{ fontSize: 12, color: '#b0b0b0', marginBottom: 8 }}>
                  {formatMonth(prod.mois)}
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#d4a574' }}>
                  {prod.quantiteKg?.toFixed(1)} kg
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                  {prod.nombreProductions} productions
                </div>
              </div>
            ))}
            {(!dashboardData?.productionMensuelle || dashboardData.productionMensuelle.length === 0) && (
              <p style={{ color: '#888' }}>Aucune donnée de production disponible</p>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid #3a3228',
          borderRadius: 12,
          padding: 24,
          marginBottom: 40,
        }}>
          <h3 style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#ff6b6b',
            marginBottom: 20,
          }}>
            ⚠️ Stocks faibles
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {dashboardData?.stocksFaibles?.map((stock, index) => (
              <div key={index} style={{
                background: 'rgba(255, 107, 107, 0.1)',
                border: '1px solid #ff6b6b',
                borderRadius: 8,
                padding: 16,
              }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#f5f5f5', marginBottom: 8 }}>
                  {stock.produitNom}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: '#b0b0b0' }}>Stock actuel:</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#ff6b6b' }}>
                    {stock.stockActuel?.toFixed(2)} kg
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: '#b0b0b0' }}>Stock minimum:</span>
                  <span style={{ fontSize: 14, color: '#b0b0b0' }}>
                    {stock.stockMini?.toFixed(2)} kg
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: 6,
                  background: 'rgba(255, 107, 107, 0.2)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${Math.min(stock.pourcentage || 0, 100)}%`,
                    height: '100%',
                    background: '#ff6b6b',
                    borderRadius: 3,
                  }} />
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                  {stock.pourcentage?.toFixed(1)}% du stock minimum
                </div>
              </div>
            ))}
            {(!dashboardData?.stocksFaibles || dashboardData.stocksFaibles.length === 0) && (
              <p style={{ color: '#81b29a' }}>✓ Tous les stocks sont à niveau</p>
            )}
          </div>
        </div>

        {/* Machine Status */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid #3a3228',
          borderRadius: 12,
          padding: 24,
          marginBottom: 40,
        }}>
          <h3 style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#d4a574',
            marginBottom: 20,
          }}>
            ⚙️ Statut des machines
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {dashboardData?.statutsMachines?.map((machine, index) => (
              <div key={index} style={{
                background: getMachineStatusBackground(machine.statut),
                border: `1px solid ${getMachineStatusColor(machine.statut)}`,
                borderRadius: 8,
                padding: 16,
              }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#f5f5f5', marginBottom: 8 }}>
                  {machine.machineNom}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: getMachineStatusColor(machine.statut),
                  }}>
                    {machine.statut}
                  </span>
                  {machine.joursDepuisMaintenance !== null && (
                    <span style={{ fontSize: 12, color: '#b0b0b0' }}>
                      {machine.joursDepuisMaintenance}j depuis maintenance
                    </span>
                  )}
                </div>
              </div>
            ))}
            {(!dashboardData?.statutsMachines || dashboardData.statutsMachines.length === 0) && (
              <p style={{ color: '#888' }}>Aucune machine disponible</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid #3a3228',
          borderRadius: 12,
          padding: 24,
        }}>
          <h3 style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#d4a574',
            marginBottom: 20,
          }}>
            📋 Commandes récentes
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #3a3228' }}>
                  <th style={{ padding: 12, textAlign: 'left', color: '#d4a574', fontSize: 14 }}>
                    N° Commande
                  </th>
                  <th style={{ padding: 12, textAlign: 'left', color: '#d4a574', fontSize: 14 }}>
                    Client
                  </th>
                  <th style={{ padding: 12, textAlign: 'left', color: '#d4a574', fontSize: 14 }}>
                    Statut
                  </th>
                  <th style={{ padding: 12, textAlign: 'right', color: '#d4a574', fontSize: 14 }}>
                    Montant
                  </th>
                  <th style={{ padding: 12, textAlign: 'left', color: '#d4a574', fontSize: 14 }}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.commandesRecentes?.map((commande, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: 12, color: '#f5f5f5', fontSize: 14 }}>
                      {commande.numeroCommande}
                    </td>
                    <td style={{ padding: 12, color: '#b0b0b0', fontSize: 14 }}>
                      {commande.clientNom}
                    </td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600,
                        background: getOrderStatusBackground(commande.statut),
                        color: getOrderStatusColor(commande.statut),
                      }}>
                        {commande.statut}
                      </span>
                    </td>
                    <td style={{ padding: 12, textAlign: 'right', color: '#d4a574', fontSize: 14, fontWeight: 600 }}>
                      {commande.montant?.toFixed(2)} €
                    </td>
                    <td style={{ padding: 12, color: '#b0b0b0', fontSize: 14 }}>
                      {formatDate(commande.dateCommande)}
                    </td>
                  </tr>
                ))}
                {(!dashboardData?.commandesRecentes || dashboardData.commandesRecentes.length === 0) && (
                  <tr>
                    <td colSpan="5" style={{ padding: 24, textAlign: 'center', color: '#888' }}>
                      Aucune commande récente
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components and Functions
const StatCard = ({ title, value, icon, color }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid #3a3228',
    borderRadius: 12,
    padding: 20,
    transition: 'all 0.3s ease',
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.borderColor = color;
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.borderColor = '#3a3228';
  }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
      <div style={{ fontSize: 32, marginRight: 12 }}>{icon}</div>
      <div style={{ fontSize: 14, color: '#b0b0b0' }}>{title}</div>
    </div>
    <div style={{
      fontSize: 28,
      fontWeight: 700,
      color: color,
    }}>
      {value}
    </div>
  </div>
);

const formatMonth = (monthStr) => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(month) - 1]} ${year}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getMachineStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'OPERATIONNEL':
      return '#81b29a';
    case 'HORS_SERVICE':
      return '#ff6b6b';
    case 'MAINTENANCE':
      return '#ffe66d';
    default:
      return '#b0b0b0';
  }
};

const getMachineStatusBackground = (status) => {
  switch (status?.toUpperCase()) {
    case 'OPERATIONNEL':
      return 'rgba(129, 178, 154, 0.1)';
    case 'HORS_SERVICE':
      return 'rgba(255, 107, 107, 0.1)';
    case 'MAINTENANCE':
      return 'rgba(255, 230, 109, 0.1)';
    default:
      return 'rgba(176, 176, 176, 0.1)';
  }
};

const getOrderStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'CONFIRMEE':
      return '#4ecdc4';
    case 'EN_PREPARATION':
      return '#ffe66d';
    case 'PRETE':
      return '#81b29a';
    case 'LIVREE':
      return '#a8dadc';
    case 'ANNULEE':
      return '#ff6b6b';
    default:
      return '#b0b0b0';
  }
};

const getOrderStatusBackground = (status) => {
  switch (status?.toUpperCase()) {
    case 'CONFIRMEE':
      return 'rgba(78, 205, 196, 0.1)';
    case 'EN_PREPARATION':
      return 'rgba(255, 230, 109, 0.1)';
    case 'PRETE':
      return 'rgba(129, 178, 154, 0.1)';
    case 'LIVREE':
      return 'rgba(168, 218, 220, 0.1)';
    case 'ANNULEE':
      return 'rgba(255, 107, 107, 0.1)';
    default:
      return 'rgba(176, 176, 176, 0.1)';
  }
};

export default Dashboard;