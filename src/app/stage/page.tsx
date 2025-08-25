
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Pause, Square, Save, CircleDot, Music, Play, StopCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { instrumentalTracks } from '@/lib/placeholder-data';
import { Separator } from '@/components/ui/separator';

type StageState = 'idle' | 'recording' | 'paused' | 'finished';

interface Creation {
  id: number;
  title: string;
  audioSrc: string;
  type: 'audio';
  date: string;
}

export default function StagePage() {
  const [stage, setStage] = useState<StageState>('idle');
  const [progress, setProgress] = useState(0);
  const [audioURL, setAudioURL] = useState('');
  const [isSaveAlertOpen, setIsSaveAlertOpen] = useState(false);
  const [performanceTitle, setPerformanceTitle] = useState('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const [currentInstrumental, setCurrentInstrumental] = useState<{src: string, isPlaying: boolean} | null>(null);
  const instrumentalAudioRef = useRef<HTMLAudioElement | null>(null);

  const DURATION = 300; // 5 minutes performance

  useEffect(() => {
    instrumentalAudioRef.current = new Audio();
    instrumentalAudioRef.current.addEventListener('ended', () => {
        setCurrentInstrumental(prev => prev ? { ...prev, isPlaying: false } : null);
    });

    return () => {
        if (instrumentalAudioRef.current) {
            instrumentalAudioRef.current.pause();
            instrumentalAudioRef.current.removeEventListener('ended', () => {});
            instrumentalAudioRef.current = null;
        }
    }
  }, []);


  useEffect(() => {
    if (stage === 'recording') {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleStop();
            return 100;
          }
          return prev + 100 / DURATION;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const requestMicPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (error) {
      toast({
        title: 'Accès au microphone refusé',
        description: "Veuillez autoriser l'accès au microphone dans les paramètres de votre navigateur pour enregistrer.",
        variant: 'destructive',
      });
      return false;
    }
  }

  const startRecording = async () => {
    const hasPermission = await requestMicPermission();
    if (!hasPermission) return;

    setStage('recording');
    audioChunksRef.current = [];
    setAudioURL('');
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      stream.getTracks().forEach(track => track.stop()); // Stop the mic
    };
    mediaRecorderRef.current.start();
  };


  const handleStart = () => {
    setProgress(0);
    startRecording();
    if(instrumentalAudioRef.current?.src && instrumentalAudioRef.current.paused) {
        instrumentalAudioRef.current.play();
        setCurrentInstrumental(prev => prev ? { ...prev, isPlaying: true } : null);
    }
  };

  const handlePause = () => {
    if (!mediaRecorderRef.current) return;
    if (stage === 'paused') {
      mediaRecorderRef.current.resume();
      setStage('recording');
       if(instrumentalAudioRef.current?.src && instrumentalAudioRef.current.paused) {
        instrumentalAudioRef.current.play();
        setCurrentInstrumental(prev => prev ? { ...prev, isPlaying: true } : null);
      }
    } else {
      mediaRecorderRef.current.pause();
      setStage('paused');
      if(instrumentalAudioRef.current?.src) {
        instrumentalAudioRef.current.pause();
        setCurrentInstrumental(prev => prev ? { ...prev, isPlaying: false } : null);
      }
    }
  };
  
  const handleStop = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
    }
    if (instrumentalAudioRef.current) {
        instrumentalAudioRef.current.pause();
        instrumentalAudioRef.current.currentTime = 0;
    }
    setStage('finished');
    setProgress(100);
    setCurrentInstrumental(prev => prev ? { ...prev, isPlaying: false } : null);
  }

  const handleReset = () => {
    setStage('idle');
    setProgress(0);
    setAudioURL('');
    if (instrumentalAudioRef.current) {
        instrumentalAudioRef.current.pause();
        instrumentalAudioRef.current.src = '';
    }
    setCurrentInstrumental(null);
  }

  const handleSave = () => {
     if (!performanceTitle) {
      toast({
        title: 'Titre manquant',
        description: 'Veuillez donner un titre à votre performance.',
        variant: 'destructive',
      });
      return;
    }

    const newCreation: Creation = {
      id: Date.now(),
      title: performanceTitle,
      audioSrc: audioURL,
      type: 'audio',
      date: new Date().toISOString(),
    };

    const existingCreationsRaw = localStorage.getItem('plume-sonore-creations');
    const existingCreations: Creation[] = existingCreationsRaw ? JSON.parse(existingCreationsRaw) : [];
    
    localStorage.setItem('plume-sonore-creations', JSON.stringify([newCreation, ...existingCreations]));

    toast({
        title: 'Performance sauvegardée !',
        description: 'Votre enregistrement a été ajouté à "Mes Créations".',
    });
    
    setIsSaveAlertOpen(false);
    setPerformanceTitle('');
    handleReset();
  }

  const toggleInstrumental = (trackSrc: string) => {
    if (!instrumentalAudioRef.current) return;

    if (currentInstrumental?.src === trackSrc) {
        if(currentInstrumental.isPlaying) {
            instrumentalAudioRef.current.pause();
            setCurrentInstrumental(prev => prev ? { ...prev, isPlaying: false } : null);
        } else {
            instrumentalAudioRef.current.play();
            setCurrentInstrumental(prev => prev ? { ...prev, isPlaying: true } : null);
        }
    } else {
        instrumentalAudioRef.current.src = trackSrc;
        instrumentalAudioRef.current.play();
        setCurrentInstrumental({src: trackSrc, isPlaying: true});
    }
  };

  const renderButtons = () => {
    switch (stage) {
      case 'idle':
        return (
          <Button size="lg" className="w-full" onClick={handleStart}>
            <Mic className="mr-2 h-5 w-5" />
            Commencer la performance
          </Button>
        );
      case 'recording':
      case 'paused':
        return (
          <div className='flex gap-4'>
             <Button size="lg" variant="secondary" className="w-full" onClick={handlePause}>
                {stage === 'paused' ? <Mic className="mr-2 h-5 w-5" /> : <Pause className="mr-2 h-5 w-5" />}
                {stage === 'paused' ? 'Reprendre' : 'Pause'}
              </Button>
             <Button size="lg" variant="destructive" className="w-full" onClick={handleStop}>
              <Square className="mr-2 h-5 w-5" />
              Arrêter
            </Button>
          </div>
        );
      case 'finished':
        return (
          <div className="space-y-4">
             {audioURL && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Écouter votre performance :</h3>
                <audio src={audioURL} controls className="w-full"></audio>
              </div>
            )}
            <div className="flex gap-4">
                <Button size="lg" variant="outline" className="w-full" onClick={handleReset}>
                    Recommencer
                </Button>
                 <Button size="lg" className="w-full" onClick={() => setIsSaveAlertOpen(true)}>
                    <Save className="mr-2 h-5 w-5" />
                    Sauvegarder
                </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
             {stage === 'recording' && <CircleDot className="h-8 w-8 text-destructive animate-pulse" />}
             {(stage === 'idle' || stage === 'paused' || stage === 'finished') && <Mic className="h-8 w-8" />}
          </div>
          <CardTitle className="font-headline text-3xl mt-4">Scène Virtuelle</CardTitle>
          <CardDescription className="text-base">
            Le micro est à vous. Enregistrez vos textes, testez votre flow et préparez-vous pour la scène.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           
           <div className="space-y-4">
            <Separator />
             <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-headline text-lg">Choisir un instrumental</h3>
             </div>
             <div className="space-y-2 text-left">
                {instrumentalTracks.map((track) => (
                    <Button 
                        key={track.src} 
                        variant={currentInstrumental?.src === track.src ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => toggleInstrumental(track.src)}
                        disabled={stage !== 'idle'}
                    >
                        {currentInstrumental?.src === track.src && currentInstrumental.isPlaying ? <StopCircle className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                        {track.title}
                    </Button>
                ))}
             </div>
             <Separator />
           </div>
           
           {(stage === 'recording' || stage === 'paused') && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground">
                {stage === 'paused' ? 'Enregistrement en pause' : 'Enregistrement en cours...'}
              </p>
            </div>
          )}
           {stage === 'finished' && (
             <p className="text-sm text-muted-foreground font-semibold text-primary">Performance terminée !</p>
           )}
          {renderButtons()}
        </CardContent>
      </Card>
    </main>
     <AlertDialog open={isSaveAlertOpen} onOpenChange={setIsSaveAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sauvegarder la performance</AlertDialogTitle>
            <AlertDialogDescription>
              Donnez un titre à votre enregistrement pour le retrouver facilement dans vos créations.
            </AlertDialogDescription>
          </AlertDialogHeader>
           <div className="space-y-2">
              <Label htmlFor="performance-title">Titre de la performance</Label>
              <Input
                id="performance-title"
                value={performanceTitle}
                onChange={(e) => setPerformanceTitle(e.target.value)}
                placeholder="Ex: Mon premier slam, Freestyle du soir..."
              />
            </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPerformanceTitle('')}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
