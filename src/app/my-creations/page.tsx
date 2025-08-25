'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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

interface Writing {
  id: number;
  title: string;
  content: string;
  date: string;
}

export default function MyCreationsPage() {
  const [writings, setWritings] = useState<Writing[]>([]);

  useEffect(() => {
    const storedWritings = localStorage.getItem('plume-sonore-writings');
    if (storedWritings) {
      setWritings(JSON.parse(storedWritings));
    }
  }, []);

  const handleDelete = (id: number) => {
    const updatedWritings = writings.filter((w) => w.id !== id);
    setWritings(updatedWritings);
    localStorage.setItem('plume-sonore-writings', JSON.stringify(updatedWritings));
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Mes Créations</h1>
          <p className="text-muted-foreground mt-1">Votre bibliothèque personnelle de textes et d'idées.</p>
        </div>
      </div>
      {writings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {writings.map((writing) => (
            <Card key={writing.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline">{writing.title}</CardTitle>
                <CardDescription>
                  Sauvegardé le {new Date(writing.date).toLocaleDateString('fr-FR')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="whitespace-pre-wrap text-sm text-muted-foreground line-clamp-4">
                  {writing.content}
                </p>
              </CardContent>
              <CardContent className="flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
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
                      <AlertDialogAction onClick={() => handleDelete(writing.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">Aucune création pour le moment</h3>
            <p className="text-sm text-muted-foreground">
              Commencez à écrire dans l'atelier pour voir vos œuvres apparaître ici.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
