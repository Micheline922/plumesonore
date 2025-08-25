
'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { communityPosts as initialPosts } from '@/lib/placeholder-data';
import { Heart, MessageCircle, Send, Pencil, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';


interface Comment {
  author: string;
  text: string;
}

interface Post {
  id: number;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  commentsCount: number;
  comments: Comment[];
  liked?: boolean;
}

function NewPostForm({ onAddPost, currentUser }: { onAddPost: (text: string) => void; currentUser: { artistName: string } }) {
  const [postText, setPostText] = useState('');
  const { toast } = useToast();

  const handlePublish = () => {
    if (!postText.trim()) {
      toast({
        title: 'Contenu manquant',
        description: 'Veuillez écrire quelque chose avant de publier.',
        variant: 'destructive',
      });
      return;
    }
    onAddPost(postText);
    setPostText('');
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Pencil className="h-5 w-5" />
          Créer une publication
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarFallback>{currentUser.artistName.charAt(0)}</AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="Exprimez-vous, partagez un vers, demandez un avis..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handlePublish}>Publier</Button>
      </CardFooter>
    </Card>
  );
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeCommentSection, setActiveCommentSection] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [currentUser, setCurrentUser] = useState({ artistName: 'Artiste Anonyme' });
  const { toast } = useToast();

  useEffect(() => {
    const user = localStorage.getItem('plume-sonore-user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const toggleLike = (id: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked,
          };
        }
        return post;
      })
    );
  };

  const handleCommentToggle = (id: number) => {
    if (activeCommentSection === id) {
      setActiveCommentSection(null);
    } else {
      setActiveCommentSection(id);
    }
  };

  const handleAddComment = (id: number) => {
    if (!commentText.trim()) return;

    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          const newComment = {
            author: currentUser.artistName,
            text: commentText,
          };
          return {
            ...post,
            comments: [...post.comments, newComment],
            commentsCount: post.commentsCount + 1,
          };
        }
        return post;
      })
    );
    setCommentText('');
  };

  const handleAddPost = (text: string) => {
    const newPost: Post = {
      id: Date.now(),
      author: currentUser.artistName,
      avatar: 'https://placehold.co/40x40.png',
      time: "à l'instant",
      text,
      likes: 0,
      commentsCount: 0,
      comments: [],
      liked: false,
    };
    setPosts([newPost, ...posts]);
  };
  
  const handleContact = (author: string) => {
     toast({
        title: `Message à ${author}`,
        description: `Votre message a bien été envoyé.`,
    });
  }

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
        <NewPostForm onAddPost={handleAddPost} currentUser={currentUser} />
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src={post.avatar} alt={`@${post.author}`} data-ai-hint="person portrait" />
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold leading-none">{post.author}</p>
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                         </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Contacter {post.author}</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette fonctionnalité est en cours de développement. Pour le moment, vous pouvez imaginer envoyer un message privé à cet artiste.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleContact(post.author)}>
                            Envoyer un message
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
                <p className="text-sm text-muted-foreground">{post.time}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm">{post.text}</p>
            </CardContent>
            <CardFooter className="flex-col items-start">
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => toggleLike(post.id)}>
                  <Heart className={cn('h-4 w-4', post.liked && 'fill-destructive text-destructive')} />
                  <span>{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => handleCommentToggle(post.id)}>
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.commentsCount}</span>
                </Button>
              </div>
              {activeCommentSection === post.id && (
                <div className="w-full mt-4 space-y-4 pt-4 border-t">
                  {post.comments.map((comment, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <Avatar className="w-8 h-8 border">
                        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="bg-muted p-3 rounded-lg w-full">
                        <p className="font-semibold text-xs">{comment.author}</p>
                        <p className="text-muted-foreground">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Ajouter un commentaire..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    />
                    <Button size="icon" onClick={() => handleAddComment(post.id)}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
