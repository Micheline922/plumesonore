
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Feather } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/app/user-gate';

export default function LoginPage() {
  const [artistName, setArtistName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !artistName)) {
      toast({
        title: 'Champs requis',
        description: "Veuillez remplir tous les champs.",
        variant: 'destructive',
      });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        toast({
            title: 'Email invalide',
            description: "Veuillez entrer une adresse e-mail valide.",
            variant: 'destructive',
        });
        return;
    }

    login({ artistName, email });
    toast({
      title: isLogin ? `Bienvenue de retour, ${email} !` : 'Compte créé avec succès !',
      description: isLogin ? 'Vous êtes maintenant connecté.' : 'Bienvenue sur Plume Sonore.',
    });
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
          <CardTitle className="font-headline text-2xl">{isLogin ? "Accès Artiste" : "Créer un Compte"}</CardTitle>
          <CardDescription>
            {isLogin ? "Entrez vos informations pour commencer." : "Rejoignez la communauté Plume Sonore."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="artistName">Nom d'artiste</Label>
                <Input
                  id="artistName"
                  type="text"
                  placeholder="Votre nom de scène"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
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
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {isLogin ? "Entrer dans le studio" : "Créer mon compte"}
            </Button>
          </form>
        </CardContent>
        <div className="p-6 pt-0 text-center text-sm">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Pas de compte ? Créez-en un." : "Déjà un compte ? Connectez-vous."}
            </Button>
        </div>
      </Card>
    </main>
  );
}
