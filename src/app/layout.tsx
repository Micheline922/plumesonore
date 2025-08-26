
import type { Metadata } from 'next';
import { AppSidebar } from '@/components/app/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { UserGate, AuthProvider } from '@/components/app/user-gate';
import { AppHeader } from '@/components/app/app-header';
import './globals.css';
import { Textarea } from '@/components/ui/textarea';

export const metadata: Metadata = {
  title: 'Plume Sonore',
  description: "Le studio d'écriture mobile tout-en-un qui transforme l'inspiration en performance, pour tous les poètes, slameurs et rappeurs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
            <SidebarProvider>
            <UserGate>
                <AppSidebar />
                <div className="flex flex-1 flex-col">
                    <AppHeader />
                    <SidebarInset>{children}</SidebarInset>
                </div>
            </UserGate>
            </SidebarProvider>
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
