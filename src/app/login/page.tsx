
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Feather, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function LoginPage() {
  const [artistName, setArtistName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: `Bienvenue de retour !` });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: artistName });
        toast({ title: 'Compte créé avec succès !', description: 'Bienvenue sur Plume Sonore.' });
      }
      router.push('/');
    } catch (error: any) {
      console.error(error);
      const errorCode = error.code;
      let errorMessage = "Une erreur est survenue.";
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
        errorMessage = 'Email ou mot de passe incorrect.';
      } else if (errorCode === 'auth/email-already-in-use') {
        errorMessage = 'Cette adresse e-mail est déjà utilisée.';
      } else if (errorCode === 'auth/weak-password') {
        errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
      }
       toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
        setIsLoading(false);
    }
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
                  disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin"/> : (isLogin ? "Entrer dans le studio" : "Créer mon compte")}
            </Button>
          </form>
        </CardContent>
        <div className="p-6 pt-0 text-center text-sm">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)} disabled={isLoading}>
                {isLogin ? "Pas de compte ? Créez-en un." : "Déjà un compte ? Connectez-vous."}
            </Button>
        </div>
      </Card>
    </main>
  );
}
