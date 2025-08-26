
'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useSidebar } from '@/components/ui/sidebar';

interface User {
    artistName: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('plume-sonore-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsVerified(true);
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('plume-sonore-user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('plume-sonore-user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {isVerified ? children : null}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function UserGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { setOpen } = useSidebar();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const isLoginPage = pathname === '/login';
    
    // Always hide sidebar on login page
    setOpen(!isLoginPage);

    if (!user && !isLoginPage) {
      router.replace('/login');
    }
  }, [router, pathname, user, setOpen, isClient]);

  if (!isClient || (!user && pathname !== '/login')) {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-[250px] w-full" />
                <Skeleton className="h-[250px] w-full" />
                <Skeleton className="h-[250px] w-full" />
            </div>
        </main>
    )
  }

  return <>{children}</>;
}
