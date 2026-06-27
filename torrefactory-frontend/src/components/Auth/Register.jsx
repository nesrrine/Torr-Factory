import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 'ROLE_CLIENT',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError('Le nom complet est obligatoire');
      return false;
    }
    if (formData.fullName.trim().length < 3) {
      setError('Le nom complet doit avoir au moins 3 caractères');
      return false;
    }
    if (!formData.username.trim()) {
      setError('Le nom d\'utilisateur est obligatoire');
      return false;
    }
    if (formData.username.trim().length < 3) {
      setError('Le nom d\'utilisateur doit avoir au moins 3 caractères');
      return false;
    }
    if (!formData.email.trim()) {
      setError('L\'email est obligatoire');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('L\'email n\'est pas valide');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password) {
      setError('Le mot de passe est obligatoire');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit avoir au moins 6 caractères');
      return false;
    }
    if (!formData.confirmPassword) {
      setError('Veuillez confirmer votre mot de passe');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setLoading(true);
    try {
      // Convertir ROLE_ADMIN en ADMIN pour le backend
      const roleToSend = formData.role.replace('ROLE_', '');
      await register({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        roles: [roleToSend],
      });
      
      // Rediriger vers login après inscription
      navigate('/login', { 
        state: { message: 'Compte créé avec succès! Veuillez vous connecter.' } 
      });
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Partie gauche - Info */}
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
            <h2>Rejoignez<br /><span className="accent">l'équipe</span></h2>
            <p>Accédez aux outils de pilotage de votre usine de torréfaction et collaborez avec votre équipe.</p>
          </div>

          {/* Features */}
          <div style={{ marginTop: 40 }}>
            <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: 'rgba(212, 165, 116, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                📦
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 600 }}>Gestion des lots</h4>
                <p style={{ margin: 0, fontSize: 14, color: '#b0b0b0' }}>Suivez chaque lot de grains du vert au torréfié</p>
              </div>
            </div>

            <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: 'rgba(212, 165, 116, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                🔥
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 600 }}>Profils de torréfaction</h4>
                <p style={{ margin: 0, fontSize: 14, color: '#b0b0b0' }}>Créez et partagez vos courbes de chauffe</p>
              </div>
            </div>

            <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: 'rgba(212, 165, 116, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                📊
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 600 }}>Rapports qualité</h4>
                <p style={{ margin: 0, fontSize: 14, color: '#b0b0b0' }}>Analyses et contrôles à chaque étape</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: 'rgba(212, 165, 116, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                🚚
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 600 }}>Suivi logistique</h4>
                <p style={{ margin: 0, fontSize: 14, color: '#b0b0b0' }}>Expéditions et inventaires en temps réel</p>
              </div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 12, color: '#b0b0b0', marginTop: 'auto' }}>
          TorréFactory v2.4 - © 2026
        </p>
      </div>

      {/* Partie droite - Formulaire */}
      <div className="auth-right">
        <div className="auth-form">
          <h2 className="form-title">Créer un compte</h2>
          <p className="form-subtitle">Rejoignez la plateforme TorréFactory</p>

          {/* Steps Indicator */}
          <div className="steps-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>1</div>
            <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>2</div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={(e) => {
            if (step === 1) {
              e.preventDefault();
              handleNextStep();
            } else if (step === 2) {
              handleSubmit(e);
            }
          }}>
            {/* STEP 1 - Identité */}
            {step === 1 && (
              <>
                <div className="form-group">
                  <label htmlFor="fullName">Nom complet *</label>
                  <div className="input-with-icon">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="Jean Dupont"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="username">Nom d'utilisateur *</label>
                  <div className="input-with-icon">
                    <span className="input-icon">@</span>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="jean_dupont"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <div className="input-with-icon">
                    <span className="input-icon">📧</span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="jean@usine-cafe.fr"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <button 
                  type="button"
                  className="btn-primary"
                  onClick={handleNextStep}
                  disabled={loading}
                >
                  Continuer →
                </button>
              </>
            )}

            {/* STEP 2 - Mot de passe et téléphone */}
            {step === 2 && (
              <>
                <div className="form-group">
                  <label htmlFor="password">Mot de passe *</label>
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

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmer le mot de passe *</label>
                  <div className="input-with-icon">
                    <span className="input-icon">🔒</span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">Téléphone (optionnel)</label>
                  <div className="input-with-icon">
                    <span className="input-icon">📱</span>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="+33 6 12 34 56 78"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="role">Rôle *</label>
                  <div className="input-with-icon">
                    <span className="input-icon">👔</span>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        background: '#2a2218',
                        border: '1px solid #3a3228',
                        borderRadius: 8,
                        color: '#f5f5f5',
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                    >
                      <option value="ROLE_CLIENT">Client</option>
                      <option value="ROLE_ADMIN">Administrateur</option>
                      <option value="ROLE_PRODUCTION_MANAGER">Responsable Production</option>
                      <option value="ROLE_WORKER">Ouvrier</option>
                      <option value="ROLE_MAINTENANCE">Maintenance</option>
                    </select>
                  </div>
                  <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                    ⚠️ Sélectionnez "Administrateur" ou "Responsable Production" pour accéder au dashboard
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <button 
                    type="button"
                    className="btn-primary"
                    onClick={handlePreviousStep}
                    disabled={loading}
                    style={{ backgroundColor: '#3a3228', color: '#d4a574' }}
                  >
                    ← Retour
                  </button>
                  <button 
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="btn-loading">
                        <span className="spinner"></span>
                        Création...
                      </span>
                    ) : (
                      'Créer compte'
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Sign In Link */}
          <div className="form-links">
            <p>
              Déjà un compte ?{' '}
              <Link to="/login" style={{ color: '#d4a574', textDecoration: 'none' }}>
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;