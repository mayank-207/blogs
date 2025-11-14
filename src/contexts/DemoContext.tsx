import { createContext, useContext, ReactNode } from 'react';

interface DemoContextType {
  isDemoMode: boolean;
  demoUser: 'user' | 'admin' | null;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  const demoUser = (localStorage.getItem('demo_user') as 'user' | 'admin' | null) || null;

  return (
    <DemoContext.Provider value={{ isDemoMode, demoUser }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}

export function setDemoMode(mode: boolean, user: 'user' | 'admin' | null = null) {
  if (mode) {
    localStorage.setItem('demo_mode', 'true');
    if (user) localStorage.setItem('demo_user', user);
  } else {
    localStorage.removeItem('demo_mode');
    localStorage.removeItem('demo_user');
  }
}
