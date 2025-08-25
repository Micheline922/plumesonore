'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { inspirationQuotes, inspirationSounds, inspirationTexts } from '@/lib/placeholder-data';
import { Headphones, BookText, Play, Pause } from 'lucide-react';
import Image from 'next/image';

export default function InspirationPage() {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleSound = (soundSrc: string, soundTitle: string) => {
    if (activeSound === soundTitle && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } else {
      setActiveSound(soundTitle);
      if (audioRef.current) {
        audioRef.current.src = soundSrc;
        audioRef.current.play();
      }
    }
  };

  const isPlaying = (title: string) => {
    return activeSound === title && audioRef.current && !audioRef.current.paused;
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <audio ref={audioRef} onEnded={() => setActiveSound(null)} />
      <div className="flex items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Banque d'Inspiration</h1>
          <p className="text-muted-foreground mt-1">
            Votre sanctuaire d'idées pour ne jamais être à court d'inspiration.
          </p>
        </div>
      </div>

      <Tabs defaultValue="quotes" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="quotes">Citations</TabsTrigger>
          <TabsTrigger value="sounds">Sons d'ambiance</TabsTrigger>
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
        <TabsContent value="sounds">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {inspirationSounds.map((sound) => (
              <Card
                key={sound.title}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => toggleSound(sound.src, sound.title)}
              >
                <CardHeader className="p-0 relative">
                  <Image
                    src={`https://placehold.co/600x400.png`}
                    alt={sound.title}
                    width={600}
                    height={400}
                    className="rounded-t-lg object-cover aspect-video"
                    data-ai-hint={sound.hint}
                  />
                   {isPlaying(sound.title) && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Pause className="h-12 w-12 text-white" />
                    </div>
                  )}
                  {activeSound === sound.title && !isPlaying(sound.title) && (
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Play className="h-12 w-12 text-white" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="font-headline text-lg">{sound.title}</CardTitle>
                </CardContent>
                <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {isPlaying(sound.title) ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    <span>{isPlaying(sound.title) ? 'En cours' : 'Écouter'}</span>
                  </div>
                  <span>{sound.duration}</span>
                </CardFooter>
              </Card>
            ))}
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
