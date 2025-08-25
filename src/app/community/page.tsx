
'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { communityPosts as initialPosts } from '@/lib/placeholder-data';
import { Heart, MessageCircle, Send, Pencil, Mail, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

interface ChatSession {
  [artistName: string]: ChatMessage[];
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

function ContactDialog({ author, currentUser }: { author: string; currentUser: { artistName: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const allChatsRaw = localStorage.getItem('plume-sonore-chats');
      const allChats: ChatSession = allChatsRaw ? JSON.parse(allChatsRaw) : {};
      setChatHistory(allChats[author] || []);
    }
  }, [isOpen, author]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', text: message };
    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);
    setMessage('');
    setIsLoading(true);

    try {
      const result = await generateChatResponse({
        senderName: currentUser.artistName,
        recipientName: author,
        message: message,
      });

      const botMessage: ChatMessage = { sender: 'bot', text: result.response };
      const finalChatHistory = [...newChatHistory, botMessage];
      setChatHistory(finalChatHistory);

      // Save to localStorage
      const allChatsRaw = localStorage.getItem('plume-sonore-chats');
      const allChats: ChatSession = allChatsRaw ? JSON.parse(allChatsRaw) : {};
      allChats[author] = finalChatHistory;
      localStorage.setItem('plume-sonore-chats', JSON.stringify(allChats));

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
          <DialogTitle>Conversation avec {author}</DialogTitle>
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
                className={cn(
                  'flex items-end gap-2',
                  chat.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {chat.sender === 'bot' && (
                   <Avatar className="h-8 w-8">
                     <AvatarFallback>{author.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[75%] rounded-lg p-3 text-sm',
                    chat.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {chat.text}
                </div>
                 {chat.sender === 'user' && (
                   <Avatar className="h-8 w-8">
                     <AvatarFallback>{currentUser.artistName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                  <Avatar className="h-8 w-8">
                      <AvatarFallback>{author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg">
                      <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
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
            <Button onClick={handleSendMessage} disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCommentSection, setActiveCommentSection] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [currentUser, setCurrentUser] = useState({ artistName: 'Artiste Anonyme' });
  
  useEffect(() => {
    const user = localStorage.getItem('plume-sonore-user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    const storedPosts = localStorage.getItem('plume-sonore-posts');
    setPosts(storedPosts ? JSON.parse(storedPosts) : initialPosts);
  }, []);

  const updatePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
    localStorage.setItem('plume-sonore-posts', JSON.stringify(newPosts));
  }

  const toggleLike = (id: number) => {
    const newPosts = posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked,
          };
        }
        return post;
      });
    updatePosts(newPosts);
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

    const newPosts = posts.map((post) => {
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
      });
    updatePosts(newPosts);
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
    updatePosts([newPost, ...posts]);
  };
  
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
                  {post.author !== currentUser.artistName && <ContactDialog author={post.author} currentUser={currentUser} />}
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
