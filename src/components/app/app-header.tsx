
'use client';

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Feather } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  if (pathname === '/login' || !isMobile) {
    return null;
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <SidebarTrigger className="md:hidden" />
       <div className='flex items-center gap-2'>
         <Feather className="h-6 w-6 text-primary" />
         <h1 className="text-lg font-headline font-semibold">Plume Sonore</h1>
       </div>
    </header>
  );
}
