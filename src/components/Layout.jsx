import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import '../styles/layout.css';

export const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="layout-main">
        <Header />
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};
