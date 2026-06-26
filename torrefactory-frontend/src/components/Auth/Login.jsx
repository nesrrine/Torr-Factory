import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await login(formData.username, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Partie gauche - Branding et Info */}
      <div className="auth-left">
        <div>
          <div className="logo-section">
            <div className="logo-icon">☕</div>
            <div className="logo-text">
              <h1>TorréFactory</h1>
              <p>Gestion d'usine</p>
            </div>
          </div>

          <div className="auth-title">
            <h2>Maîtrisez l'art<br /><span className="accent">de la torréfaction</span></h2>
            <p>Pilotez chaque étape de votre production — des lots de grains verts jusqu'à la distribution — depuis une seule interface.</p>
          </div>

          <div className="stats-section">
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Traçabilité</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Monitoring</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Recettes</div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="testimonial">
          <div className="testimonial-text">
            "Depuis TorréFactory, nos temps de torréfaction sont optimisés de 30%. Un outil indispensable."
          </div>
          <div className="testimonial-author">
            <div className="testimonial-avatar">M</div>
            <div className="testimonial-info">
              <h4>Marie Fontaine</h4>
              <p>Directrice de production, Café Lumière</p>
            </div>
          </div>
        </div>
      </div>

      {/* Partie droite - Formulaire */}
      <div className="auth-right">
        <div className="auth-form">
          <h2 className="form-title">Bon retour</h2>
          <p className="form-subtitle">Connectez-vous à votre espace de gestion</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Nom d'utilisateur */}
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur</label>
              <div className="input-with-icon">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="votre_identifiant"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="password">Mot de passe</label>
                <button
                  type="button"
                  onClick={() => alert('Fonctionnalité "Mot de passe oublié" à venir')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#d4a574',
                    cursor: 'pointer',
                    fontSize: 12,
                    textDecoration: 'underline',
                  }}
                >
                  Oublié ?
                </button>
              </div>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Bouton Connexion */}
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Connexion...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>OU</span>
          </div>

          {/* Sign Up Link */}
          <div className="form-links">
            <p>
              Nouveau sur la plateforme ?{' '}
              <Link to="/register" style={{ color: '#d4a574', textDecoration: 'none' }}>
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;