
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Lightbulb, Mic, NotebookPen, Sparkles, Users, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WelcomeTour } from '@/components/app/welcome-tour';

const featureCards = [
  {
    title: "Atelier d'écriture",
    description: "Laissez libre cours à votre créativité dans notre bloc-notes intelligent.",
    href: '/writing-pad',
    icon: NotebookPen,
    cta: 'Commencer à écrire',
  },
  {
    title: 'Mes Créations',
    description: 'Retrouvez toutes vos œuvres, textes et enregistrements.',
    href: '/my-creations',
    icon: Library,
    cta: 'Voir mes créations',
  },
  {
    title: 'Assistant IA',
    description: "Bloqué ? Notre IA vous suggère rimes, figures de style et idées.",
    href: '/ai-tools',
    icon: Sparkles,
    cta: 'Débloquer mon inspiration',
  },
  {
    title: 'Parcours de Progression',
    description: "Ateliers guidés et défis pour perfectionner votre art.",
    href: '/learning',
    icon: GraduationCap,
    cta: 'Voir les parcours',
  },
  {
    title: 'Communauté',
    description: 'Partagez vos textes, recevez des retours et collaborez.',
    href: '/community',
    icon: Users,
    cta: 'Rejoindre la communauté',
  },
  {
    title: 'Scène Virtuelle',
    description: "Entraînez-vous à la performance et recevez des applaudissements.",
    href: '/stage',
    icon: Mic,
    cta: 'Monter sur scène',
  },
];

export default function DashboardPage() {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem('plume-sonore-tour-completed');
    if (!tourCompleted) {
      setShowTour(true);
    }
  }, []);

  const handleTourComplete = () => {
    localStorage.setItem('plume-sonore-tour-completed', 'true');
    setShowTour(false);
  };


  return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <WelcomeTour open={showTour} onOpenChange={setShowTour} onFinish={handleTourComplete} />
        <div className="flex items-center">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Bienvenue, Artiste !</h1>
            <p className="text-muted-foreground mt-1">
              Votre studio d'écriture vous attend. Que voulez-vous créer aujourd'hui ?
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feature) => (
            <Link key={feature.href} href={feature.href} prefetch={true} className="flex">
              <Card className="flex flex-col w-full hover:border-primary transition-colors">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="font-headline">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button asChild className="w-full" tabIndex={-1}>
                    <div>
                      {feature.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
  );
}
