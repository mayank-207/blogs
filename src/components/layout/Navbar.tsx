import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, LogOut, Users, FileText, Plus, Home } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinkClass = (path: string) => {
    return `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
      isActive(path)
        ? 'bg-blue-600 text-white'
        : 'text-slate-700 hover:bg-slate-100'
    }`;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">GraphQL Blog</span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <Link to="/" className={navLinkClass('/')}>
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              <Link to="/my-posts" className={navLinkClass('/my-posts')}>
                <FileText className="w-4 h-4" />
                <span>My Posts</span>
              </Link>

              <Link to="/posts/new" className={navLinkClass('/posts/new')}>
                <Plus className="w-4 h-4" />
                <span>New Post</span>
              </Link>

              {user?.role === 'admin' && (
                <Link to="/users" className={navLinkClass('/users')}>
                  <Users className="w-4 h-4" />
                  <span>Users</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
