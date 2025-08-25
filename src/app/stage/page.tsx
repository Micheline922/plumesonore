'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Pause, Square } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type StageState = 'idle' | 'recording' | 'paused' | 'finished';

export default function StagePage() {
  const [stage, setStage] = useState<StageState>('idle');
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const DURATION = 30; // 30 seconds performance

  useEffect(() => {
    if (stage === 'recording') {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timerRef.current!);
            setStage('finished');
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
  }, [stage]);

  const handleStart = () => {
    setProgress(0);
    setStage('recording');
  };

  const handlePause = () => {
    setStage(stage === 'paused' ? 'recording' : 'paused');
  };
  
  const handleStop = () => {
    setStage('finished');
    setProgress(100);
  }

  const handleReset = () => {
    setStage('idle');
    setProgress(0);
  }

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
          <Button size="lg" className="w-full" onClick={handleReset}>
            Recommencer
          </Button>
        );
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mic className="h-8 w-8" />
          </div>
          <CardTitle className="font-headline text-3xl mt-4">Scène Virtuelle</CardTitle>
          <CardDescription className="text-base">
            Le micro est à vous. Entraînez-vous à déclamer vos textes, testez votre flow et préparez-vous pour la scène.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           {(stage === 'recording' || stage === 'paused' || stage === 'finished') && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground">
                {stage === 'finished' ? 'Performance terminée !' : 'Enregistrement en cours...'}
              </p>
            </div>
          )}
          {renderButtons()}
        </CardContent>
      </Card>
    </main>
  );
}
