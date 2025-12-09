import React, { useState } from "react";
import { 
  Bold, Italic, Underline, Link as LinkIcon, List, AlignLeft, Image as ImageIcon, UploadCloud 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
// Icone locale pour select
import { ChevronDown } from "lucide-react"; 

interface NewArticleProps {
    onSuccess?: () => void; // Callback pour changer d'onglet après succès
}

export default function NewArticle({ onSuccess }: NewArticleProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Économie");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["Économie", "Politique", "Développement", "Gouvernance", "Technologie"];

  const handlePublish = () => {
    setIsSubmitting(true);
    // Simulation API
    setTimeout(() => {
      alert(`Article "${title}" publié !`);
      setIsSubmitting(false);
      setTitle("");
      setContent("");
      if (onSuccess) onSuccess(); // Redirection vers l'onglet 'Mes articles' par exemple
    }, 1500);
  };

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Créer un Nouvel Article</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400">Remplissez les champs ci-dessous pour publier du contenu.</p>
        </div>
        <div className="flex gap-3">
             <Button variant="outline" className="w-auto px-4 h-10 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 text-xs">
                Enregistrer brouillon
             </Button>
             <Button 
                onClick={handlePublish}
                disabled={isSubmitting}
                className="w-auto px-6 h-10 bg-[#3E7B52] dark:bg-[#13EC13] hover:bg-[#2f5f3e] dark:hover:bg-[#11d611] dark:text-black font-bold text-xs"
             >
                {isSubmitting ? "Publication..." : "Publier l'article"}
             </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Colonne Principale */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
             <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Titre</label>
             <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de l'article" 
                className="w-full h-11 px-4 rounded-lg bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-700 focus:border-[#3E7B52] focus:ring-1 focus:ring-[#3E7B52] outline-none transition text-sm text-gray-900 dark:text-white"
             />
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col h-[400px]">
             {/* Toolbar */}
             <div className="border-b border-gray-100 dark:border-zinc-800 p-2 bg-gray-50/50 dark:bg-zinc-800/50 flex gap-1">
                {[Bold, Italic, Underline, AlignLeft, List, LinkIcon, ImageIcon].map((Icon, i) => (
                    <button key={i} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 dark:text-gray-400 transition">
                        <Icon size={14} />
                    </button>
                ))}
             </div>
             <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Rédigez votre contenu..." 
                className="flex-1 w-full p-5 bg-transparent outline-none resize-none text-sm leading-relaxed text-gray-800 dark:text-gray-200"
             />
          </div>
        </div>

        {/* Colonne Options */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Catégorie</label>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                           key={cat}
                           onClick={() => setCategory(cat)}
                           className={cn(
                             "px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border",
                             category === cat
                               ? "bg-[#3E7B52]/10 border-[#3E7B52] text-[#3E7B52] dark:bg-[#13EC13]/10 dark:border-[#13EC13] dark:text-[#13EC13]"
                               : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700"
                           )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
             <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                Média
             </label>
             <div className="border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-lg h-32 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                <UploadCloud size={20} className="text-gray-400 mb-2"/>
                <span className="text-[10px] text-gray-500">Uploader une image</span>
             </div>
            </div>
        </div>

      </div>
    </div>
  );
}