import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header/Header';
import Footer from '../common/Footer/Footer';

const SharedLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default SharedLayout;