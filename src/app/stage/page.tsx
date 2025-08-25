import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic } from 'lucide-react';

export default function StagePage() {
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
        <CardContent>
          <Button size="lg" className="w-full">
            Commencer la performance
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
