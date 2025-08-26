
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/app/user-gate';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';

function WritingPadEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [creationId, setCreationId] = useState<string | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    const id = searchParams.get('id');
    if (id && user) {
        setIsFetching(true);
        const getCreation = async () => {
            const docRef = doc(db, 'creations', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().authorId === user.uid) {
                const data = docSnap.data();
                setTitle(data.title);
                setContent(data.content);
                setCreationId(id);
            } else {
                toast({ title: "Erreur", description: "Création non trouvée ou accès non autorisé.", variant: "destructive"});
                router.push('/my-creations');
            }
            setIsFetching(false);
        };
        getCreation();
    } else {
        setIsFetching(false);
    }
  }, [searchParams, user, router, toast]);

  const handleSave = async () => {
    if (!title && !content) {
      toast({
        title: 'Contenu vide',
        description: "Veuillez donner un titre ou un contenu à votre création.",
        variant: 'destructive',
      });
      return;
    }
    if (!user) {
       toast({ title: 'Non connecté', description: 'Vous devez être connecté.', variant: 'destructive' });
      return;
    }
    
    setIsLoading(true);

    try {
        if(creationId) {
            // Update existing document
            const docRef = doc(db, 'creations', creationId);
            await updateDoc(docRef, {
                title,
                content,
                updatedAt: serverTimestamp(),
            });
            toast({ title: 'Modifications enregistrées !' });
        } else {
            // Create new document
            const docData = {
                authorId: user.uid,
                authorName: user.displayName,
                title: title || 'Sans titre',
                content,
                type: 'text',
                status: 'draft',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                likes: 0,
                likedBy: [],
                comments: [],
            };
            const docRef = await addDoc(collection(db, 'creations'), docData);
            setCreationId(docRef.id);
            toast({ title: 'Sauvegardé !', description: 'Votre création a été ajoutée à votre bibliothèque.' });
            router.push(`/writing-pad?id=${docRef.id}`, { scroll: false });
        }
    } catch(error) {
        console.error("Error saving creation: ", error);
        toast({ title: 'Erreur', description: 'Une erreur est survenue.', variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };

  if (isFetching) {
      return (
          <div className='flex items-center justify-center p-8'>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      )
  }

  return (
      <Card>
        <CardHeader>
            <div className='flex items-center gap-4'>
                <Button variant="outline" size="icon" onClick={() => router.push('/my-creations')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <CardTitle className="font-headline text-2xl">{creationId ? 'Modifier la création' : "Atelier d'écriture"}</CardTitle>
                    <CardDescription>
                        C'est ici que la magie opère. Écrivez sans distraction.
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input 
              id="title" 
              placeholder="Le titre de votre œuvre..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Votre texte</Label>
            <Textarea
              id="content"
              placeholder="Commencez à écrire ici..."
              className="min-h-[40vh] text-base font-serif"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Sauvegarder
          </Button>
        </CardFooter>
      </Card>
  );
}


export default function WritingPadPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Suspense fallback={<div>Chargement...</div>}>
                <WritingPadEditor />
            </Suspense>
        </main>
    )
}
