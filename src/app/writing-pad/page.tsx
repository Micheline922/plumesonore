
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/app/user-gate';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


export default function WritingPadPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!title || !content) {
      toast({
        title: 'Champs manquants',
        description: "Veuillez donner un titre et un contenu à votre création.",
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
       toast({
        title: 'Utilisateur non connecté',
        description: 'Vous devez être connecté pour sauvegarder une création.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);

    try {
        await addDoc(collection(db, 'creations'), {
            authorId: user.uid,
            authorName: user.displayName,
            title,
            content,
            type: 'text',
            createdAt: serverTimestamp(),
        });

        toast({
            title: 'Sauvegardé !',
            description: 'Votre création a été ajoutée à votre bibliothèque.',
        });

        setTitle('');
        setContent('');

    } catch(error) {
        console.error("Error saving creation: ", error);
        toast({
            title: 'Erreur',
            description: 'Une erreur est survenue lors de la sauvegarde.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Atelier d'écriture</CardTitle>
          <CardDescription>
            C'est ici que la magie opère. Écrivez sans distraction.
          </CardDescription>
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
              className="min-h-[40vh] text-base"
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
    </main>
  );
}
