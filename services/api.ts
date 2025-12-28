import axios from 'axios';
import { APP_CONFIG } from "@/lib/constant"; // Import de la config unifiée

// ✅ Utilise l'URL relative configurée (/api/proxy)
const api = axios.create({
  baseURL: APP_CONFIG.apiUrl,
});

api.interceptors.request.use(
  (config) => {
    // Note: Stockage token cohérent avec services/auth.ts
    // Assure-toi que la clé est bien 'tody_jwt_token' partout (auth.ts utilise cette clé)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('tody_jwt_token'); 
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;