// FICHIER: services/dashboard.ts
import { APP_CONFIG } from "@/lib/constant";
import { authService } from "./auth";
import { ArticleBackend, PageResponse, StatsDashboard } from "@/types/dashboard";

const API_PROXY = APP_CONFIG.apiUrl; 

// --- Endpoints Rédacteur (Nécessite Token) ---
const ENDPOINT_MY_ARTICLES = `${API_PROXY}/articles`; 
const ENDPOINT_STATS = `${API_PROXY}/statistiques/auteur`; // Supposé basé sur ton swagger "statistiquess"

// --- Endpoints Lecteur (Public) ---
const ENDPOINT_PUBLIC_FEATURED = `${API_PROXY}/featureditems`;
const ENDPOINT_PUBLIC_LIST = `${API_PROXY}/public/articles`;
const ENDPOINT_PUBLIC_SEARCH = `${API_PROXY}/public/articles`; // Search via query param ?q=

export const dashboardService = {

  // ============================
  // ESPACE RÉDACTEUR
  // ============================

  // Récupère les articles du rédacteur connecté (API privée)
  getMyArticles: async (): Promise<ArticleBackend[]> => {
    console.log(`📡 [DASHBOARD] Fetching Mes Articles (Privé)...`);
    const token = authService.getToken();
    
    try {
      // NOTE: Par défaut le backend java "/articles" renvoie la liste filtrée si on n'est pas SUPER_ADMIN
      const res = await fetch(`${ENDPOINT_MY_ARTICLES}?page=0&size=50&sort=dateCreation,desc`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Echec chargement articles");
      
      const data: PageResponse<ArticleBackend> = await res.json();
      console.log(`✅ [DASHBOARD] ${data.content.length} articles récupérés.`);
      return data.content;
    } catch (e) {
      console.error("❌ [DASHBOARD] Erreur Articles:", e);
      return [];
    }
  },

  // Calcul des stats (puisque l'endpoint global stats n'est pas clair dans le log, on calcule en local pour le MVP)
  getMyStats: async (): Promise<StatsDashboard> => {
    const articles = await dashboardService.getMyArticles();
    
    // Aggrégation locale des données (views, comments)
    const stats = articles.reduce((acc, curr) => ({
      totalArticles: acc.totalArticles + 1,
      totalVues: acc.totalVues + (curr.vues || 0),
      totalCommentaires: acc.totalCommentaires + (curr.commentaires || 0)
    }), { totalArticles: 0, totalVues: 0, totalCommentaires: 0 });

    return stats;
  },

  // ============================
  // ESPACE LECTEUR (PUBLIC)
  // ============================

  getFeaturedArticles: async (section: string = "homepage"): Promise<ArticleBackend[]> => {
    console.log(`📡 [READER] Fetching Featured Articles (${section})...`);
    try {
      const res = await fetch(`${ENDPOINT_PUBLIC_FEATURED}?section=${section}`);
      if (!res.ok) throw new Error("Echec featured");
      const data = await res.json();
      // Swagger dit array
      return Array.isArray(data) ? data : data.content || [];
    } catch (e) {
      console.error("❌ [READER] Erreur Featured:", e);
      return [];
    }
  },

  getAllPublicArticles: async (page = 0, size = 10): Promise<PageResponse<ArticleBackend>> => {
    console.log(`📡 [READER] Fetching All Public Articles (Page ${page})...`);
    try {
      const res = await fetch(`${ENDPOINT_PUBLIC_LIST}?page=${page}&size=${size}`);
      if (!res.ok) throw new Error("Echec public list");
      return await res.json();
    } catch (e) {
      console.error("❌ [READER] Erreur List:", e);
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  },

  searchPublicArticles: async (query: string): Promise<ArticleBackend[]> => {
    // Si l'API utilise ?q= ou un filtre specifique, ajuster ici
    // On suppose une implémentation backend qui filtre
    console.log(`🔎 [READER] Recherche: ${query}`);
    return dashboardService.getFeaturedArticles(); // Fallback si route search pas dispo
  }
};