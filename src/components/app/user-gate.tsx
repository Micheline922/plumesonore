'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useSidebar } from '@/components/ui/sidebar';

export function UserGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);
  const { setOpen } = useSidebar();

  useEffect(() => {
    const userData = localStorage.getItem('plume-sonore-user');
    if (!userData) {
      if (pathname !== '/login') {
        router.replace('/login');
      } else {
        setIsVerified(true);
      }
    } else {
      if (pathname === '/login') {
        router.replace('/');
      } else {
        setIsVerified(true);
      }
    }
  }, [router, pathname]);

  if (!isVerified) {
    // Show a loading state or skeleton screen while checking auth
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

  // Hide sidebar on login page
  const hideSidebar = pathname === '/login';
  useEffect(() => {
    setOpen(!hideSidebar);
  }, [hideSidebar, setOpen])


  return <>{children}</>;
}
