// src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-4 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
