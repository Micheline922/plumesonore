import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

export default function WritingPadPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Atelier d'écriture</CardTitle>
          <CardDescription>
            C'est ici que la magie opère. Écrivez sans distraction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" placeholder="Le titre de votre œuvre..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Votre texte</Label>
            <Textarea
              id="content"
              placeholder="Commencez à écrire ici..."
              className="min-h-[40vh] text-base"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
