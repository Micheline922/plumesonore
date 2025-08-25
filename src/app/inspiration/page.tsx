
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { inspirationQuotes, inspirationTexts } from '@/lib/placeholder-data';
import { Wand2, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateInspiration, GenerateInspirationOutput } from '@/ai/flows/generate-inspiration';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


type Language = 'french' | 'english';

function InspirationGenerator() {
  const [word, setWord] = useState('');
  const [language, setLanguage] = useState<Language>('french');
  const [result, setResult] = useState<GenerateInspirationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word) {
      toast({
        title: 'Champ requis',
        description: "Veuillez entrer un mot pour générer l'inspiration.",
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const inspiration = await generateInspiration({ word, language });
      setResult(inspiration);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue lors de la génération de l'inspiration.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Développez une idée</CardTitle>
        <CardDescription>Entrez un mot-clé et laissez l'IA vous proposer des pistes créatives.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:gap-4 space-y-4 sm:space-y-0">
            <div className="space-y-2 flex-grow">
              <Label htmlFor="word">Votre mot</Label>
              <Input
                id="word"
                placeholder="Ex: Éphémère, Silence, Chaos..."
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
                <SelectTrigger id="language" className="w-full sm:w-[180px]">
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
          {result && result.paragraphs && (
            <div className="space-y-4 rounded-md border bg-background/50 p-4">
              <h3 className="font-headline font-semibold">Pistes créatives pour "{word}" :</h3>
              {result.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Trouver l'inspiration
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}


export default function InspirationPage() {

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Banque d'Inspiration</h1>
          <p className="text-muted-foreground mt-1">
            Votre sanctuaire d'idées pour ne jamais être à court d'inspiration.
          </p>
        </div>
      </div>
      
      <InspirationGenerator />

      <Tabs defaultValue="quotes" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
          <TabsTrigger value="quotes">Citations</TabsTrigger>
          <TabsTrigger value="texts">Textes Célèbres</TabsTrigger>
        </TabsList>
        <TabsContent value="quotes">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {inspirationQuotes.map((item) => (
              <Card key={item.quote} className="flex flex-col">
                <CardContent className="p-6 flex-grow">
                  <blockquote className="border-l-4 border-primary pl-4 italic">
                    "{item.quote}"
                  </blockquote>
                </CardContent>
                <CardFooter>
                  <p className="text-sm font-medium">- {item.author}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="texts">
           <Accordion type="single" collapsible className="w-full">
            {inspirationTexts.map((text, index) => (
               <AccordionItem value={`item-${index}`} key={text.title}>
                <AccordionTrigger className="hover:no-underline">
                  <div className='text-left'>
                    <p className="font-headline font-semibold">{text.title}</p>
                    <p className="text-sm text-muted-foreground">{text.author} - <span className='font-sans'>{text.genre}</span></p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="whitespace-pre-wrap text-muted-foreground p-4 bg-muted/50 rounded-md">
                    {text.content}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </main>
  );
}
