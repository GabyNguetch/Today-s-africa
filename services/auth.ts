// FICHIER: lib/auth.ts

// Clés pour le localStorage
const STORAGE_KEY_USER = "tody_user";
const STORAGE_KEY_IS_AUTH = "tody_is_authenticated";

export interface User {
  name: string;
  email: string;
  role: "admin" | "editor";
  avatar?: string;
}

export const authService = {
  // Simuler l'inscription
  register: (name: string, email: string, password: string): boolean => {
    // Dans une vraie app, appel API ici.
    // Pour la démo, on stocke juste l'utilisateur "courant"
    const user: User = { name, email, role: "editor" };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_IS_AUTH, "true");
    }
    return true;
  },

  // Simuler la connexion
  login: (email: string, password: string): boolean => {
    // Vérification factice : accepte tout pour la démo si les champs sont remplis
    if (email && password) {
      const user: User = { 
        name: email.split("@")[0], // Nom par défaut basé sur l'email
        email, 
        role: "editor" 
      };
      
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEY_IS_AUTH, "true");
      }
      return true;
    }
    return false;
  },

  // Déconnexion
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_IS_AUTH);
      window.location.href = "/login";
    }
  },

  // Vérifier si connecté
  isAuthenticated: (): boolean => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY_IS_AUTH) === "true";
    }
    return false;
  },

  // Récupérer l'utilisateur courant
  getUser: (): User | null => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(STORAGE_KEY_USER);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }
};