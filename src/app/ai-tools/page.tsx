import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RhymeGenerator } from '@/components/app/rhyme-generator';
import { FeedbackTool } from '@/components/app/feedback-tool';
import { PromptGenerator } from '@/components/app/prompt-generator';

export default function AIToolsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Assistant IA</h1>
          <p className="text-muted-foreground mt-1">
            Votre muse personnelle pour surmonter la page blanche.
          </p>
        </div>
      </div>

      <Tabs defaultValue="rhymes" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="rhymes">Générateur de rimes</TabsTrigger>
          <TabsTrigger value="feedback">Feedback sur texte</TabsTrigger>
          <TabsTrigger value="prompts">Générateur d'idées</TabsTrigger>
        </TabsList>
        <TabsContent value="rhymes">
          <RhymeGenerator />
        </TabsContent>
        <TabsContent value="feedback">
          <FeedbackTool />
        </TabsContent>
        <TabsContent value="prompts">
          <PromptGenerator />
        </TabsContent>
      </Tabs>
    </main>
  );
}
