// FICHIER: lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { APP_CONFIG } from "@/lib/constant";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// AJOUT : Fonction pour décoder le JWT
export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Erreur parsing JWT", e);
    return null;
  }
}

/**
 * Construit l'URL complète d'une image
 * @param imagePath L'URL, le chemin, ou le HASH reçu du backend
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return "/images/image4.jpeg"; // Placeholder par défaut
  }
  
  // 1. URL déjà complète (ex: via Cloudinary ou externe)
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // 2. URL relative classique
  if (imagePath.startsWith('/images/') || imagePath.startsWith('/icons/')) {
    return imagePath;
  }

  // 3. Gestion spécifique Backend (API Proxy)
  // Si le backend renvoie "/uploads/fichier.jpg" ou juste le hash
  const baseUrl = "http://194.163.175.53:8080/api/v1"; // Hardcodé selon vos docs pour être sûr, ou utilisez APP_CONFIG

  if (imagePath.startsWith('/uploads/')) {
     // Le serveur Java sert les uploads statiques à la racine ou via un controlleur ?
     // D'après votre swagger: GET /uploads/{filename} -> tags "static-file-controller"
     // Donc http://ip:port/uploads/filename
     return `http://194.163.175.53:8080${imagePath}`;
  }

  // 4. Cas du Hash/Filename brut renvoyé par MediaReadDto.hashSha256
  // Swagger: GET /api/v1/media/file/{filename} (Sert le fichier pour affichage direct)
  if (!imagePath.includes('/')) {
     // C'est probablement un ID ou un Hash brut
     return `${baseUrl}/media/file/${imagePath}`;
  }

  return imagePath;
}