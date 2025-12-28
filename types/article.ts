// FICHIER: types/article.ts - VERSION CORRIGÉE

// ==========================================
// MÉDIAS
// ==========================================
export interface MediaResponseDto {
  id: string | number;
  urlAcces: string;
  nomOriginal: string;
  typeMime: string;
  hashSha256?: string;
}

// ==========================================
// BLOCS DE CONTENU
// ==========================================
export type BlockType = 'TEXTE' | 'IMAGE' | 'VIDEO' | 'CITATION';

/**
 * DTO pour création/envoi au backend
 * Tous les champs REQUIS par le backend doivent être présents
 */
export interface BlocContenuDto {
  type: BlockType;
  contenu: string;        // Texte HTML ou URL selon type
  ordre: number;
  legende: string;        // Obligatoire (string vide si absent)
  altText: string;        // Obligatoire (string vide si absent)
  url: string;            // Obligatoire (string vide si absent)
  mediaId: string | null;        // Obligatoire (0 si absent)
  articleId: number;      // Obligatoire (0 si absent)
}

/**
 * DTO retourné par le backend (lecture)
 */
export interface BlocContenuReadDto {
  id: number;
  type: BlockType;
  contenu: string;
  ordre: number;
  legende: string;
  altText: string;
  url: string;
  mediaId: string | null;
  articleId: number;
}

// ==========================================
// ARTICLE
// ==========================================

/**
 * Payload strict pour création/modification
 * CONFORME au Swagger et aux attentes du backend
 */
export interface ArticlePayloadDto {
  titre: string;                      // Min 10, Max 200 caractères
  description: string;                // Min 50, Max 500 caractères
  rubriqueId: number;                 // ID de rubrique valide
  auteurId: number;                   // ID auteur connecté
  imageCouvertureId: number | null;   // ID média ou null
  region: string;                     // Ex: "GLOBAL", "AFRIQUE_OUEST"
  blocsContenu: BlocContenuDto[];     // Liste de blocs complète
  tagIds: number[];                   // Liste d'IDs (peut être vide [])
  statut: string;                     // "DRAFT", "PENDING_REVIEW", etc.
  visible: boolean;                   // false par défaut
  datePublication?: string | null;    // ISO 8601 ou null
}

/**
 * Article retourné par le backend
 */
export interface ArticleReadDto {
  id: number;
  titre: string;
  slug: string;
  description: string;
  rubriqueNom?: string;
  rubriqueId?: number;
  auteurNom?: string;
  auteurId?: number;
  imageCouvertureUrl?: string | null;
  imageCouvertureId?: number | null;
  blocsContenu: BlocContenuReadDto[];
  tags?: string[];
  statut: string;
  datePublication?: string;
  dateCreation: string;
  dateModification?: string;
  vues?: number;
  telechargements?: number;
  partages?: number;
  commentaires?: number;
  region?: string;
  visible?: boolean;
}

// ==========================================
// RUBRIQUES
// ==========================================
export interface Rubrique {
  id: number;
  nom: string;
  description?: string;
  slug?: string;
  parentId?: number | null;
  ordre?: number;
  icone?: string;
  couleur?: string;
  visible?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  enfants?: Rubrique[];
  nombreArticles?: number;
}

// ==========================================
// HELPERS DE VALIDATION
// ==========================================

// Validation simplifiée mais robuste
export function validateArticlePayload(payload: ArticlePayloadDto): string[] {
  const errors: string[] = [];
  if (payload.titre.trim().length < 10) errors.push("Titre trop court (min 10 car.)");
  if (payload.description.trim().length < 50) errors.push("Résumé trop court (min 50 car.)");
  if (!payload.rubriqueId) errors.push("Rubrique obligatoire");
  if (payload.blocsContenu.length === 0) errors.push("L'article est vide");
  return errors;
}

/**
 * Normalise un bloc avant envoi
 */
export function normalizeBlocContenu(
  bloc: Partial<BlocContenuDto>,
  ordre: number,
  articleId: number
): BlocContenuDto {
  return {
    type: bloc.type || 'TEXTE',
    contenu: bloc.contenu || '',
    ordre: ordre,
    legende: bloc.legende || '',
    altText: bloc.altText || '',
    url: bloc.url || '',
    mediaId: bloc.mediaId || null, // ✅ CORRECTION: Utiliser null
    articleId: articleId || 0
  };
}

// FICHIER: types/article.ts (Ajoutez ceci à la fin du fichier)

export interface CommentaireDto {
  id: number;
  contenu: string;
  dateCreation: string;
  auteurNom: string; // ou on déduit de utilisateurId
  utilisateurId: number;
  articleId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface CreateCommentaireDto {
  contenu: string;
  articleId: number;
  utilisateurId: number;
}



