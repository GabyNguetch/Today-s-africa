"use client";

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Installation nécessaire: npm install framer-motion
import { X, ChevronRight, Check, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

// --- CONFIGURATION DU CONTENU (DATA) ---
// IDs doivent correspondre aux IDs ajoutés dans le HTML des pages
export const TOUR_STEPS = {
  REDACTEUR: [
    {
      targetId: 'nav-dashboard-new-article',
      title: 'Commencez ici !',
      content: 'C\'est ici que vous rédigez vos chefs-d\'œuvre. Cliquez pour accéder à l\'éditeur.',
      position: 'right' as const,
    },
    {
      targetId: 'dashboard-stats-card',
      title: 'Suivez votre impact',
      content: 'Analysez les vues et commentaires de vos articles en temps réel.',
      position: 'bottom' as const,
    },
    {
        targetId: 'btn-action-profile',
        title: 'Gérez votre profil',
        content: 'Mettez à jour vos infos et notifications ici.',
        position: 'bottom' as const, // Adapté mobile
    }
  ],
  ADMIN: [
    {
        targetId: 'nav-dashboard-articles',
        title: 'Flux de Validation',
        content: 'Validez, publiez ou rejetez les articles soumis par votre équipe.',
        position: 'right' as const,
    },
    {
        targetId: 'nav-dashboard-users',
        title: 'Gestion d\'équipe',
        content: 'Ajoutez de nouveaux rédacteurs et supervisez les comptes.',
        position: 'right' as const,
    }
  ],
  USER: [
    {
        targetId: 'nav-categories',
        title: 'Explorez par thèmes',
        content: 'Politique, Économie... Filtrez l\'actualité selon vos intérêts.',
        position: 'bottom' as const,
    },
    {
        targetId: 'cta-subscribe',
        title: 'Ne manquez rien',
        content: 'Créez un compte pour commenter et sauvegarder vos lectures.',
        position: 'top' as const,
    }
  ]
};

type Step = { targetId: string; title: string; content: string; position: 'top'|'bottom'|'left'|'right' };

// --- LE COMPOSANT ---
export const OnboardingTour = () => {
  const { user } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  
  // Clé de stockage unique par rôle pour ne pas répéter le tour
  const storageKey = user ? `tody_tour_done_${user.role}` : `tody_tour_done_GUEST`;
  
  // Sélection des étapes selon le rôle
  const steps: Step[] = user 
    ? (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? TOUR_STEPS.ADMIN : TOUR_STEPS.REDACTEUR)
    : TOUR_STEPS.USER;

  useEffect(() => {
    // Vérification : A-t-on déjà fait le tour ?
    const isDone = localStorage.getItem(storageKey);
    // Petit délai pour laisser le UI se charger
    const timer = setTimeout(() => {
        if (!isDone) setIsActive(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [storageKey]);

  useEffect(() => {
    if (!isActive) return;

    const updatePosition = () => {
        const el = document.getElementById(steps[stepIndex]?.targetId);
        if (el) {
            setTargetRect(el.getBoundingClientRect());
            // Scroll smooth vers l'élément
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Si l'élément n'est pas trouvé (ex: mobile menu fermé), on skip ou on attend
            // Pour la démo simple : on arrête
            console.warn(`Target ${steps[stepIndex]?.targetId} not found`);
        }
    };

    updatePosition();
    // Écouter le resize
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [stepIndex, isActive, steps]);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsActive(false);
    localStorage.setItem(storageKey, 'true');
  };

  if (!isActive || !targetRect || steps.length === 0) return null;

  // Calcul Position Popover
  const popoverStyles: React.CSSProperties = {
    position: 'fixed',
    zIndex: 100,
  };

  // Logique simple de positionnement (améliorable avec floating-ui)
  const margin = 15;
  const currentStep = steps[stepIndex];
  
  if (currentStep.position === 'right') {
      popoverStyles.top = targetRect.top;
      popoverStyles.left = targetRect.right + margin;
  } else if (currentStep.position === 'bottom') {
      popoverStyles.top = targetRect.bottom + margin;
      popoverStyles.left = targetRect.left;
  } 
  // ... autres positions à implémenter si besoin

  // Création d'un portail pour "sortir" du flux HTML normal et être au dessus de tout
  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none">
        
      {/* 1. Backdrop (Fait le noir autour sauf sur l'élément) */}
      {/* SVG Mask Techique pour faire un trou propre */}
      <svg className="absolute inset-0 w-full h-full pointer-events-auto">
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect 
                x={targetRect.left - 5} 
                y={targetRect.top - 5} 
                width={targetRect.width + 10} 
                height={targetRect.height + 10} 
                rx="8" // Border radius du trou
                fill="black" 
            />
          </mask>
        </defs>
        <rect 
            x="0" y="0" width="100%" height="100%" 
            className="fill-black/60 dark:fill-black/80 transition-all duration-500 ease-out" 
            mask="url(#tour-mask)" 
        />
      </svg>

      {/* 2. Spotlight Border Animé (Anneau Vert autour de la cible) */}
      <motion.div
        layout
        className="absolute rounded-lg border-2 border-[#3E7B52] dark:border-[#13EC13] pointer-events-none shadow-[0_0_30px_-5px_rgba(62,123,82,0.6)] dark:shadow-[0_0_30px_-5px_rgba(19,236,19,0.5)]"
        initial={false}
        animate={{
            top: targetRect.top - 5,
            left: targetRect.left - 5,
            width: targetRect.width + 10,
            height: targetRect.height + 10,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {/* 3. La Carte TIP (Interactive) */}
      <AnimatePresence mode='wait'>
        <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={popoverStyles}
            className="pointer-events-auto w-80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-gray-200 dark:border-zinc-700 p-5 rounded-2xl shadow-2xl relative"
        >
            {/* Déco */}
            <div className="absolute -top-3 -left-3 bg-gradient-to-br from-[#3E7B52] to-green-600 dark:from-[#13EC13] dark:to-green-600 w-8 h-8 rounded-lg rotate-12 flex items-center justify-center text-white shadow-lg">
                <Sparkles size={16} />
            </div>

            <button 
                onClick={handleClose} 
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
            >
                <X size={16} />
            </button>

            <div className="mt-2 space-y-2">
                <h4 className="font-extrabold text-lg text-gray-900 dark:text-white leading-tight">
                    {currentStep.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-zinc-300 leading-relaxed">
                    {currentStep.content}
                </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex gap-1">
                    {steps.map((_, i) => (
                        <div 
                            key={i} 
                            className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                i === stepIndex ? "bg-[#3E7B52] dark:bg-[#13EC13] w-4" : "bg-gray-300 dark:bg-zinc-700"
                            )} 
                        />
                    ))}
                </div>
                
                <button
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-[#111] dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                >
                    {stepIndex === steps.length - 1 ? 'Terminer' : 'Suivant'}
                    {stepIndex === steps.length - 1 ? <Check size={14}/> : <ChevronRight size={14}/>}
                </button>
            </div>
        </motion.div>
      </AnimatePresence>

    </div>
  , document.body);
};