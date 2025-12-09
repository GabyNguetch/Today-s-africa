// FICHIER: app/dashboard/new-article/page.tsx
"use client";

import React, { useState } from "react";
import { 
  Bold, Italic, Underline, Link as LinkIcon, List, AlignLeft, Image as ImageIcon, UploadCloud 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export default function NewArticlePage() {
  // États du formulaire
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Économie");
  const [country, setCountry] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Catégories disponibles (Issues du design)
  const categories = [
    "Économie", "Politique", "Développement", "Gouvernance", "Technologie"
  ];

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation de publication
    setTimeout(() => {
      alert(`Article "${title}" publié avec succès dans la catégorie ${category} !`);
      // Ici, dans une vraie app, on enverrait les data au backend
      setIsSubmitting(false);
      // Reset form
      setTitle("");
      setContent("");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#111] dark:text-white">
          Créer un Nouvel Article
        </h1>
        <div className="flex gap-3">
             <Button variant="outline" className="w-auto px-6 h-10 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300">
                Brouillon
             </Button>
             <Button 
                onClick={handlePublish}
                disabled={isSubmitting}
                className="w-auto px-8 h-10 bg-[#3E7B52] dark:bg-[#13EC13] hover:bg-[#2f5f3e] dark:hover:bg-[#11d611] dark:text-black font-bold"
             >
                {isSubmitting ? "Publication..." : "Publier"}
             </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- COLONNE GAUCHE (Formulaire Principal) --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Bloc Titre */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
             <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Titre de l'Article
             </label>
             <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex: L'Avenir de la Technologie en Afrique" 
                className="w-full h-12 px-4 rounded-lg bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-zinc-700 focus:border-[#3E7B52] focus:ring-1 focus:ring-[#3E7B52] outline-none transition text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
             />
          </div>

          {/* Bloc Editeur Texte (WYSIWYG simulé) */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col h-[500px]">
             {/* Toolbar */}
             <div className="border-b border-gray-100 dark:border-zinc-800 p-3 bg-gray-50/50 dark:bg-black/20 flex gap-2 overflow-x-auto">
                <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition"><Bold size={16} /></button>
                <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition"><Italic size={16} /></button>
                <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition"><Underline size={16} /></button>
                <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-2 self-center"></div>
                <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition"><AlignLeft size={16} /></button>
                <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition"><List size={16} /></button>
                <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-2 self-center"></div>
                <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition"><LinkIcon size={16} /></button>
                <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition"><ImageIcon size={16} /></button>
             </div>
             
             {/* Textarea */}
             <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Commencez à rédiger votre article ici..." 
                className="flex-1 w-full p-6 bg-transparent outline-none resize-none text-sm leading-relaxed text-gray-800 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-600"
             />
          </div>

          {/* Bloc Upload Image */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
             <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                Image/Vidéo à la Une
             </label>
             <div className="border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition group">
                <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-400 group-hover:text-[#3E7B52] transition mb-3">
                   <UploadCloud size={24} />
                </div>
                <p className="text-sm font-semibold text-[#3E7B52] dark:text-[#13EC13] mb-1">
                   Télécharger un fichier <span className="text-gray-400 dark:text-gray-500 font-normal">ou glisser-déposer</span>
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF jusqu'à 10MB</p>
             </div>
          </div>

        </div>

        {/* --- COLONNE DROITE (Métadonnées) --- */}
        <div className="space-y-8">
            
            {/* Catégories Tags */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                    Catégorie
                </label>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                           key={cat}
                           onClick={() => setCategory(cat)}
                           className={cn(
                             "px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                             category === cat
                               ? "bg-[#3E7B52]/10 border-[#3E7B52] text-[#3E7B52] dark:bg-[#13EC13]/10 dark:border-[#13EC13] dark:text-[#13EC13]"
                               : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700"
                           )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Select Pays */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                    Pays
                </label>
                <div className="relative">
                   <select 
                      className="w-full h-10 px-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-[#3E7B52] appearance-none cursor-pointer"
                      onChange={(e) => setCountry(e.target.value)}
                   >
                       <option value="">Sélectionnez un pays</option>
                       <option value="Cameroun">Cameroun</option>
                       <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                       <option value="Sénégal">Sénégal</option>
                       {/* Autres pays... */}
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}

// Icon helper needed only locally for the select dropdown arrow if not imported
import { ChevronDown } from "lucide-react";