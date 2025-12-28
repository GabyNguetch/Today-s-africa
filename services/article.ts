// FICHIER: services/article.ts - VERSION CORRIGÉE

import { APP_CONFIG } from "@/lib/constant";
import { authService } from "@/services/auth";
import { 
  ArticlePayloadDto, 
  ArticleReadDto, 
  MediaResponseDto, 
  Rubrique,
  validateArticlePayload
} from "@/types/article";

export const ArticleService = {
  
  // ==========================================
  // UPLOAD MÉDIA
  // ==========================================
  
  uploadMedia: async (file: File): Promise<MediaResponseDto> => {
    const token = authService.getToken();
    if (!token) throw new Error("Authentification requise");

    const safeName = encodeURIComponent(file.name);
    const endpoint = `${APP_CONFIG.apiUrl}/media/upload?altText=${safeName}&legende=${safeName}`;
    
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: fd,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Upload failed:", errorText);
      throw new Error(`Erreur upload (${res.status})`);
    }
    
    const data = await res.json();
    
    // Reconstruction URL si nécessaire
    let finalUrl = data.urlAcces || "";
    if (finalUrl && !finalUrl.startsWith("http")) {
      if (finalUrl.includes("/api/v1/media/file/")) {
        finalUrl = `http://194.163.175.53:8080${finalUrl}`;
      } else if (data.hashSha256) {
        finalUrl = `${APP_CONFIG.mediaBaseUrl}${data.hashSha256}`;
      }
    }

    // CORRECTION: Conversion ID en number
    const mediaId = typeof data.id === 'string' 
      ? parseInt(data.id, 10) 
      : data.id;

    return {
      id: isNaN(mediaId) ? 0 : mediaId,
      urlAcces: finalUrl,
      nomOriginal: data.nomOriginal || file.name,
      typeMime: data.typeMime || file.type,
      hashSha256: data.hashSha256
    };
  },

  // === CRÉATION ARTICLE ===
  create: async (payload: ArticlePayloadDto): Promise<ArticleReadDto> => {
    const token = authService.getToken();
    if (!token) throw new Error("Non authentifié");

    // Validation
    const errors = validateArticlePayload(payload);
    if (errors.length > 0) throw new Error(errors[0]);

    // ✅ NETTOYAGE CRITIQUE DU PAYLOAD
    // Pour éviter les erreurs 400 Bad Request JSON
    const cleanPayload = {
      titre: payload.titre,
      description: payload.description,
      rubriqueId: payload.rubriqueId,
      auteurId: payload.auteurId,
      // Pour l'instant on force null si pas défini (évite mismatch Int/UUID)
      // Si votre Swagger dit Int pour coverImageId mais que le media est UUID, 
      // il faut soit mettre null, soit le backend doit être corrigé. On met null pour que ça passe.
      imageCouvertureId: payload.imageCouvertureId || null, 
      region: payload.region,
      visible: false,
      statut: payload.statut,
      tagIds: payload.tagIds || [],
      datePublication: payload.datePublication || null, // null pour DRAFT

      // MAPPING BLOCS
      blocsContenu: payload.blocsContenu.map((b, idx) => ({
        type: b.type,
        contenu: b.contenu || "",
        ordre: idx, // Force l'ordre séquentiel
        legende: b.legende || "",
        altText: b.altText || "",
        url: b.url || "",
        // 🔴 Correction Majeure : "0" -> null pour les UUID
        mediaId: (b.mediaId && b.mediaId !== "0") ? b.mediaId : null,
        articleId: 0 // Requis par certaines Logiques DTO
      }))
    };

    const res = await fetch(`${APP_CONFIG.apiUrl}/articles`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(cleanPayload)
    });

    if (!res.ok) {
        const txt = await res.text();
        console.error("Backend Refusal:", txt);
        throw new Error(`Erreur Création (${res.status}): ${txt}`);
    }
    
    return await res.json();
  },

  // === MODIFICATION ===
  update: async (id: number, payload: ArticlePayloadDto): Promise<ArticleReadDto> => {
    const token = authService.getToken();
    
    // Payload cleaning similaire au Create
    const cleanPayload = {
      ...payload,
      blocsContenu: payload.blocsContenu.map((b, idx) => ({
        ...b,
        ordre: idx,
        mediaId: (b.mediaId && b.mediaId !== "0") ? b.mediaId : null,
        articleId: id 
      }))
    };

    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(cleanPayload)
    });

    if (res.status === 204) return ArticleService.getById(id);
    if (!res.ok) throw new Error("Erreur modification");
    return await res.json();
  },

  // ==========================================
  // LECTURE ARTICLE
  // ==========================================
  
  getById: async (id: number): Promise<ArticleReadDto> => {
    const token = authService.getToken();
    const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
    
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}`, { headers });
    
    if (!res.ok) {
      throw new Error(`Article ${id} introuvable`);
    }
    
    return await res.json();
  },

  // ==========================================
  // SOUMISSION POUR VALIDATION
  // ==========================================
  
  submit: async (articleId: number, redacteurId: number): Promise<ArticleReadDto> => {
    return ArticleService.submitForReview(articleId, redacteurId);
  },

  submitForReview: async (articleId: number, redacteurId: number): Promise<ArticleReadDto> => {
    const token = authService.getToken();
    if (!token) throw new Error("Non authentifié");
    
    const res = await fetch(
      `${APP_CONFIG.apiUrl}/redacteur/${redacteurId}/articles/${articleId}/submit`,
      {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      }
    );
    
    if (!res.ok) {
      throw new Error("Échec soumission pour validation");
    }
    
    return await res.json();
  },

  // ==========================================
  // ACTIONS ADMIN
  // ==========================================
  
  approve: async (id: number): Promise<void> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}/approve`, {
      method: "PATCH",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({})
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || `Erreur approbation ${id}`);
    }
  },

  publish: async (id: number): Promise<void> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}/publish`, {
      method: "PATCH",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({})
    });
    
    if (!res.ok) {
      throw new Error("Erreur publication");
    }
  },

  reject: async (id: number, motif: string): Promise<void> => {
    const token = authService.getToken();
    const endpoint = `${APP_CONFIG.apiUrl}/articles/${id}/reject?motif=${encodeURIComponent(motif)}`;
    
    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!res.ok) {
      throw new Error("Échec du rejet");
    }
  },

  archive: async (id: number): Promise<void> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}/archive`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!res.ok) {
      throw new Error("Échec archivage");
    }
  },

  delete: async (id: number): Promise<void> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/articles/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!res.ok) {
      throw new Error("Suppression impossible");
    }
  },

  // ==========================================
  // RUBRIQUES
  // ==========================================
  
  getRubriquesTree: async (): Promise<Rubrique[]> => {
    try {
      const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques`);
      return res.ok ? await res.json() : [];
    } catch {
      return [];
    }
  },
  
  createRubrique: async (nom: string) => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/rubriques`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ nom, visible: true })
    });
    
    return res.ok ? await res.json() : null;
  },

  // ==========================================
  // LISTES RÉDACTEUR
  // ==========================================
  
