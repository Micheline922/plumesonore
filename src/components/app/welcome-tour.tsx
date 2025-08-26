
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Check, NotebookPen, Sparkles, GraduationCap, Users, Mic, Library } from 'lucide-react';
import { useRouter } from 'next/navigation';

const tourSteps = [
  {
    icon: NotebookPen,
    title: "L'Atelier d'Écriture",
    description:
      "C'est ici que vos idées prennent vie. Un espace simple et sans distraction pour écrire vos textes, poèmes, ou paroles.",
    link: '/writing-pad',
  },
  {
    icon: Library,
    title: 'Mes Créations',
    description:
      'Toutes vos œuvres sont sauvegardées et organisées ici. Retrouvez et modifiez facilement vos textes et enregistrements.',
    link: '/my-creations',
  },
  {
    icon: Sparkles,
    title: "L'Assistant IA",
    description:
      "En panne d'inspiration ? Notre IA est là pour vous aider avec des rimes, des idées de thèmes, ou pour vous donner un feedback constructif sur vos textes.",
    link: '/ai-tools',
  },
  {
    icon: GraduationCap,
    title: 'Les Parcours de Progression',
    description:
      "Améliorez votre art grâce à des leçons et des défis conçus pour vous faire progresser, que vous soyez débutant ou confirmé.",
    link: '/learning',
  },
  {
    icon: Users,
    title: 'La Communauté',
    description:
      "Partagez vos créations, recevez des avis bienveillants et collaborez avec d'autres artistes passionnés.",
    link: '/community',
  },
  {
    icon: Mic,
    title: 'La Scène Virtuelle',
    description:
      "Le micro est à vous. Entraînez-vous à déclamer vos textes, enregistrez vos performances et préparez-vous pour la scène.",
    link: '/stage',
  },
];

interface WelcomeTourProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish: () => void;
}

export function WelcomeTour({ open, onOpenChange, onFinish }: WelcomeTourProps) {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (step < tourSteps.length - 1) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleGoTo = () => {
    const link = tourSteps[step].link;
    onFinish();
    router.push(link);
  };

  const currentStep = tourSteps[step];
  const Icon = currentStep.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-8 w-8" />
              </div>
          </div>
          <DialogTitle className="text-center font-headline text-2xl">
            {step === 0 ? 'Bienvenue sur Plume Sonore !' : currentStep.title}
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            {step === 0
              ? "Suivez ce guide rapide pour découvrir comment nous allons transformer votre inspiration en performance."
              : currentStep.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center items-center gap-2 my-4">
            {tourSteps.map((_, index) => (
                <div key={index} className={`h-2 w-2 rounded-full transition-all ${index === step ? 'w-4 bg-primary' : 'bg-muted'}`} />
            ))}
        </div>

        <DialogFooter className="sm:justify-between flex-col-reverse sm:flex-row gap-2">
          {step > 0 ? (
            <Button variant="ghost" onClick={handlePrev}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
            </Button>
          ) : <div />}

          <div className='flex gap-2'>
            <Button variant="outline" onClick={handleGoTo}>
                Explorer
            </Button>
            {step < tourSteps.length - 1 ? (
                <Button onClick={handleNext}>
                Suivant <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            ) : (
                <Button onClick={onFinish}>
                Terminer <Check className="ml-2 h-4 w-4" />
                </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
