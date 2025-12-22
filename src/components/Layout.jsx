import React from 'react';
import { Sidebar } from './Sidebar';
import '../styles/layout.css';

export const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
};
