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

// AJOUT : Fonction pour construire l'URL complète des images
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return "/images/image4.jpeg"; // Image par défaut
  }
  
  // Si c'est déjà une URL complète (http/https)
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Si c'est un chemin relatif commençant par /uploads/ (urlAcces du backend)
  if (imagePath.startsWith('/uploads/')) {
    // Construction: baseurl + urlAcces
    const baseUrl = APP_CONFIG.apiUrl.replace('/api/v1', '');
    return `${baseUrl}${imagePath}`;
  }
  
  // Fallback pour les images par défaut locales
  if (imagePath.startsWith('/images/')) {
    return imagePath;
  }
  
  // Fallback final
  return "/images/image4.jpeg";
}