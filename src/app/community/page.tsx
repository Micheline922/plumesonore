
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle, Send, Mail, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateChatResponse } from '@/ai/flows/generate-chat-response';
import { useAuth } from '@/components/app/user-gate';
import { db } from '@/lib/firebase';
import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot,
    doc,
    updateDoc,
    increment,
    arrayUnion,
    arrayRemove,
    where
} from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

interface Comment {
  authorId: string;
  authorName: string;
  text: string;
  createdAt: any;
}

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  avatar?: string;
  text: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  createdAt: any;
  status: 'draft' | 'published';
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

function ContactDialog({ authorName }: { authorName: string; }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const getChatStorageKey = useCallback(() => {
      if (!user) return null;
      return `plume-sonore-chat-${user.uid}-${authorName}`;
  }, [user, authorName]);


  useEffect(() => {
    if (isOpen) {
      const storageKey = getChatStorageKey();
      if (!storageKey) return;
      const storedChat = localStorage.getItem(storageKey);
      setChatHistory(storedChat ? JSON.parse(storedChat) : []);
    }
  }, [isOpen, getChatStorageKey]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.displayName) return;

    const userMessage: ChatMessage = { sender: 'user', text: message };
    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);
    setMessage('');
    setIsLoading(true);

    try {
      const result = await generateChatResponse({
        senderName: user.displayName,
        recipientName: authorName,
        message: message,
      });

      const botMessage: ChatMessage = { sender: 'bot', text: result.response };
      const finalChatHistory = [...newChatHistory, botMessage];
      setChatHistory(finalChatHistory);

      const storageKey = getChatStorageKey();
      if (storageKey) localStorage.setItem(storageKey, JSON.stringify(finalChatHistory));

    } catch (error) {
      console.error(error);
      toast({
        title: 'Erreur',
        description: "L'IA n'a pas pu répondre. Réessayez plus tard.",
        variant: 'destructive',
      });
       const historyWithoutUserMessage = newChatHistory.slice(0, -1);
       setChatHistory(historyWithoutUserMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
       <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground" onClick={() => setIsOpen(true)}>
          <Mail className="h-3 w-3" />
        </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Conversation avec {authorName}</DialogTitle>
          <DialogDescription>
            Ceci est une conversation simulée par une IA.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          <div className="space-y-4">
            {chatHistory.length === 0 && <p className="text-sm text-center text-muted-foreground py-8">Envoyez le premier message.</p>}
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={cn('flex items-end gap-2', chat.sender === 'user' ? 'justify-end' : 'justify-start')}
              >
                {chat.sender === 'bot' && <Avatar className="h-8 w-8"><AvatarFallback>{authorName.charAt(0)}</AvatarFallback></Avatar>}
                <div className={cn('max-w-[75%] rounded-lg p-3 text-sm', chat.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                  {chat.text}
                </div>
                {chat.sender === 'user' && <Avatar className="h-8 w-8"><AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback></Avatar>}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                  <Avatar className="h-8 w-8"><AvatarFallback>{authorName.charAt(0)}</AvatarFallback></Avatar>
                  <div className="bg-muted p-3 rounded-lg"><Loader2 className="h-4 w-4 animate-spin" /></div>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <div className="flex items-center w-full space-x-2">
            <Input
              placeholder="Écrivez votre message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading}><Send className="h-4 w-4" /></Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [activeCommentSection, setActiveCommentSection] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
      const q = query(
        collection(db, 'creations'), 
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), text: doc.data().content } as Post));
          setPosts(fetchedPosts);
          setIsLoadingPosts(false);
      }, (error) => {
          console.error("Error fetching posts:", error);
          toast({ title: "Erreur", description: "Impossible de charger les publications.", variant: "destructive" });
          setIsLoadingPosts(false);
      });

      return () => unsubscribe();
  }, [toast]);

  const toggleLike = async (postId: string) => {
    if (!user) return;
    const postRef = doc(db, 'creations', postId);
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isLiked = post.likedBy && post.likedBy.includes(user.uid);
    try {
        await updateDoc(postRef, {
            likes: increment(isLiked ? -1 : 1),
            likedBy: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
        });
    } catch(error) {
        console.error("Error toggling like:", error);
        toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentText.trim() || !user) return;
    const postRef = doc(db, 'creations', postId);
    const newComment: Comment = {
        authorId: user.uid,
        authorName: user.displayName || "Anonyme",
        text: commentText,
        createdAt: new Date(),
    };
    try {
        await updateDoc(postRef, {
            comments: arrayUnion(newComment)
        });
        setCommentText('');
    } catch (error) {
        console.error("Error adding comment: ", error);
        toast({ title: 'Erreur', description: "Impossible d'ajouter le commentaire.", variant: 'destructive' });
    }
  };

  const formatPostTime = (timestamp: any) => {
    if (!timestamp) return "à l'instant";
    return formatDistanceToNow(timestamp.toDate(), { addSuffix: true, locale: fr });
  }
  
  if (!user) {
      return null;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Communauté</h1>
          <p className="text-muted-foreground mt-1">Découvrez les œuvres publiées par les artistes de Plume Sonore.</p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {isLoadingPosts ? (
            <div className='space-y-6'>
                <Skeleton className='h-48 w-full'/>
                <Skeleton className='h-32 w-full'/>
                <Skeleton className='h-40 w-full'/>
            </div>
        ) : posts.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-16">
              <div className="flex flex-col items-center gap-2 text-center">
                <h3 className="text-2xl font-bold tracking-tight">La scène est encore vide</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Aucune création n'a été publiée pour le moment. Soyez le premier à partager votre talent !
                </p>
              </div>
            </div>
        ) : posts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src={post.avatar} alt={`@${post.authorName}`} data-ai-hint="person portrait" />
                <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold leading-none">{post.authorName}</p>
                  {post.authorId !== user.uid && <ContactDialog authorName={post.authorName} />}
                </div>
                <p className="text-sm text-muted-foreground">{formatPostTime(post.createdAt)}</p>
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="font-headline text-lg font-semibold mb-2">{post.id}</h4>
              <p className="whitespace-pre-wrap text-sm">{post.text}</p>
            </CardContent>
            <CardFooter className="flex-col items-start">
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => toggleLike(post.id)}>
                  <Heart className={cn('h-4 w-4', post.likedBy && post.likedBy.includes(user.uid) && 'fill-destructive text-destructive')} />
                  <span>{post.likes || 0}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => setActiveCommentSection(activeCommentSection === post.id ? null : post.id)}>
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments?.length || 0}</span>
                </Button>
              </div>
              {activeCommentSection === post.id && (
                <div className="w-full mt-4 space-y-4 pt-4 border-t">
                  {[...(post.comments || [])].sort((a,b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()).map((comment, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <Avatar className="w-8 h-8 border"><AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback></Avatar>
                      <div className="bg-muted p-3 rounded-lg w-full">
                        <p className="font-semibold text-xs">{comment.authorName}</p>
                        <p className="text-muted-foreground">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input placeholder="Ajouter un commentaire..." value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}/>
                    <Button size="icon" onClick={() => handleAddComment(post.id)}><Send className="h-4 w-4" /></Button>
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