// DANS : services/article.ts

getRedacteurBrouillons: async (redacteurId: number): Promise<ArticleReadDto[]> => {
    const token = authService.getToken();
    if (!token) throw new Error("Authentification requise pour voir les brouillons");

    try {
        const response = await fetch(
            `${APP_CONFIG.apiUrl}/redacteur/${redacteurId}/articles/brouillons`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            // On peut loguer l'erreur mais on ne throw pas forcément pour ne pas casser l'UI
            console.warn(`Erreur récupération brouillons: ${response.status}`);
            return [];
        }

        const data = await response.json();
        
        // Sécurité : S'assurer que c'est bien un tableau
        return Array.isArray(data) ? data : [];
        
    } catch (error) {
        console.error("❌ Erreur réseau brouillons:", error);
        return [];
    }
},

  getRedacteurPublies: async (redacteurId: number): Promise<ArticleReadDto[]> => {
    const token = authService.getToken();
    const res = await fetch(
      `${APP_CONFIG.apiUrl}/redacteur/${redacteurId}/articles/publies`,
      { headers: { "Authorization": `Bearer ${token}` } }
    );
    
    return res.ok ? await res.json() : [];
  },

  getRedacteurTousArticles: async (redacteurId: number, page = 0, size = 50): Promise<any> => {
    const token = authService.getToken();
    const res = await fetch(
      `${APP_CONFIG.apiUrl}/redacteur/${redacteurId}/articles?page=${page}&size=${size}&sort=updatedAt,desc`,
      { headers: { "Authorization": `Bearer ${token}` } }
    );
    
    return res.ok ? await res.json() : { content: [] };
  },

  // ==========================================
  // LISTES ADMIN
  // ==========================================
  
  getArticlesByStatus: async (status: string, page = 0, size = 20): Promise<any> => {
    const token = authService.getToken();
    const res = await fetch(
      `${APP_CONFIG.apiUrl}/articles/by-status/${status}?page=${page}&size=${size}&sort=updatedAt,desc`,
      { headers: { "Authorization": `Bearer ${token}` } }
    );
    
    if (!res.ok) {
      throw new Error("Erreur chargement liste admin");
    }
    
    return await res.json();
  },

  getAllRedacteurs: async (): Promise<any[]> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/utilisateurs/redacteurs`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    return res.ok ? await res.json() : [];
  },

  getAllUsers: async (): Promise<any[]> => {
    const token = authService.getToken();
    const res = await fetch(`${APP_CONFIG.apiUrl}/utilisateurs/all`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    return res.ok ? await res.json() : [];
  },

  getAuthorStats: async (authorId: number): Promise<any> => {
    const token = authService.getToken();
    try {
      const res = await fetch(
        `${APP_CONFIG.apiUrl}/articles/author/${authorId}/stats`,
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      
      return res.ok ? await res.json() : null;
    } catch {
      return null;
    }
  }
};