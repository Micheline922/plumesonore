'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Mic, FileText, Pencil } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';

interface Creation {
  id: number;
  title: string;
  content?: string; // For text
  audioSrc?: string; // For audio
  type: 'text' | 'audio';
  date: string;
}

interface User {
    artistName: string;
    email: string;
}

export default function MyCreationsPage() {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const getCreationsStorageKey = () => currentUser ? `plume-sonore-creations-${currentUser.email}` : null;

  useEffect(() => {
    const userRaw = localStorage.getItem('plume-sonore-user');
    if (userRaw) {
      setCurrentUser(JSON.parse(userRaw));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      const storageKey = getCreationsStorageKey();
      const storedCreations = storageKey ? localStorage.getItem(storageKey) : null;
      if (storedCreations) {
        const parsedCreations = JSON.parse(storedCreations);
        parsedCreations.sort((a: Creation, b: Creation) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setCreations(parsedCreations);
      } else {
        setCreations([]);
      }
    }
  }, [currentUser]);

  const updateCreations = (newCreations: Creation[]) => {
      setCreations(newCreations);
      const storageKey = getCreationsStorageKey();
      if (storageKey) {
          localStorage.setItem(storageKey, JSON.stringify(newCreations));
      }
  }

  const handleDelete = (id: number) => {
    const updatedCreations = creations.filter((c) => c.id !== id);
    updateCreations(updatedCreations);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Mes Créations</h1>
          <p className="text-muted-foreground mt-1">Votre bibliothèque personnelle de textes et de performances.</p>
        </div>
      </div>
      {creations.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {creations.map((creation) => (
            <Card key={creation.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className='flex-grow'>
                        <CardTitle className="font-headline flex items-center gap-2">
                        {creation.type === 'audio' ? <Mic className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                        {creation.title}
                        </CardTitle>
                        <CardDescription>
                        Sauvegardé le {new Date(creation.date).toLocaleDateString('fr-FR')}
                        </CardDescription>
                    </div>
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive flex-shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Votre création sera supprimée définitivement.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(creation.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                {creation.type === 'text' && creation.content && (
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground line-clamp-4">
                    {creation.content}
                    </p>
                )}
                {creation.type === 'audio' && creation.audioSrc && (
                    <audio controls src={creation.audioSrc} className="w-full">
                        Votre navigateur ne supporte pas l'élément audio.
                    </audio>
                )}
              </CardContent>
              <CardFooter>
                 <Button variant="outline" asChild size="sm">
                   <Link href={creation.type === 'text' ? '/writing-pad' : '/stage'}>
                     <Pencil className="mr-2 h-4 w-4" />
                     Voir / Modifier
                   </Link>
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-16">
          <div className="flex flex-col items-center gap-2 text-center">
            <h3 className="text-2xl font-bold tracking-tight">Aucune création pour le moment</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Commencez à écrire ou enregistrez une performance pour voir vos œuvres apparaître ici.
            </p>
            <div className="flex gap-4 mt-4">
                 <Button asChild>
                    <Link href="/writing-pad">
                        <FileText className="mr-2 h-4 w-4" />
                        Écrire un texte
                    </Link>
                </Button>
                <Button asChild variant="secondary">
                     <Link href="/stage">
                        <Mic className="mr-2 h-4 w-4" />
                        Enregistrer une performance
                    </Link>
                </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
