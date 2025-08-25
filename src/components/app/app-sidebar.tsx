'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Feather, GraduationCap, LayoutDashboard, Lightbulb, Mic, NotebookPen, Sparkles, Users } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/writing-pad', label: "Atelier d'écriture", icon: NotebookPen },
  { href: '/ai-tools', label: 'Assistant IA', icon: Sparkles },
  { href: '/learning', label: 'Parcours', icon: GraduationCap },
  { href: '/community', label: 'Communauté', icon: Users },
  { href: '/stage', label: 'Scène Virtuelle', icon: Mic },
  { href: '/inspiration', label: 'Inspiration', icon: Lightbulb },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

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
                isActive={pathname === item.href}
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
    </Sidebar>
  );
}
