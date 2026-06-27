import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊', roles: [] }, // Tous
    { name: 'Lots', path: '/lots', icon: '📦', roles: ['ROLE_ADMIN', 'ROLE_PRODUCTION_MANAGER', 'ROLE_WORKER'] },
    { name: 'Production', path: '/production', icon: '🔥', roles: ['ROLE_ADMIN', 'ROLE_PRODUCTION_MANAGER', 'ROLE_WORKER'] },
    { name: 'Produits', path: '/produits', icon: '☕', roles: ['ROLE_ADMIN', 'ROLE_PRODUCTION_MANAGER', 'ROLE_CLIENT'] },
    { name: 'Commandes', path: '/commandes', icon: '📋', roles: ['ROLE_ADMIN', 'ROLE_PRODUCTION_MANAGER', 'ROLE_CLIENT'] },
    { name: 'Machines', path: '/machines', icon: '⚙️', roles: ['ROLE_ADMIN', 'ROLE_PRODUCTION_MANAGER', 'ROLE_MAINTENANCE'] },
    { name: 'Maintenance', path: '/maintenance', icon: '🔧', roles: ['ROLE_ADMIN', 'ROLE_MAINTENANCE', 'ROLE_PRODUCTION_MANAGER'] },
    { name: 'Profils', path: '/profils-torrefaction', icon: '📈', roles: ['ROLE_ADMIN'] },
    { name: 'Qualité', path: '/controle-qualite', icon: '✅', roles: ['ROLE_ADMIN', 'ROLE_PRODUCTION_MANAGER', 'ROLE_WORKER'] },
    { name: 'Fournisseurs', path: '/fournisseurs', icon: '🏭', roles: ['ROLE_ADMIN', 'ROLE_PRODUCTION_MANAGER'] },
    { name: 'Recettes', path: '/recettes', icon: '📝', roles: ['ROLE_ADMIN', 'ROLE_PRODUCTION_MANAGER', 'ROLE_WORKER'] },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles || item.roles.length === 0) return true;
    return user?.roles?.some(role => item.roles.includes(role));
  });

  return (
    <aside style={{
      width: collapsed ? 80 : 260,
      background: 'rgba(26, 20, 16, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRight: '1px solid #3a3228',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000,
      transition: 'width 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Logo */}
      <div 
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid #3a3228',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
        onClick={() => navigate('/dashboard')}
      >
        <div style={{
          fontSize: 32,
          flexShrink: 0,
        }}>
          ☕
        </div>
        {!collapsed && (
          <div>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#d4a574',
              lineHeight: 1,
            }}>
              TorréFactory
            </div>
            <div style={{
              fontSize: 11,
              color: '#888',
              lineHeight: 1,
            }}>
              Gestion d'usine
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{
        flex: 1,
        padding: '20px 12px',
        overflowY: 'auto',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          {filteredNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: collapsed ? '12px' : '12px 16px',
                background: 'transparent',
                border: 'none',
                borderRadius: 8,
                color: '#b0b0b0',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                textAlign: 'left',
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(212, 165, 116, 0.1)';
                e.target.style.color = '#d4a574';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#b0b0b0';
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* User Info & Logout */}
      <div style={{
        padding: '20px 12px',
        borderTop: '1px solid #3a3228',
      }}>
        {!collapsed && (
          <div style={{
            marginBottom: 12,
            padding: '12px',
            background: 'rgba(212, 165, 116, 0.1)',
            borderRadius: 8,
          }}>
            <div style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#f5f5f5',
              marginBottom: 4,
            }}>
              {user?.username || 'Utilisateur'}
            </div>
            <div style={{
              fontSize: 12,
              color: '#888',
            }}>
              {user?.roles?.[0] || 'Client'}
            </div>
          </div>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(212, 165, 116, 0.1)',
            border: '1px solid #d4a574',
            borderRadius: 8,
            color: '#d4a574',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(212, 165, 116, 0.2)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(212, 165, 116, 0.1)';
          }}
        >
          <span>{collapsed ? '→' : '←'}</span>
          {!collapsed && <span>Réduire</span>}
        </button>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid #ff6b6b',
            borderRadius: 8,
            color: '#ff6b6b',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255, 107, 107, 0.2)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255, 107, 107, 0.1)';
          }}
        >
          <span style={{ fontSize: 16 }}>🚪</span>
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
