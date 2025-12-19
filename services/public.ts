// FICHIER: services/public.ts
import { APP_CONFIG } from "@/lib/constant";
import { ArticleReadDto, Rubrique } from "@/types/article"; // <--- Import absolu correct
import { PageResponse } from "@/types/dashboard";

// On cible les routes publiques pour éviter les problèmes de Token sur la home
const API_PUBLIC = `${APP_CONFIG.apiUrl}/public`; 
const API_BASE = APP_CONFIG.apiUrl; 

export const PublicService = {
  
  // === RUBRIQUES ===
  getRubriques: async (): Promise<Rubrique[]> => {
    try {
      const res = await fetch(`${API_PUBLIC}/rubriques`, { next: { revalidate: 60 } });
      if (!res.ok) throw new Error("Erreur fetch rubriques");
      return await res.json();
    } catch (e) {
      console.error("❌ Erreur Rubriques:", e);
      return [];
    }
  },

  getArticlesByRubrique: async (id: number): Promise<ArticleReadDto[]> => {
    try {
        const res = await fetch(`${API_PUBLIC}/rubriques/${id}/articles`, { cache: 'no-store' });
        if (!res.ok) return [];
        return await res.json();
    } catch(e) {
        return [];
    }
  },

  // === ARTICLES RÉCENTS (Correction Majeure ici) ===
  getAllArticles: async (page = 0, size = 6): Promise<PageResponse<ArticleReadDto>> => {
    console.log(`🌐 [API] GET Articles Récents`);
    
    // STRATÉGIE : On tente l'endpoint Public Paginé d'abord (Plus performant)
    // Si tu veux ABSOLUMENT '/articles/all', remplace l'url ci-dessous par `${API_BASE}/articles/all`
    const endpoint = `${API_PUBLIC}/articles?page=${page}&size=${size}&sort=datePublication,desc`;

    try {
      const res = await fetch(endpoint, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      
      const data = await res.json();

      // --- CORRECTION DE FORMAT (Array vs Page) ---
      // Si l'API renvoie un tableau simple [art1, art2] (cas de /articles/all)
      if (Array.isArray(data)) {
         console.log("⚠️ API a renvoyé un tableau brut, conversion en Page...");
         // On simule une page pour que le composant ne casse pas
         return {
            content: data.slice(0, size), // On limite nous-mêmes
            totalElements: data.length,
            totalPages: Math.ceil(data.length / size)
         };
      }
      
      // Sinon c'est déjà paginé (Standard Spring Data) { content: [...], totalElements: ... }
      return data;

    } catch (e) {
      console.error("❌ Erreur Fetch All Articles:", e);
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  },

  getFeaturedArticles: async (): Promise<ArticleReadDto[]> => {
    try {
        const res = await fetch(`${API_PUBLIC}/articles/featured`, { next: { revalidate: 120 } });
        if(!res.ok) return [];
        const data = await res.json();
        // Sécurité si ça renvoie une Page au lieu d'une List
        return Array.isArray(data) ? data : (data.content || []);
    } catch (e) {
        return [];
    }
  },

  getArticleById: async (id: number): Promise<ArticleReadDto | null> => {
    try {
      const res = await fetch(`${API_PUBLIC}/articles/${id}`, { cache: 'no-store' });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Erreur serveur");
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  }
};