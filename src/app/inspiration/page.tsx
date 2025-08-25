
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { inspirationQuotes, inspirationSounds, inspirationTexts, inspirationInstrumentals } from '@/lib/placeholder-data';
import { Headphones, BookText, Play, Pause, Music, Wand2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateInspiration, GenerateInspirationOutput } from '@/ai/flows/generate-inspiration';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
        description: 'Veuillez entrer un mot pour générer l\'inspiration.',
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
        description: 'Une erreur est survenue lors de la génération de l\'inspiration.',
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeMedia, setActiveMedia] = useState<{src: string, title: string} | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setActiveMedia(null);
    };
    const onCanPlay = () => {
      audio.play().catch(e => console.error("Error playing audio:", e));
    }
    
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('canplay', onCanPlay);

    // Cleanup
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('canplay', onCanPlay);
      audio.pause();
    };
  }, []);

  const toggleMedia = (src: string, title: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (activeMedia?.src === src) {
      if (audio.paused) {
        audio.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audio.pause();
      }
    } else {
      setActiveMedia({ src, title });
      audio.src = src;
      // The 'canplay' event listener will trigger play.
    }
  };


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
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="quotes">Citations</TabsTrigger>
          <TabsTrigger value="instrumentals">Instrumentaux</TabsTrigger>
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
         <TabsContent value="instrumentals">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {inspirationInstrumentals.map((instrumental) => {
               const isActive = activeMedia?.src === instrumental.src;
               const isCurrentlyPlaying = isActive && isPlaying;
              return (
              <Card
                key={instrumental.title}
                className="cursor-pointer hover:border-primary transition-colors flex flex-col"
                onClick={() => toggleMedia(instrumental.src, instrumental.title)}
              >
                 <CardHeader className="p-0 relative">
                  <Image
                    src={`https://placehold.co/600x400.png`}
                    alt={instrumental.title}
                    width={600}
                    height={400}
                    className="rounded-t-lg object-cover aspect-video"
                    data-ai-hint={instrumental.hint}
                  />
                   {isCurrentlyPlaying && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                      <Pause className="h-12 w-12 text-white" />
                    </div>
                  )}
                  {isActive && !isCurrentlyPlaying && (
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                        <Play className="h-12 w-12 text-white" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="font-headline text-lg">{instrumental.title}</CardTitle>
                </CardContent>
                <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {isCurrentlyPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    <span>{isCurrentlyPlaying ? 'En cours' : 'Écouter'}</span>
                  </div>
                  <span>{instrumental.duration}</span>
                </CardFooter>
              </Card>
            )})}
          </div>
        </TabsContent>
        <TabsContent value="texts">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {inspirationTexts.map((text) => (
              <Card key={text.title} className="flex flex-col">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookText className="h-6 w-6" />
                  </div>
                  <CardTitle className="font-headline">{text.title}</CardTitle>
                  <CardDescription>{text.author}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <p className="text-sm text-muted-foreground">{text.genre}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
