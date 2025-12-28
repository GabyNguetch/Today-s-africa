// services/admin.ts
import { APP_CONFIG } from "@/lib/constant";
import { authService } from "./auth";

const API_BASE = APP_CONFIG.apiUrl; // Utilise /api/proxy

export const AdminService = {
  /**
   * RÉCUPÉRER TOUS LES UTILISATEURS (Lecteurs + Staff)
   * Backend : GET /api/v1/utilisateurs/all
   */
  getAllUsers: async (): Promise<any[]> => {
    const token = authService.getToken();
    try {
      const res = await fetch(`${API_BASE}/utilisateurs/all`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  /**
   * RÉCUPÉRER L'ÉQUIPE (Uniquement rôle REDACTEUR ou ADMIN)
   * Backend : GET /api/v1/utilisateurs/redacteurs
   */
  getAllRedacteurs: async (): Promise<any[]> => {
    const token = authService.getToken();
    try {
      const res = await fetch(`${API_BASE}/utilisateurs/redacteurs`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Erreur lors de la récupération des rédacteurs");
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  /**
   * STATISTIQUES RÉELLES D'UN RÉDACTEUR
   * Backend : GET /api/v1/articles/author/{id}/stats
   */
  getAuthorStats: async (authorId: number): Promise<any> => {
    const token = authService.getToken();
    try {
      const res = await fetch(`${API_BASE}/articles/author/${authorId}/stats`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) return null;
      return await res.json();
      // Le backend renvoie souvent : { totalArticles: 10, totalVues: 500, etc. }
    } catch (e) {
      return null;
    }
  }
};