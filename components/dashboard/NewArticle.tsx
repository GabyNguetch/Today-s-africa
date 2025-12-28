// FICHIER: components/dashboard/NewArticle.tsx - VERSION CORRIGÉE

"use client";

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Send, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button'; 
import { ArticleService } from '@/services/article';
import { useAuth } from '@/context/AuthContext';
import ArticleSettings from './new-article/ArticleSettings';
import Toolbar from './new-article/Toolbar';
import EditorContentComp from './new-article/EditorContent';
import { ArticlePayloadDto, BlocContenuDto } from '@/types/article';

interface NewArticleProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  editArticleId?: number | null; 
}

export default function NewArticle({ onSuccess, editArticleId, onCancel }: NewArticleProps) {
  
  const { user } = useAuth();
  
  // === STATE ===
  const [articleId, setArticleId] = useState<number | null>(null);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [rubriqueId, setRubriqueId] = useState<number | null>(null);
  const [region, setRegion] = useState("GLOBAL");
  const [coverImageId, setCoverImageId] = useState<string | number | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [uiState, setUiState] = useState({ 
    loading: false, 
    saving: false, 
    error: null as string | null 
  });

  // === CHARGEMENT MODE ÉDITION ===
  useEffect(() => {
    if (editArticleId) {
      setUiState(p => ({ ...p, loading: true }));
      
      ArticleService.getById(editArticleId)
        .then(article => {
          setArticleId(article.id);
          setTitre(article.titre || "");
          setDescription(article.description || "");
          setRubriqueId(article.rubriqueId || null);
          setRegion(article.region || "GLOBAL");
          setCoverImageUrl(article.imageCouvertureUrl || null);
          setCoverImageId(article.imageCouvertureId || null);

          // Reconstruction HTML
          if (article.blocsContenu && Array.isArray(article.blocsContenu)) {
            const sorted = [...article.blocsContenu].sort((a, b) => a.ordre - b.ordre);
            
            let contentHtml = "";
            sorted.forEach(bloc => {
              if (bloc.type === 'IMAGE') {
                const dataId = bloc.mediaId ? `data-media-id="${bloc.mediaId}"` : "";
                const imgSrc = bloc.url || bloc.contenu || "";
                contentHtml += `<img src="${imgSrc}" alt="${bloc.altText || ''}" title="${bloc.legende || ''}" ${dataId} />`;
              } else if (bloc.type === 'CITATION') {
                contentHtml += `<blockquote>${bloc.contenu}</blockquote>`;
              } else if (bloc.type === 'TEXTE') {
                contentHtml += bloc.contenu;
              }
            });

            if (editorInstance && !editorInstance.isDestroyed) {
              editorInstance.commands.setContent(contentHtml);
            } else {
              setHtmlContent(contentHtml);
            }
          }
        })
        .catch(() => setUiState(p => ({ ...p, error: "Erreur chargement" })))
        .finally(() => setUiState(p => ({ ...p, loading: false })));
    }
  }, [editArticleId, editorInstance]);

// ✅ FONCTION PARSE: DOM -> BLOC OBJECTS
  const parseEditorContent = (html: string): BlocContenuDto[] => {
     if (typeof window === 'undefined') return [];
     const parser = new DOMParser();
     const doc = parser.parseFromString(html, 'text/html');
     const nodes = Array.from(doc.body.children);
     const blocs: BlocContenuDto[] = [];
     let counter = 0;

     // Fonction locale de nettoyage string
     const str = (v: any) => (v ? String(v).trim() : "");

     nodes.forEach((node) => {
         // --- CAS IMAGE ---
         if (node.tagName === 'IMG' || node.querySelector('img')) {
             const img = (node.tagName === 'IMG' ? node : node.querySelector('img')) as HTMLImageElement;
             const src = img.getAttribute('src');
             // Si pas de source, on ignore
             if(!src) return;

             blocs.push({
                 type: 'IMAGE',
                 ordre: counter++,
                 url: src,
                 contenu: src,
                 altText: str(img.getAttribute('alt')),
                 legende: str(img.getAttribute('title')),
                 // Récupération sécurisée du UUID stocké
                 mediaId: str(img.getAttribute('data-media-id')) || null, 
                 articleId: 0
             });
             return;
         }

         // --- CAS CITATION ---
         if (node.tagName === 'BLOCKQUOTE') {
             blocs.push({
                 type: 'CITATION',
                 ordre: counter++,
                 contenu: node.innerHTML,
                 url: "", altText: "", legende: "", mediaId: null, articleId: 0
             });
             return;
         }

         // --- CAS TEXTE STANDARD ---
         const txt = node.textContent?.trim();
         // On sauvegarde le bloc s'il a du texte ou du contenu HTML significatif
         if (txt || node.innerHTML.includes('<')) {
            blocs.push({
                type: 'TEXTE',
                ordre: counter++,
                contenu: node.outerHTML,
                url: "", altText: "", legende: "", mediaId: null, articleId: 0
            });
         }
     });
     return blocs;
  };



 // === SAUVEGARDE ===
  const handleSave = async (isSubmission: boolean) => {
    // Validations (inchangées)
    if (!titre.trim()) return setUiState(p => ({ ...p, error: "Titre requis" }));
    if (!description.trim()) return setUiState(p => ({ ...p, error: "Description requise" }));
    if (!rubriqueId) return setUiState(p => ({ ...p, error: "Rubrique requise" }));
    if (!user?.id) return setUiState(p => ({ ...p, error: "Session expirée" }));

    setUiState(p => ({ ...p, saving: true, error: null }));

    try {
      const blocksPayload = parseEditorContent(htmlContent);
      if (blocksPayload.length === 0) throw new Error("Article vide");

      // ID Cover Image (Int32 pour article, attention)
      // Si l'article prend un Int pour cover, on garde parseInt. Si c'est UUID, on change.
      // D'après swagger "ArticleCreateDto", imageCouvertureId est Int32. On garde ça comme avant.
      let finalCoverId: number | null = null;
      if (coverImageId) {
         if (typeof coverImageId === 'string') finalCoverId = parseInt(coverImageId);
         else finalCoverId = coverImageId;
      }

      const payload: ArticlePayloadDto = {
        titre: titre.trim(),
        description: description.trim(),
        rubriqueId: rubriqueId,
        auteurId: user.id,
        imageCouvertureId: finalCoverId, 
        region: region,
        visible: false,
        statut: isSubmission ? 'PENDING_REVIEW' : 'DRAFT',
        tagIds: [],
        blocsContenu: blocksPayload // Contient des UUID strings dans mediaId
      };

      if (articleId) {
        await ArticleService.update(articleId, payload);
        if(isSubmission) await ArticleService.submit(articleId, user.id);
      } else {
        const created = await ArticleService.create(payload);
        setArticleId(created.id);
        if(isSubmission) await ArticleService.submit(created.id, user.id);
      }
      
      alert(isSubmission ? "Envoyé pour validation !" : "Brouillon sauvegardé !");
      if (onSuccess) onSuccess();

    } catch (e: any) {
      setUiState(p => ({ ...p, error: e.message }));
    } finally {
      setUiState(p => ({ ...p, saving: false }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-32 animate-in fade-in">
      
      {/* BARRE DU HAUT */}
      <div className="sticky top-0 z-40 bg-[#FBFBFB] dark:bg-black py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={onCancel} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold dark:text-white">
              {articleId ? `Édition: ${titre.substring(0, 20)}...` : "Nouvel Article"}
            </h2>
            {uiState.error && (
              <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1">
                <AlertTriangle size={12} /> {uiState.error}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline"
            disabled={uiState.saving}
            onClick={() => handleSave(false)}
            className="h-10 bg-white dark:bg-zinc-900 p-3 border-gray-300"
          >
            {uiState.saving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} className="mr-2" />
            )}
            Brouillon
          </Button>
          <Button 
            disabled={uiState.saving}
            onClick={() => {
              if (confirm("Confirmer la soumission pour validation ?")) {
                handleSave(true);
              }
            }}
            className="h-10 bg-[#3E7B52] p-3 text-white hover:bg-[#2d5a3c]"
          >
            <Send size={16} className="mr-2" /> Soumettre
          </Button>
        </div>
      </div>

      {/* CHARGEMENT */}
      {uiState.loading ? (
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#3E7B52]" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ÉDITEUR CENTRAL */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[80vh]">
              <Toolbar editor={editorInstance} />
              <EditorContentComp 
                setEditorRef={setEditorInstance} 
                onChange={setHtmlContent} 
                initialContent={htmlContent}
              />
            </div>
          </div>

          {/* SIDEBAR RÉGLAGES */}
          <div className="lg:col-span-1">
            <ArticleSettings 
              titre={titre} 
              setTitre={setTitre}
              description={description} 
              setDescription={setDescription}
              rubriqueId={rubriqueId} 
              setRubriqueId={setRubriqueId}
              coverImageId={coverImageId} 
              setCoverImageId={setCoverImageId}
              coverImageUrl={coverImageUrl} 
              setCoverImageUrl={setCoverImageUrl}
              region={region} 
              setRegion={setRegion}
            />
            
            {/* Bloc info */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
              <p className="flex items-center gap-2 font-bold mb-1">
                <AlertTriangle size={12} /> Note Importante
              </p>
              L'IA générera automatiquement des mots-clés lors de la soumission basés sur votre contenu riche.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}