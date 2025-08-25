'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateRhymes, type GenerateRhymesOutput } from '@/ai/flows/generate-rhymes';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Language = 'french' | 'english';

export function RhymeGenerator() {
  const [word, setWord] = useState('');
  const [language, setLanguage] = useState<Language>('french');
  const [result, setResult] = useState<GenerateRhymesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word) {
      toast({
        title: 'Champ requis',
        description: 'Veuillez entrer un mot ou une phrase.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const rhymes = await generateRhymes({ wordOrPhrase: word, language });
      setResult(rhymes);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la génération des rimes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="font-headline">Générateur de rimes</CardTitle>
          <CardDescription>
            Trouvez la rime parfaite pour votre prochain vers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3 space-y-2">
              <Label htmlFor="word">Mot ou phrase</Label>
              <Input
                id="word"
                placeholder="Ex: inspiration"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <Select
                value={language}
                onValueChange={(v) => setLanguage(v as Language)}
                disabled={isLoading}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="french">Français</SelectItem>
                  <SelectItem value="english">Anglais</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {result && result.rhymes && (
            <div>
              <h3 className="font-semibold mb-2">Résultats pour "{word}" :</h3>
              <div className="flex flex-wrap gap-2">
                {result.rhymes.map((rhyme, index) => (
                  <span key={index} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                    {rhyme}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Trouver des rimes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
