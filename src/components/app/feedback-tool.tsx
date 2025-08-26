
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { getFeedbackOnText, type GetFeedbackOnTextOutput } from '@/ai/flows/get-feedback-on-text';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';


type WritingStyle = 'poetry' | 'slam' | 'rap' | 'article' | 'speech' | 'podcast';
type Language = 'french' | 'english';

export function FeedbackTool() {
  const [text, setText] = useState('');
  const [writingStyle, setWritingStyle] = useState<WritingStyle>('poetry');
  const [language, setLanguage] = useState<Language>('french');
  const [result, setResult] = useState<GetFeedbackOnTextOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) {
      toast({
        title: 'Champ requis',
        description: 'Veuillez entrer un texte à analyser.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const feedback = await getFeedbackOnText({ text, writingStyle, language });
      setResult(feedback);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue lors de l'analyse du texte.",
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
          <CardTitle className="font-headline">Feedback sur texte</CardTitle>
          <CardDescription>
            Recevez des conseils pour améliorer votre rythme, vos rimes et votre style.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3 space-y-2">
              <Label htmlFor="text-input">Votre texte</Label>
              <Textarea
                id="text-input"
                placeholder="Écrivez ou collez votre texte ici..."
                className="min-h-[200px]"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="writing-style">Style d'écriture</Label>
                <Select
                  value={writingStyle}
                  onValueChange={(v) => setWritingStyle(v as WritingStyle)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="writing-style">
                    <SelectValue placeholder="Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poetry">Poésie</SelectItem>
                    <SelectItem value="slam">Slam</SelectItem>
                    <SelectItem value="rap">Rap</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="speech">Discours</SelectItem>
                    <SelectItem value="podcast">Podcast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label htmlFor="language">Langue du feedback</Label>
                <Select
                  value={language}
                  onValueChange={(v) => setLanguage(v as Language)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Langue" />
                  </Trigger>
                  <SelectContent>
                    <SelectItem value="french">Français</SelectItem>
                    <SelectItem value="english">Anglais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {result && (
            <div className="space-y-4 rounded-md border bg-background p-4">
              <div>
                <h3 className="font-headline font-semibold mb-2 text-lg">Feedback</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.feedback}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-headline font-semibold mb-2 text-lg">Suggestions</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.suggestions}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Analyser mon texte
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
