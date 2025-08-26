
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
import { communityPosts as placeholderPosts } from '@/lib/placeholder-data';
import { useAuth } from '@/components/app/user-gate';


interface Comment {
  author: string;
  text: string;
}

interface Post {
  id: number;
  author: string;
  avatar?: string;
  time: string;
  text: string;
  likes: number;
  commentsCount: number;
  comments: Comment[];
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
      return `plume-sonore-chat-${user.email}-${authorName}`;
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
    if (!message.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', text: message };
    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);
    setMessage('');
    setIsLoading(true);

    try {
      const result = await generateChatResponse({
        senderName: user?.artistName || "L'utilisateur",
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
                {chat.sender === 'user' && <Avatar className="h-8 w-8"><AvatarFallback>{user?.artistName?.charAt(0)}</AvatarFallback></Avatar>}
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
  const [newPostText, setNewPostText] = useState('');
  const [activeCommentSection, setActiveCommentSection] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const getStorageKey = useCallback(() => {
    if (!user) return 'plume-sonore-community-posts'; // Default key if no user
    return `plume-sonore-community-posts-${user.email}`;
  }, [user]);

  useEffect(() => {
    const storageKey = getStorageKey();
    const storedPosts = localStorage.getItem(storageKey);
    const initialPosts = storedPosts ? JSON.parse(storedPosts) : placeholderPosts;
    setPosts(initialPosts);
  }, [getStorageKey]);

  useEffect(() => {
    // Prevent saving default data back to local storage on initial load
    if (posts.length > 0) {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(posts));
    }
  }, [posts, getStorageKey]);

  const handlePostSubmit = () => {
    if (!newPostText.trim() || !user) {
        toast({ title: 'Erreur', description: 'Le texte est vide ou vous n\'êtes pas connecté.', variant: 'destructive'});
        return;
    }
    const newPost: Post = {
      id: Date.now(),
      author: user.artistName,
      avatar: 'https://placehold.co/40x40.png',
      time: 'à l\'instant',
      text: newPostText,
      likes: 0,
      commentsCount: 0,
      comments: [],
    };
    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  const toggleLike = (postId: number) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleAddComment = (postId: number) => {
    if (!commentText.trim() || !user) return;
    const newComment = { author: user.artistName, text: commentText };
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment], commentsCount: p.commentsCount + 1 } : p));
    setCommentText('');
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Communauté</h1>
          <p className="text-muted-foreground mt-1">Découvrez, partagez et collaborez avec d'autres artistes.</p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Partagez une idée</CardTitle>
            <CardDescription>Une rime, un couplet, une question... lancez-vous !</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-2">
              <Textarea placeholder="Votre texte ici..." value={newPostText} onChange={(e) => setNewPostText(e.target.value)} />
              <Button onClick={handlePostSubmit} disabled={!user}>Envoyer</Button>
            </div>
          </CardContent>
        </Card>
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
                  {user && post.author !== user.artistName && <ContactDialog authorName={post.author} />}
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
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => setActiveCommentSection(activeCommentSection === post.id ? null : post.id)}>
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.commentsCount}</span>
                </Button>
              </div>
              {activeCommentSection === post.id && (
                <div className="w-full mt-4 space-y-4 pt-4 border-t">
                  {post.comments.map((comment, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <Avatar className="w-8 h-8 border"><AvatarFallback>{comment.author.charAt(0)}</AvatarFallback></Avatar>
                      <div className="bg-muted p-3 rounded-lg w-full">
                        <p className="font-semibold text-xs">{comment.author}</p>
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
