import type { ReactNode } from 'react';

interface DashboardNavProps {
  title: string;
  icon: ReactNode;
  onLogout: () => void;
  userDisplayName?: string;
}

const DashboardNav = ({ title, icon, onLogout, userDisplayName }: DashboardNavProps) => {
  return (
    <header className="bg-glass-white backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {icon}
            <h1 className="text-2xl font-bold text-white">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <span>{userDisplayName || 'User'}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNav;