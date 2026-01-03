// FICHIER: components/dashboard/new-article/ArticleSettings.tsx - UPLOAD CORRIGÉ

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { 
  UploadCloud, ImageIcon, Loader2, AlertCircle, Plus, 
  ChevronDown, Check, Search, X, RefreshCw, 
  CornerDownRight, Globe, MapPin, Sparkles, Trash2
} from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";
import { ArticleService } from "@/services/article";
import { Rubrique } from "@/types/article";

// RÉGIONS
const TARGET_REGIONS = [
  { id: "GLOBAL", label: "🌍 Afrique (Global)" },
  { id: "AFRIQUE_OUEST", label: "📍 Afrique de l'Ouest" },
  { id: "AFRIQUE_CENTRALE", label: "📍 Afrique Centrale" },
  { id: "AFRIQUE_EST", label: "📍 Afrique de l'Est" },
  { id: "AFRIQUE_NORD", label: "📍 Afrique du Nord" },
  { id: "AFRIQUE_SUD", label: "📍 Afrique Australe" },
];

interface ArticleSettingsProps {
  titre: string;
  setTitre: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  rubriqueId: number | null;
  setRubriqueId: (v: number) => void;
  coverImageId: string | number | null; 
  setCoverImageId: (v: string | number | null) => void; 
  coverImageUrl: string | null;
  setCoverImageUrl: (v: string | null) => void;
  region: string;
  setRegion: (v: string) => void;
}

