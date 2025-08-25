import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { communityPosts } from '@/lib/placeholder-data';
import { Heart, MessageCircle } from 'lucide-react';

export default function CommunityPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Communauté</h1>
          <p className="text-muted-foreground mt-1">
            Partagez vos créations, découvrez de nouveaux talents et collaborez.
          </p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {communityPosts.map((post, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src={post.avatar} alt={`@${post.author}`} data-ai-hint="person portrait" />
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-semibold leading-none">{post.author}</p>
                <p className="text-sm text-muted-foreground">{post.time}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm">{post.text}</p>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments}</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
