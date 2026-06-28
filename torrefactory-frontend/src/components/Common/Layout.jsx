import React, { useState } from 'react';
import Sidebar from './Navbar';

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1410 0%, #2a2218 100%)',
    }}>
      <Sidebar onCollapse={setCollapsed} />
      <main style={{
        marginLeft: collapsed ? '80px' : '260px',
        transition: 'margin-left 0.3s ease',
        padding: '40px',
        minHeight: '100vh',
      }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;