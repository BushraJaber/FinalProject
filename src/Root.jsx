import React from 'react';
import Navbar from './Components/user/Navbar/Navbar.jsx';
import Footer from './Components/user/Footer/Footer.jsx';
import { Outlet } from 'react-router-dom';

export default function Root() {
  return (
    <>
      <Navbar />
      <div style={{ marginBottom: '40px' }} /> {/* إضافة فراغ تحت الناف بار */}
      <Outlet />
      <div style={{marginBottom: '40px' }} /> {/* إضافة فراغ تحت الناف بار */}
      <Footer />

    </>
  );
}
