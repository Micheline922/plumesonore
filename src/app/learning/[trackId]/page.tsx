
'use client';

import { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { learningTracks } from '@/lib/placeholder-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Bot, BrainCircuit, Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { learningAssistant, LearningAssistantOutput } from '@/ai/flows/learning-assistant';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from '@/lib/utils';
import React from 'react';

type AIInteractionProps = {
    trackTitle: string;
}

function AITutor({ trackTitle }: AIInteractionProps) {
    const [topic, setTopic] = useState('');
    const [result, setResult] = useState<LearningAssistantOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const { toast } = useToast();

    const handleAIRequest = async (requestType: 'explain' | 'quiz') => {
        const requestTopic = requestType === 'quiz' ? trackTitle : topic;
         if (!requestTopic) {
            toast({
                title: 'Champ requis',
                description: "Veuillez entrer un concept à expliquer.",
                variant: 'destructive',
            });
            return;
        }
        setIsLoading(true);
        setResult(null);
        setSubmitted(false);
        setQuizAnswers({});

        try {
            const response = await learningAssistant({ topic: requestTopic, requestType });
            setResult(response);
        } catch (error) {
            console.error(error);
            toast({
                title: 'Erreur',
                description: "Une erreur est survenue avec l'assistant IA.",
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleQuizSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const getScore = () => {
        if(!result?.quiz) return 0;
        return result.quiz.reduce((score, question, index) => {
            return score + (quizAnswers[index] === question.answer ? 1 : 0);
        }, 0);
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Bot className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle className="font-headline text-xl">Tuteur IA</CardTitle>
                        <CardDescription>Posez une question ou testez vos connaissances.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4 rounded-md border p-4">
                    <Label htmlFor="concept">Expliquer un concept</Label>
                    <div className="flex gap-2">
                        <Input
                            id="concept"
                            placeholder="Ex: une allitération, le flow, un vers..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            disabled={isLoading}
                        />
                        <Button onClick={() => handleAIRequest('explain')} disabled={isLoading}>
                             {isLoading && !result?.quiz ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                            Expliquer
                        </Button>
                    </div>
                </div>

                 <div className="space-y-4">
                    <p className="text-sm font-medium">Prêt à tester vos connaissances sur "{trackTitle}" ?</p>
                    <Button onClick={() => handleAIRequest('quiz')} variant="secondary" disabled={isLoading}>
                         {isLoading && result?.quiz ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                        Générer un Quiz
                    </Button>
                </div>
                
                 {isLoading && (
                    <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {result && (
                     <div className="space-y-4 rounded-md border bg-background/50 p-4">
                        {result.response && (
                            <div>
                                <h3 className="font-headline font-semibold mb-2">Explication pour "{topic}" :</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.response}</p>
                            </div>
                        )}
                        {result.quiz && (
                            <form onSubmit={handleQuizSubmit}>
                                <h3 className="font-headline font-semibold mb-4">Quiz : {trackTitle}</h3>
                                <div className="space-y-6">
                                {result.quiz.map((q, index) => (
                                    <div key={index} 
                                        className={cn("space-y-3 rounded-lg p-3",
                                        submitted && (quizAnswers[index] === q.answer ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30')
                                    )}>
                                        <p className="font-semibold text-sm">{index + 1}. {q.question}</p>
                                        <RadioGroup 
                                            value={quizAnswers[index]}
                                            onValueChange={(value) => setQuizAnswers(prev => ({...prev, [index]: value}))}
                                            disabled={submitted}
                                        >
                                            {q.options.map((opt) => (
                                                <div key={opt} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={opt} id={`q${index}-${opt}`} />
                                                    <Label htmlFor={`q${index}-${opt}`} className={cn("font-normal", submitted && opt === q.answer && "font-bold")}>{opt}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                        {submitted && quizAnswers[index] !== q.answer && <p className="text-xs font-semibold text-green-700 dark:text-green-400">Réponse correcte : {q.answer}</p>}
                                    </div>
                                ))}
                                </div>
                                {!submitted ? (
                                    <Button type="submit" className="mt-6">Valider le quiz</Button>
                                ) : (
                                    <div className="mt-6 rounded-lg bg-muted p-4 text-center">
                                        <p className="font-headline text-lg font-semibold">Quiz terminé !</p>
                                        <p className="text-2xl font-bold text-primary">{getScore()} / 10</p>
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function LearningTrackPage() {
  const params = useParams();
  const trackId = parseInt(params.trackId as string, 10);
  
  if (isNaN(trackId) || trackId < 0 || trackId >= learningTracks.length) {
    notFound();
  }
  const track = learningTracks[trackId];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="max-w-4xl mx-auto w-full">
        <div className="space-y-2 mb-8">
            <Badge variant="secondary">{track.level}</Badge>
            <h1 className="font-headline text-4xl font-bold tracking-tight">{track.title}</h1>
            <p className="text-muted-foreground text-lg">{track.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                 <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{track.duration}</span>
                </div>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Contenu du cours</CardTitle>
            </CardHeader>
            <CardContent>
                <div 
                    className="prose prose-p:text-muted-foreground dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: track.content }}
                />
            </CardContent>
        </Card>

        <AITutor trackTitle={track.title} />

      </div>
    </main>
  );
}
