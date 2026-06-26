import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1410 0%, #2a2218 100%)',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 40,
        }}>
          <div>
            <h1 style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#f5f5f5',
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

          <button
            onClick={handleLogout}
            style={{
              padding: '12px 24px',
              background: '#d4a574',
              color: '#1a1410',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#b8935f';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#d4a574';
            }}
          >
            Déconnexion
          </button>
        </div>

        {/* Welcome Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid #3a3228',
          borderRadius: 12,
          padding: 40,
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#d4a574',
            marginBottom: 16,
          }}>
            ☕ Bienvenue sur TorréFactory!
          </h2>

          <p style={{
            fontSize: 16,
            color: '#b0b0b0',
            lineHeight: 1.6,
            marginBottom: 24,
          }}>
            Vous êtes maintenant connecté avec succès. <br />
            Cette page de tableau de bord sera bientôt remplie avec vos outils de gestion de torréfaction.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20,
            marginTop: 40,
          }}>
            <div style={{
              background: 'rgba(212, 165, 116, 0.1)',
              border: '1px solid #d4a574',
              borderRadius: 8,
              padding: 20,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(212, 165, 116, 0.2)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(212, 165, 116, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
              <h3 style={{ margin: '0 0 8px 0', color: '#d4a574' }}>Gestion des lots</h3>
              <p style={{ margin: 0, fontSize: 12, color: '#b0b0b0' }}>Gérez vos lots de café</p>
            </div>

            <div style={{
              background: 'rgba(212, 165, 116, 0.1)',
              border: '1px solid #d4a574',
              borderRadius: 8,
              padding: 20,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(212, 165, 116, 0.2)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(212, 165, 116, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔥</div>
              <h3 style={{ margin: '0 0 8px 0', color: '#d4a574' }}>Profils</h3>
              <p style={{ margin: 0, fontSize: 12, color: '#b0b0b0' }}>Créez vos courbes de chauffe</p>
            </div>

            <div style={{
              background: 'rgba(212, 165, 116, 0.1)',
              border: '1px solid #d4a574',
              borderRadius: 8,
              padding: 20,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(212, 165, 116, 0.2)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(212, 165, 116, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
              <h3 style={{ margin: '0 0 8px 0', color: '#d4a574' }}>Rapports</h3>
              <p style={{ margin: 0, fontSize: 12, color: '#b0b0b0' }}>Analyses et contrôles qualité</p>
            </div>
          </div>

          <p style={{
            marginTop: 40,
            fontSize: 12,
            color: '#666',
          }}>
            Infos utilisateur: {JSON.stringify(user, null, 2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;