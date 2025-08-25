'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateWritingPrompts, type GenerateWritingPromptsOutput } from '@/ai/flows/generate-writing-prompts';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Loader2 } from 'lucide-react';

type Genre = 'poetry' | 'slam' | 'rap';

export function PromptGenerator() {
  const [genre, setGenre] = useState<Genre>('poetry');
  const [result, setResult] = useState<GenerateWritingPromptsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    try {
      const prompts = await generateWritingPrompts({ genre, count: 3 });
      setResult(prompts);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue lors de la génération d'idées.",
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
          <CardTitle className="font-headline">Générateur d'idées</CardTitle>
          <CardDescription>
            Trouvez l'inspiration avec des thèmes et des contraintes créatives.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Select
              value={genre}
              onValueChange={(v) => setGenre(v as Genre)}
              disabled={isLoading}
            >
              <SelectTrigger id="genre" className="w-full sm:w-[280px]">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="poetry">Poésie</SelectItem>
                <SelectItem value="slam">Slam</SelectItem>
                <SelectItem value="rap">Rap</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {result && result.prompts && (
            <div className="space-y-3">
              <h3 className="font-semibold">Vos thèmes :</h3>
              <ul className="list-disc list-inside space-y-2">
                {result.prompts.map((prompt, index) => (
                  <li key={index} className="pl-2">
                    {prompt}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
            Générer des idées
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
