// FICHIER: components/layout/ConsultingSidebar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, MapPin, Users, Briefcase, 
  ShieldCheck, Network, ChevronRight, UserPlus, 
  Sparkles, Laptop, Mail, Phone, ArrowUpRight,
  CheckCircle2, Award, Globe2, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

// --- DONNÉES STRUCTURÉES ---
const COMPANY_INFO = {
  name: "Consulting Cabinet ",
  tagline: "Cabinet de Today's Africa Consulting Group",
  positions: "12 postes ouverts",
  locations: ["Yaoundé", "Moscou"],
  founded: "2020",
  employees: "50+ experts"
};

const LEADERSHIP = [
  { name: "Cécile M. BOKALLI", role: "Directrice Générale Yaoundé", loc: "Yaoundé", avatar: "CB" },
  { name: "Ingrida KIM", role: "Directrice Générale Moscou", loc: "Moscou", avatar: "IK" }
];

const DEPARTMENTS = [
  { 
    icon: Network, 
    name: "Intelligence & Analyse", 
    teams: ["Desk Afrique", "Recherche BRICS", "Intelligence de Marché"],
    hiring: true
  },
  { 
    icon: Sparkles, 
    name: "Contenu & Marketing", 
    teams: ["Éditorial", "Stratégie Digitale", "Design de Marque"],
    hiring: true
  },
  { 
    icon: ShieldCheck, 
    name: "Juridique & Conformité", 
    teams: ["Droit des Affaires", "Affaires Internationales"],
    hiring: false
  },
  { 
    icon: Laptop, 
    name: "Technologie & Data", 
    teams: ["Développement", "Data Science", "Cybersécurité"],
    hiring: true
  }
];

const BENEFITS = [
  "Télétravail prioritaire",
  "Salaire compétitif",
  "Exposition internationale",
  "Formation continue",
  "Équipe multiculturelle",
  "Projets stratégiques"
];


export default function ConsultingSidebar() {
  const [expandedDept, setExpandedDept] = useState<number | null>(null);

  return (
    <aside className="w-full h-full overflow-hidden flex flex-col gap-5 p-0 bg-transparent">
        
      {/* --- 1. EN-TÊTE ENTREPRISE --- */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-[#3E7B52] hover:bg-[#326342] rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 size={28} className="text-white" strokeWidth={2}/>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              {COMPANY_INFO.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {COMPANY_INFO.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex ml-0 items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin size={14} className="text-emerald-600 dark:text-emerald-500"/>
            <span className="text-xs">{COMPANY_INFO.locations.join(" • ")}</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-zinc-800 to-transparent"/>

      {/* --- 2. LEADERSHIP --- */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <Users size={14}/>
          Direction Générale
        </h3>
        
        <div className="space-y-2">
          {LEADERSHIP.map((leader, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{leader.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{leader.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{leader.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-zinc-800 to-transparent"/>

      {/* --- 4. AVANTAGES --- */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Pourquoi Nous Rejoindre
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {BENEFITS.map((benefit, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
              <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0"/>
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- 5. CTA --- */}
      <Link href="/consulting-cabinet#apply" className="block">
        <Button className="w-full h-12 bg-[#3E7B52] hover:bg-[#326342] text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group">
          <UserPlus size={18} className="group-hover:scale-110 transition-transform"/>
          <span className="font-semibold">Postuler chez Today's Africa</span>
        </Button>
      </Link>

      {/* --- 6. CONTACT --- */}
      <div className="pt-3 border-t border-gray-200 dark:border-zinc-800">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <a href="mailto:careers@tacg.com" className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
            <Mail size={12}/>
            <span>todays@blog.com</span>
          </a>
          <div className="w-px h-4 bg-gray-300 dark:bg-zinc-700"/>
          <a href="tel:+237" className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">
            <Phone size={12}/>
            <span>699 888 777</span>
          </a>
        </div>
      </div>

    </aside>
  );
}