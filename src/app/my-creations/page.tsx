
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Mic, FileText, Pencil, Loader2, Share2, Eye, EyeOff } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { useAuth } from '@/components/app/user-gate';
import { db, storage } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc, orderBy, Timestamp, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Creation {
  id: string;
  title: string;
  content?: string;
  audioSrc?: string;
  type: 'text' | 'audio';
  status: 'draft' | 'published';
  createdAt: Timestamp;
}

export default function MyCreationsPage() {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        setCreations([]);
        return;
    };

    const q = query(
        collection(db, 'creations'), 
        where('authorId', '==', user.uid),
        orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userCreations: Creation[] = [];
      querySnapshot.forEach((doc) => {
        userCreations.push({ id: doc.id, ...doc.data() } as Creation);
      });
      setCreations(userCreations);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching creations: ", error);
        toast({ title: "Erreur", description: "Impossible de charger les créations.", variant: "destructive"});
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, toast]);

  const handleDelete = async (creation: Creation) => {
    setIsProcessing(creation.id);
    try {
        if (creation.type === 'audio' && creation.audioSrc) {
            const audioRef = ref(storage, creation.audioSrc);
            await deleteObject(audioRef);
        }
        await deleteDoc(doc(db, 'creations', creation.id));
        toast({ title: "Supprimé", description: `"${creation.title}" a été supprimé.`});
    } catch(error) {
        console.error("Error deleting creation: ", error);
        toast({ title: "Erreur", description: "La suppression a échoué.", variant: "destructive"});
    } finally {
        setIsProcessing(null);
    }
  };

  const toggleStatus = async (creation: Creation) => {
    setIsProcessing(creation.id);
    const newStatus = creation.status === 'draft' ? 'published' : 'draft';
    try {
      const creationRef = doc(db, 'creations', creation.id);
      await updateDoc(creationRef, { status: newStatus });
      toast({
        title: 'Statut mis à jour',
        description: `"${creation.title}" est maintenant ${newStatus === 'published' ? 'public' : 'un brouillon'}.`,
      });
    } catch (error) {
      console.error("Error updating status: ", error);
      toast({ title: 'Erreur', description: 'La mise à jour du statut a échoué.', variant: 'destructive' });
    } finally {
      setIsProcessing(null);
    }
  };

  const formatDate = (timestamp: Timestamp | null) => {
      if (!timestamp) return 'Date inconnue';
      return timestamp.toDate().toLocaleDateString('fr-FR');
  }

  const renderSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-9 w-24" />
                </CardFooter>
            </Card>
        ))}
    </div>
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Mes Créations</h1>
          <p className="text-muted-foreground mt-1">Votre bibliothèque personnelle. Gérez, publiez et supprimez vos œuvres.</p>
        </div>
         <Button asChild>
            <Link href="/writing-pad">
                <FileText className="mr-2 h-4 w-4" />
                Nouvelle Création
            </Link>
        </Button>
      </div>
      {isLoading ? renderSkeleton() :
        creations.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {creations.map((creation) => (
            <Card key={creation.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className='flex-grow'>
                        <CardTitle className="font-headline flex items-center gap-2 mb-1">
                          {creation.type === 'audio' ? <Mic className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                          {creation.title}
                        </CardTitle>
                        <CardDescription>
                          Créé le {formatDate(creation.createdAt)}
                        </CardDescription>
                    </div>
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive flex-shrink-0" disabled={isProcessing === creation.id}>
                          {isProcessing === creation.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Votre création "{creation.title}" sera supprimée définitivement.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(creation)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Oui, supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                {creation.type === 'text' && creation.content && (
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground line-clamp-3">
                    {creation.content}
                    </p>
                )}
                {creation.type === 'audio' && creation.audioSrc && (
                    <audio controls src={creation.audioSrc} className="w-full">
                        Votre navigateur ne supporte pas l'élément audio.
                    </audio>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                 <Button variant="outline" asChild size="sm">
                   <Link href={creation.type === 'text' ? `/writing-pad?id=${creation.id}` : `/stage?id=${creation.id}`}>
                     <Pencil className="mr-2 h-4 w-4" />
                     Éditer
                   </Link>
                 </Button>
                 <Button variant="ghost" size="sm" onClick={() => toggleStatus(creation)} disabled={isProcessing === creation.id}>
                    {isProcessing === creation.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (creation.status === 'published' ? <EyeOff className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />)}
                    {creation.status === 'published' ? 'Dépublier' : 'Publier'}
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
