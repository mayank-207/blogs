import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { LOGIN, REGISTER } from '../graphql/mutations';
import { GET_CURRENT_USER } from '../graphql/queries';
import { apolloClient } from '../lib/apollo';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { refetch } = useQuery(GET_CURRENT_USER, {
    skip: !localStorage.getItem('auth_token'),
    onCompleted: (data) => {
      setUser(data.currentUser);
      setLoading(false);
    },
    onError: () => {
      localStorage.removeItem('auth_token');
      setUser(null);
      setLoading(false);
    },
  });

  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      if (data.login.token) {
        localStorage.setItem('auth_token', data.login.token);
        setUser(data.login.user);
        await apolloClient.resetStore();
        toast.success('Logged in successfully!');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const { data } = await registerMutation({
        variables: { email, password, name },
      });

      if (data.register.token) {
        localStorage.setItem('auth_token', data.register.token);
        setUser(data.register.user);
        await apolloClient.resetStore();
        toast.success('Account created successfully!');
      }
    } catch (error) {
      toast.error('Registration failed. Email may already be in use.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    apolloClient.clearStore();
    toast.success('Logged out successfully!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
