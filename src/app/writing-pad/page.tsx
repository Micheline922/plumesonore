
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/app/user-gate';

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
  const [creations, setCreations] = useState<Creation[]>([]);
  const [currentCreationId, setCurrentCreationId] = useState<number | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  
  const getStorageKey = useCallback(() => {
    if (!user) return null;
    return `plume-sonore-creations-${user.email}`;
  }, [user]);

  const handleSave = useCallback(() => {
    if (!title && !content) {
      toast({
        title: 'Contenu vide',
        description: "Veuillez donner un titre ou un contenu à votre création.",
        variant: 'destructive',
      });
      return;
    }
    
    let updatedCreations = [...creations];
    let isNew = false;
    let newId: number | null = null;

    if (currentCreationId) {
      // Update existing creation
      updatedCreations = creations.map(c => 
        c.id === currentCreationId ? { ...c, title, content, date: new Date().toISOString() } : c
      );
    } else {
      // Create new creation
      const newCreation: Creation = {
        id: Date.now(),
        title: title || 'Sans titre',
        content,
        type: 'text',
        date: new Date().toISOString(),
      };
      newId = newCreation.id;
      updatedCreations = [newCreation, ...creations];
      isNew = true;
    }
    
    setCreations(updatedCreations);
    if(isNew && newId) {
        setCurrentCreationId(newId);
    }

    const storageKey = getStorageKey();
    if(storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(updatedCreations));
    }
    
    toast({
      title: 'Sauvegardé !',
      description: 'Votre création a été ajoutée à votre bibliothèque.',
    });
  }, [title, content, creations, currentCreationId, getStorageKey, toast]);


  useEffect(() => {
    const storageKey = getStorageKey();
    if (storageKey) {
        const storedCreations = localStorage.getItem(storageKey);
        const loadedCreations = storedCreations ? JSON.parse(storedCreations) : [];
        setCreations(loadedCreations);
        
        const idParam = searchParams.get('id');
        if (idParam) {
            const creationToEdit = loadedCreations.find((c: Creation) => c.id === parseInt(idParam, 10));
            if (creationToEdit) {
                setTitle(creationToEdit.title);
                setContent(creationToEdit.content);
                setCurrentCreationId(creationToEdit.id);
            }
        }
    } else {
        setCreations([]);
    }
  }, [searchParams, getStorageKey]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            handleSave();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSave]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Atelier d'écriture</CardTitle>
          <CardDescription>
            C'est ici que la magie opère. Écrivez sans distraction. (Raccourci: Ctrl/Cmd + S pour sauvegarder)
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
              className="min-h-[40vh] text-base font-serif"
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
