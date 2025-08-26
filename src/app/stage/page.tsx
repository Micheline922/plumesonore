
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Pause, Square, Save, CircleDot } from 'lucide-react';
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
import { useAuth } from '@/components/app/user-gate';


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
  
  const { user } = useAuth();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const DURATION = 300; // 5 minutes performance

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
      if (timerRef.current) clearInterval(timerRef.current);
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
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      stream.getTracks().forEach(track => track.stop());
    };
    mediaRecorderRef.current.start();
  };

  const handleStart = () => {
    setProgress(0);
    startRecording();
  };

  const handlePause = () => {
    if (!mediaRecorderRef.current) return;
    if (stage === 'paused') {
      mediaRecorderRef.current.resume();
      setStage('recording');
    } else {
      mediaRecorderRef.current.pause();
      setStage('paused');
    }
  };

  const handleStop = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setStage('finished');
    setProgress(100);
  }

  const handleReset = () => {
    setStage('idle');
    setProgress(0);
    setAudioURL('');
  }

  const handleSave = () => {
     if (!performanceTitle) {
      toast({ title: 'Titre manquant', description: 'Veuillez donner un titre à votre performance.', variant: 'destructive' });
      return;
    }
    if (!user) {
      toast({ title: 'Utilisateur non connecté', description: 'Vous devez être connecté pour sauvegarder.', variant: 'destructive' });
      return;
    }

    const newCreation: Creation = {
      id: Date.now(),
      title: performanceTitle,
      audioSrc: audioURL,
      type: 'audio',
      date: new Date().toISOString(),
    };

    const storageKey = `plume-sonore-creations-${user.email}`;
    const existingCreationsRaw = localStorage.getItem(storageKey);
    const existingCreations: Creation[] = existingCreationsRaw ? JSON.parse(existingCreationsRaw) : [];
    
    localStorage.setItem(storageKey, JSON.stringify([newCreation, ...existingCreations]));

    toast({ title: 'Performance sauvegardée !', description: 'Votre enregistrement a été ajouté à "Mes Créations".' });
    setIsSaveAlertOpen(false);
    setPerformanceTitle('');
    handleReset();
  }

  const renderButtons = () => {
    switch (stage) {
      case 'idle':
        return <Button size="lg" className="w-full" onClick={handleStart}><Mic className="mr-2 h-5 w-5" />Commencer la performance</Button>;
      case 'recording':
      case 'paused':
        return (
          <div className='flex gap-4'>
            <Button size="lg" variant="secondary" className="w-full" onClick={handlePause}>
              {stage === 'paused' ? <><Mic className="mr-2 h-5 w-5" />Reprendre</> : <><Pause className="mr-2 h-5 w-5" />Pause</>}
            </Button>
            <Button size="lg" variant="destructive" className="w-full" onClick={handleStop}><Square className="mr-2 h-5 w-5" />Arrêter</Button>
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
              <Button size="lg" variant="outline" className="w-full" onClick={handleReset}>Recommencer</Button>
              <Button size="lg" className="w-full" onClick={() => setIsSaveAlertOpen(true)}><Save className="mr-2 h-5 w-5" />Sauvegarder</Button>
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
            <CardDescription className="text-base">Le micro est à vous. Enregistrez vos textes, testez votre flow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {(stage === 'recording' || stage === 'paused') && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground">{stage === 'paused' ? 'Enregistrement en pause' : 'Enregistrement en cours...'}</p>
              </div>
            )}
            {stage === 'finished' && <p className="text-sm font-semibold text-primary">Performance terminée !</p>}
            {renderButtons()}
          </CardContent>
        </Card>
      </main>
      <AlertDialog open={isSaveAlertOpen} onOpenChange={setIsSaveAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sauvegarder la performance</AlertDialogTitle>
            <AlertDialogDescription>Donnez un titre à votre enregistrement pour le retrouver.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="performance-title">Titre de la performance</Label>
            <Input id="performance-title" value={performanceTitle} onChange={(e) => setPerformanceTitle(e.target.value)} placeholder="Ex: Mon premier slam..."/>
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
