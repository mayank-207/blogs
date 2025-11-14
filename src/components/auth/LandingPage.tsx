import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, Zap, MessageCircle, Users, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleDemoLogin = async () => {
    try {
      await login('demo@example.com', 'demo123456');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdminDemoLogin = async () => {
    try {
      await login('admin@example.com', 'admin123456');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">GraphQL Blog</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-slate-300 hover:text-white transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Share Your Stories with the World
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            A modern blogging platform built with GraphQL, real-time comments, and collaborative features. Start writing and connecting with your audience today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleDemoLogin}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              <span>Try Demo (User)</span>
            </button>

            <button
              onClick={handleAdminDemoLogin}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition transform hover:scale-105"
            >
              <Users className="w-5 h-5" />
              <span>Try Demo (Admin)</span>
            </button>

            <button
              onClick={() => navigate('/register')}
              className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-500 text-white font-semibold rounded-lg hover:bg-slate-800 transition"
            >
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 max-w-2xl mx-auto mb-12">
            <p className="text-slate-300 text-sm">
              <span className="font-semibold text-blue-400">Demo Credentials:</span>
              <br />
              User: demo@example.com / demo123456
              <br />
              Admin: admin@example.com / admin123456
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500 transition">
            <BookOpen className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Create & Share</h3>
            <p className="text-slate-400">
              Write rich blog posts with a beautiful editor. Share your thoughts with a growing community.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500 transition">
            <MessageCircle className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Real-Time Comments</h3>
            <p className="text-slate-400">
              Engage with readers instantly. See new comments appear in real-time with GraphQL subscriptions.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500 transition">
            <Users className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Manage Community</h3>
            <p className="text-slate-400">
              Admin features to manage users, moderate content, and grow your blogging platform.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Blogging?</h2>
          <p className="text-blue-100 mb-8">
            Create an account or try the demo to explore all features
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition"
            >
              Create Free Account
            </button>
            <button
              onClick={handleDemoLogin}
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            >
              Explore Demo
            </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-400">
          <p>GraphQL Blog Platform. Demo version for showcasing features.</p>
        </div>
      </footer>
    </div>
  );
}
