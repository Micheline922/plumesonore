'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Feather, GraduationCap, LayoutDashboard, Lightbulb, Mic, NotebookPen, Sparkles, Users, LogOut, Library, Edit } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const menuItems = [
  { href: '/', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/writing-pad', label: "Atelier d'écriture", icon: NotebookPen },
  { href: '/my-creations', label: 'Mes Créations', icon: Library },
  { href: '/ai-tools', label: 'Assistant IA', icon: Sparkles },
  { href: '/learning', label: 'Parcours', icon: GraduationCap },
  { href: '/community', label: 'Communauté', icon: Users },
  { href: '/stage', label: 'Scène Virtuelle', icon: Mic },
  { href: '/inspiration', label: 'Inspiration', icon: Lightbulb },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('plume-sonore-user');
    router.push('/login');
  };

  // Do not render sidebar on the login page
  if (pathname === '/login') {
    return null;
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Feather className="h-6 w-6" />
          </div>
          <h1
            className={cn(
              'text-xl font-headline font-semibold transition-opacity duration-200',
              state === 'collapsed' && 'opacity-0'
            )}
          >
            Plume Sonore
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href) && (item.href === '/' ? pathname === '/' : true) }
                tooltip={{ children: item.label, side: 'right', align: 'center' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
           <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip={{ children: 'Se déconnecter', side: 'right', align: 'center' }}
              >
                <LogOut />
                <span>Se déconnecter</span>
              </SidebarMenuButton>
           </SidebarMenuItem>
         </SidebarMenu>
         <div className={cn("flex items-center justify-center gap-2 p-4 text-xs text-sidebar-foreground/60", state === 'collapsed' && 'hidden')}>
            <Edit className="h-4 w-4" />
            <span>Conçu par Micheline Ntale</span>
         </div>
      </SidebarFooter>
    </Sidebar>
  );
}
