'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Creation {
    id: number;
    title: string;
    content: string;
    type: 'text';
    date: string;
}

export default function WritingPadPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    if (!title || !content) {
      toast({
        title: 'Champs manquants',
        description: "Veuillez donner un titre et un contenu à votre création.",
        variant: 'destructive',
      });
      return;
    }

    const newCreation: Creation = {
      id: Date.now(),
      title,
      content,
      type: 'text',
      date: new Date().toISOString(),
    };

    const existingCreationsRaw = localStorage.getItem('plume-sonore-creations');
    const existingCreations: Creation[] = existingCreationsRaw ? JSON.parse(existingCreationsRaw) : [];
    
    localStorage.setItem('plume-sonore-creations', JSON.stringify([newCreation, ...existingCreations]));

    toast({
        title: 'Sauvegardé !',
        description: 'Votre création a été ajoutée à votre bibliothèque.',
    });

    // Optionnel: vider les champs après sauvegarde
    // setTitle('');
    // setContent('');
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
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
