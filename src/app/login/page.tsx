'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Feather } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [artistName, setArtistName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistName || !email) {
      toast({
        title: 'Champs requis',
        description: "Veuillez entrer votre nom d'artiste et votre e-mail.",
        variant: 'destructive',
      });
      return;
    }
    // A basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        toast({
            title: 'Email invalide',
            description: "Veuillez entrer une adresse e-mail valide.",
            variant: 'destructive',
        });
        return;
    }
    
    const userData = { artistName, email };
    localStorage.setItem('plume-sonore-user', JSON.stringify(userData));
    router.push('/');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <Feather className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-headline font-semibold">Plume Sonore</h1>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Accès Artiste</CardTitle>
          <CardDescription>Entrez vos informations pour commencer.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="artistName">Nom d'artiste</Label>
              <Input
                id="artistName"
                type="text"
                placeholder="Votre nom de scène"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Entrer dans le studio
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
