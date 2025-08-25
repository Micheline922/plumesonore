import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { learningTracks } from '@/lib/placeholder-data';
import { BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';

export default function LearningPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Parcours de Progression</h1>
          <p className="text-muted-foreground mt-1">
            Ateliers, défis et tutoriels pour devenir un maître des mots.
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {learningTracks.map((track, index) => (
           <Link key={track.title} href={`/learning/${index}`} className="flex">
            <Card  className="flex flex-col w-full hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="font-headline">{track.title}</CardTitle>
                <CardDescription>{track.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                 <div
                    className="prose prose-sm prose-p:text-muted-foreground dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: track.content }}
                  />
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{track.duration}</span>
                </div>
                <Badge variant="outline">{track.level}</Badge>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
