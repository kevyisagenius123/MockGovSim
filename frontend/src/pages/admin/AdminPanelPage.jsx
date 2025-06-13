import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import AdminReviewPanel from './AdminReviewPanel';

const AdminPanelPage = () => {
  const location = useLocation();
  const isRootAdmin = location.pathname === '/admin' || location.pathname === '/admin/';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-accent mb-4">Admin Panel</h1>
      <p className="text-text-secondary mb-6">This is the central control panel for administrators.</p>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <nav className="flex flex-col space-y-2">
            <Link to="/admin" className="p-2 rounded-md hover:bg-background-light">Dashboard</Link>
            <Link to="schedule" className="p-2 rounded-md hover:bg-background-light">Election Scheduler</Link>
            <Link to="news" className="p-2 rounded-md hover:bg-background-light">News Injector</Link>
            <Link to="scandal" className="p-2 rounded-md hover:bg-background-light">Scandal Creator</Link>
            <Link to="roles" className="p-2 rounded-md hover:bg-background-light">Role Manager</Link>
            <Link to="data" className="p-2 rounded-md hover:bg-background-light">Data Tools</Link>
          </nav>
        </aside>

        <main className="flex-1">
          {isRootAdmin ? <AdminReviewPanel /> : <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminPanelPage; 