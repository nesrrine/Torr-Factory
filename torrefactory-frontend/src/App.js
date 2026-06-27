import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Lots from './components/Lots/Lots';
import Production from './components/Production/Production';
import Maintenance from './components/Maintenance/Maintenance';
import Machines from './components/Machines/Machines';
import Produits from './components/Produits/Produits';
import Commandes from './components/Commandes/Commandes';
import ProfilsTorréfaction from './components/ProfilsTorréfaction/ProfilsTorréfaction';
import ControleQualite from './components/ControleQualite/ControleQualite';
import Fournisseurs from './components/Fournisseurs/Fournisseurs';
import Recettes from './components/Recettes/Recettes';
import './styles/global.css';

// Composant pour protéger les routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

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

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/lots"
          element={
            <PrivateRoute>
              <Lots />
            </PrivateRoute>
          }
        />
        <Route
          path="/production"
          element={
            <PrivateRoute>
              <Production />
            </PrivateRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <PrivateRoute>
              <Maintenance />
            </PrivateRoute>
          }
        />
        <Route
          path="/machines"
          element={
            <PrivateRoute>
              <Machines />
            </PrivateRoute>
          }
        />
        <Route
          path="/produits"
          element={
            <PrivateRoute>
              <Produits />
            </PrivateRoute>
          }
        />
        <Route
          path="/commandes"
          element={
            <PrivateRoute>
              <Commandes />
            </PrivateRoute>
          }
        />
        <Route
          path="/profils-torrefaction"
          element={
            <PrivateRoute>
              <ProfilsTorréfaction />
            </PrivateRoute>
          }
        />
        <Route
          path="/controle-qualite"
          element={
            <PrivateRoute>
              <ControleQualite />
            </PrivateRoute>
          }
        />
        <Route
          path="/fournisseurs"
          element={
            <PrivateRoute>
              <Fournisseurs />
            </PrivateRoute>
          }
        />
        <Route
          path="/recettes"
          element={
            <PrivateRoute>
              <Recettes />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;