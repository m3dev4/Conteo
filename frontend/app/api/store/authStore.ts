import { StateCreator, create } from "zustand";
import { devtools } from "zustand/middleware";

type User = {
  _id: string;
  nameOfUser: string;
  username: string;
  email: string;
  isAdmin: boolean;
};

interface AuthState {
  user: User | null;
  error: string | null;
  loading: boolean;
  signup: (
    nameOfUser: string,
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  loadUserFromLocalStorage: () => void; // Nouvelle fonction pour charger l'utilisateur depuis le stockage local
}

// Créer une fonction d'état pour Zustand avec le type correct
const authStore: StateCreator<AuthState, [["zustand/devtools", never]], []> = (
  set
) => ({
  user: null,
  error: null,
  loading: false,

  signup: async (nameOfUser, username, email, password) => {
    set((state) => ({ ...state, loading: true, error: null }));
    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nameOfUser, username, email, password }),
       credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Échec de l'inscription");
      }

      const data = await response.json();
      set((state) => ({ ...state, user: data, loading: false }));
      localStorage.setItem("user", JSON.stringify(data)); // Sauvegarder dans le stockage local
    } catch (error: any) {
      set((state) => ({ ...state, error: error.message, loading: false }));
    }
  },

  login: async (email, password) => {
    set((state) => ({ ...state, loading: true, error: null }));
  
    // Assurez-vous que cette ligne est exécutée côté client (navigateur)
    if (typeof window !== 'undefined') { 
      const token = localStorage.getItem('token'); // Récupère le token si existant
      console.log("Token:", token); // Vérifiez dans la console du navigateur
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Échec de la connexion");
      }
  
      const data = await response.json();
  
      // Assurez-vous que cette ligne est également exécutée côté client (navigateur)
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(data)); // Sauvegarde les informations de l'utilisateur
      }
  
      set((state) => ({ ...state, user: data, loading: false }));
    } catch (error: any) {
      set((state) => ({ ...state, error: error.message, loading: false }));
    }
  },
  

  logout: async () => {
    set((state) => ({ ...state, loading: true }));
    try {
      await fetch("http://localhost:8080/api/users/logout", {
        method: "POST",
      });
      set((state) => ({ ...state, user: null, loading: false }));
      localStorage.removeItem("user"); // Supprimer l'utilisateur du stockage local
    } catch (error: any) {
      set((state) => ({ ...state, error: error.message, loading: false }));
    }
  },

  fetchUserProfile: async () => {
    set((state) => ({ ...state, loading: true, error: null }));
    try {
      const response = await fetch("http://localhost:8080/api/users/profile", {
        credentials: "include", // pour inclure les cookies si nécessaire
      });
      if (!response.ok) {
        throw new Error("Impossible de récupérer le profil utilisateur");
      }
      const data = await response.json();
      set((state) => ({ ...state, user: data, loading: false }));
      localStorage.setItem("user", JSON.stringify(data)); // Sauvegarder dans le stockage local
    } catch (error: any) {
      set((state) => ({ ...state, error: error.message, loading: false }));
    }
  },

  loadUserFromLocalStorage: () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      set((state) => ({ ...state, user: JSON.parse(userData) }));
    }
  },
});

// Utiliser le store avec devtools activé
export const useAuthStore = create(devtools(authStore));
