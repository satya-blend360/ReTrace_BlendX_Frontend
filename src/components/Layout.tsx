import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, LayoutDashboard, LogOut, User, Bot } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import blendLogo from '../../assets/blend-mobile-logo.svg';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group transition-all duration-200 hover:scale-105"
            >
              {/* <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"> */}
              {/* <Briefcase size={22} className="text-white" /> */}
              <img
                alt="Blend Logo"
                src={blendLogo}
                style={{ width: '55px' }}
              />
              {/* </div> */}
              <div className="flex flex-col text-left">
                <span className="text-xl font-bold text-gray-900">ReTrace</span>
                <span className="text-xs text-gray-500">Stockout Events Analytics</span>
              </div>
            </button>

            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive('/')
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </button>
              <button
              onClick={() => navigate('/inventory-assistant')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                isActive('/inventory-assistant')
                  ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Bot size={18} className="shrink-0" />
              <span>Inventory Assistant</span>
            </button>

                {/* <button
                  onClick={() => navigate('/jobs')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive('/jobs') || location.pathname.startsWith('/job/')
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Briefcase size={18} />
                  Jobs
                </button> */}
              </nav>

              <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                {user && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={16} />
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-gray-50 border-t mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 text-sm">
          © 2026 ReTrace All Rights Reserved.
        </div>
      </footer>

    </div>
  );
}