export default function ArticleSettings(props: ArticleSettingsProps) {
  
  const [flatRubriques, setFlatRubriques] = useState<Rubrique[]>([]);
  const [isRubriqueLoading, setIsRubriqueLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Chargement rubriques
  useEffect(() => {
    loadRubriques();
  }, []);

  // --- LOGIQUE PREVIEW PAR ID (Cas Edition sans URL) ---
  // Si on charge un article existant, on a souvent juste l'ID au début, donc on fetch l'URL via getMedia
  useEffect(() => {
    // On fetch uniquement si on a un ID, pas d'URL et qu'on ne vient pas d'uploader
    if (props.coverImageId && !props.coverImageUrl && !isUploading) {
        console.log("🔄 Récupération de l'image de couverture depuis l'ID:", props.coverImageId);
        ArticleService.getMedia(props.coverImageId)
            .then(media => {
                console.log("🖼️ Media récupéré:", media);
                props.setCoverImageUrl(media.urlAcces);
            })
            .catch(err => console.warn("Erreur chargement preview image", err));
    }
  }, [props.coverImageId]); 

  const loadRubriques = async () => {
    setIsRubriqueLoading(true);
    try {
      const tree = await ArticleService.getRubriquesTree();
      if (!Array.isArray(tree)) return;

      const flat: Rubrique[] = [];
      const flatten = (nodes: Rubrique[]) => {
        nodes.forEach(node => {
          if (node) {
            flat.push(node);
            if (node.enfants) flatten(node.enfants);
          }
        });
      };
      flatten(tree);
      setFlatRubriques(flat);
    } catch (e) { 
      console.error("❌ Erreur chargement rubriques", e);
    } finally { 
      setIsRubriqueLoading(false); 
    }
  };

  const handleCreateRubrique = async () => {
    if (!newName.trim()) return;
    setIsRubriqueLoading(true);
    try {
      const res = await ArticleService.createRubrique(newName);
      if (res && res.id) {
        props.setRubriqueId(res.id);
        setNewName("");
        setIsCreating(false);
        setIsDropdownOpen(false);
        loadRubriques();
      }
    } catch (e) { 
      alert("Erreur lors de la création de la rubrique."); 
    } finally { 
      setIsRubriqueLoading(false); 
    }
  };

  // --- 🔥 C'EST ICI QUE CA SE JOUE : UPLOAD HANDLER ---
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset UI
    setIsUploading(true);
    setUploadError(null);

    try {
        console.log("🚀 Start Cover Upload...");
        
        // 1. Upload
        const media = await ArticleService.uploadMedia(file);
        
        // 2. Set ID (si backend renvoie UUID ou int, on stocke)
        props.setCoverImageId(media.id); 
        
        // 3. Set URL de Preview immédiatement
        // C'est vital: l'UI réagit à props.coverImageUrl, pas à l'ID
        console.log("📸 Mise à jour UI avec URL:", media.urlAcces);
        props.setCoverImageUrl(media.urlAcces);

    } catch (err: any) {
        console.error("Erreur Component Upload:", err);
        setUploadError("Erreur serveur lors de l'envoi.");
    } finally {
        setIsUploading(false);
        e.target.value = ""; // Allow re-upload same file
    }
  };

  const handleRemoveCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.setCoverImageUrl(null);
    props.setCoverImageId(null);
  };

  // HELPERS
  const filteredRubriques = flatRubriques.filter(r => 
    (r.nom || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const currentRubriqueName = flatRubriques.find(r => r.id === props.rubriqueId)?.nom || "Sélectionner une rubrique";

  return (
    <div className="space-y-6 pb-24 animate-in fade-in sticky top-24">
      
      {/* === SECTION 1: ESSENTIELS === */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
        
        {/* Titre */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex justify-between">
            Titre Principal 
            <span className={cn(
              "font-mono",
              props.titre.length < 10 ? "text-red-500" :
              props.titre.length > 150 ? "text-orange-500" : "text-green-500"
            )}>
              {props.titre.length} / 200
            </span>
          </label>
          <input 
            type="text" 
            value={props.titre}
            onChange={e => props.setTitre(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-transparent text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-[#3E7B52]/20 focus:border-[#3E7B52] outline-none transition-all placeholder:text-gray-300"
            placeholder="Titre de l'article (min 10 caractères)..."
          />
          {props.titre.length > 0 && props.titre.length < 10 && (
            <p className="text-xs text-red-500 mt-1">Minimum 10 caractères requis</p>
          )}
        </div>
        
        {/* Description */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex justify-between">
            Résumé (Chapeau)
            <span className={cn(
              "font-mono",
              props.description.length < 50 ? "text-red-500" :
              props.description.length > 450 ? "text-orange-500" : "text-green-500"
            )}>
              {props.description.length} / 500
            </span>
          </label>
          <textarea 
            rows={4} 
            value={props.description}
            onChange={e => props.setDescription(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-transparent text-xs leading-relaxed dark:text-gray-300 focus:ring-2 focus:ring-[#3E7B52]/20 focus:border-[#3E7B52] outline-none resize-none placeholder:text-gray-300"
            placeholder="Ce résumé servira pour le référencement (min 50 caractères)..."
          />
          {props.description.length > 0 && props.description.length < 50 && (
            <p className="text-xs text-red-500 mt-1">Minimum 50 caractères requis</p>
          )}
        </div>

        {/* Tags auto */}
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Sparkles size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-400">
                Génération Auto de Tags
              </h4>
              <p className="text-[10px] text-blue-600 dark:text-blue-300/80 leading-snug mt-1">
                L'IA analysera votre contenu pour attribuer les tags pertinents lors de la validation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* === SECTION 2: IMAGE COUVERTURE === */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex justify-between">
            Image de Couverture
            {isUploading && <Loader2 size={12} className="animate-spin text-[#3E7B52]"/>}
        </label>
        
        {uploadError && (
          <div className="mb-2 p-2 bg-red-50 text-red-500 text-xs rounded flex items-center gap-2"><AlertCircle size={12}/>{uploadError}</div>
        )}

        <div className={cn(
          "relative w-full aspect-video border-2 border-dashed rounded-xl overflow-hidden flex flex-col items-center justify-center transition-all group",
          props.coverImageUrl ? "border-transparent bg-black" : "border-gray-200 dark:border-zinc-700 hover:border-[#3E7B52] cursor-pointer"
        )}>
           <input 
              type="file" 
              accept="image/*"
              onChange={handleCoverUpload}
              className="absolute inset-0 opacity-0 z-20 cursor-pointer w-full h-full"
              disabled={isUploading}
           />
           
           {isUploading ? (
              <div className="flex flex-col items-center text-[#3E7B52]">
                  <Loader2 size={24} className="animate-spin mb-2"/>
                  <span className="text-[10px] font-bold uppercase">Téléchargement...</span>
              </div>
           ) : props.coverImageUrl ? (
              <>
                 <Image src={props.coverImageUrl} alt="Cover" fill className="object-cover group-hover:opacity-50 transition-opacity" unoptimized/>
                 <button onClick={handleRemoveCover} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded z-30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                     <Trash2 size={14}/>
                 </button>
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                     <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm flex gap-2 items-center">
                        <UploadCloud size={12}/> Changer
                     </span>
                 </div>
              </>
           ) : (
               <div className="text-center text-gray-400">
                   <ImageIcon size={24} className="mx-auto mb-2 opacity-50"/>
                   <span className="text-[10px] font-bold uppercase">Cliquez pour ajouter</span>
               </div>
           )}
        </div>
      </div>

      {/* === SECTION 3: CIBLAGE === */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-5 z-20 relative">
        
        {/* RUBRIQUE */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Rubrique / Catégorie
            </label>
            <button 
              onClick={loadRubriques} 
              type="button" 
              className="text-gray-400 hover:text-[#3E7B52] transition-colors" 
              title="Rafraîchir"
            >
              <RefreshCw size={12} className={isRubriqueLoading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="relative">
            <button 
              type="button" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between p-3 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm text-left bg-gray-50 dark:bg-zinc-950 dark:text-white hover:border-[#3E7B52] transition-colors"
            >
              <span className="truncate font-bold text-gray-700 dark:text-gray-200">
                {currentRubriqueName}
              </span>
              <ChevronDown 
                size={14} 
                className={cn(
                  "text-gray-400 transition-transform", 
                  isDropdownOpen && "rotate-180"
                )} 
              />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-2xl max-h-64 flex flex-col mt-2 z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Filtre */}
                <div className="p-3 border-b dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 sticky top-0 z-10">
                  <div className="flex items-center bg-white dark:bg-zinc-900 border dark:border-zinc-700 px-3 rounded-lg h-9 focus-within:ring-1 focus-within:ring-[#3E7B52]">
                    <Search size={14} className="text-gray-400 mr-2" />
                    <input 
                      className="flex-1 bg-transparent text-xs p-1 outline-none dark:text-white" 
                      placeholder="Filtrer rubriques..." 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)}
                      autoFocus 
                    />
                  </div>
                </div>
                
                {/* Liste */}
                <div className="overflow-y-auto flex-1 p-1">
                  {filteredRubriques.map(rub => (
                    <button 
                      key={rub.id}
                      type="button"
                      onClick={() => { 
                        props.setRubriqueId(rub.id); 
                        setIsDropdownOpen(false); 
                      }}
                      className={cn(
                        "w-full px-3 py-2.5 text-xs text-left flex items-center gap-2 rounded-lg transition-all",
                        props.rubriqueId === rub.id 
                          ? "bg-green-50 text-[#3E7B52] font-bold dark:bg-green-900/20 dark:text-[#13EC13]" 
                          : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-zinc-800"
                      )}
                    >
                      {rub.parentId && <CornerDownRight size={10} className="text-gray-300 ml-2" />}
                      <span className={!rub.parentId ? "uppercase font-extrabold text-[10px]" : ""}>
                        {rub.nom}
                      </span>
                      {props.rubriqueId === rub.id && <Check size={14} className="ml-auto text-[#3E7B52]" />}
                    </button>
                  ))}
                </div>

                {/* Create */}
                <div className="p-2 border-t dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950">
                  {isCreating ? (
                    <div className="flex gap-2 items-center px-1">
                      <input 
                        value={newName} 
                        onChange={e => setNewName(e.target.value)} 
                        className="text-xs p-2 border rounded-lg flex-1 dark:bg-black dark:text-white focus:border-[#3E7B52] outline-none" 
                        placeholder="Nouvelle..."
                      />
                      <button 
                        onClick={handleCreateRubrique} 
                        className="p-2 bg-[#3E7B52] text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check size={14} />
                      </button>
                      <button 
                        onClick={() => setIsCreating(false)} 
                        className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsCreating(true)} 
                      className="w-full py-2 text-xs text-[#3E7B52] dark:text-[#13EC13] font-bold flex items-center justify-center gap-1.5 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    >
                      <Plus size={14} /> Ajouter
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RÉGION */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 block flex items-center gap-1">
            <MapPin size={12} className="text-[#3E7B52]" /> Zone Cible
          </label>
          <div className="relative">
            <select 
              value={props.region}
              onChange={(e) => props.setRegion(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-medium text-gray-700 dark:text-white outline-none cursor-pointer hover:border-[#3E7B52] focus:ring-2 focus:ring-[#3E7B52]/20 transition-all appearance-none"
            >
              {TARGET_REGIONS.map(reg => (
                <option key={reg.id} value={reg.id}>
                  {reg.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <Globe size={14} className="text-gray-300" />
            </div>
          </div>
          <p className="text-[9px] text-gray-400 mt-2 px-1">
            * La diffusion de l'article sera prioritaire dans la région sélectionnée.
          </p>
        </div>
      </div>
    </div>
  );
}