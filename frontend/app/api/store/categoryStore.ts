// store/categoryStore.ts
import { create } from "zustand";

type Category = {
  _id: string;
  name: string;
  slug: string;
  coverImage: string;
};

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  uploadcoverImage: (file: File) => Promise<string | void>;
}

// Store Zustand
export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        "https://conteo-1.onrender.com/api/categories/categories"
      );
      const data = await response.json();
      set({ categories: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createCategory: async (name: string, file?: File) => {
    const token = localStorage.getItem("token");
    set({ loading: true, error: null });
    
    try {
      const formData = new FormData();
      formData.append("name", name);
  
      // Vérifie si un fichier d'image est fourni
      if (file) {
        formData.append("coverImage", file); // Ajouter l'image dans FormData
      }
  
      const response = await fetch("https://conteo-1.onrender.com/api/categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Ajout de l'autorisation si nécessaire
        },
        body: formData, // Envoie FormData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
  
      const newCategory = await response.json();
      set((state) => ({
        categories: [...state.categories, newCategory],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  updateCategory: async (id, name) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `https://conteo-1.onrender.com/api/categories/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        }
      );
      const updatedCategory = await response.json();
      set((state) => ({
        categories: state.categories.map((category) =>
          category._id === id ? updatedCategory : category
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  removeCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `https://conteo-1.onrender.com/api/categories/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      set((state) => ({
        categories: state.categories.filter((category) => category._id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  uploadcoverImage: async (file) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("https://conteo-1.onrender.com/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
      const result = await response.json();
      set({ loading: false });
      return result.image; // S'assurer de retourner ici la chaîne de l'URL de l'image
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return undefined; // Bien retourner undefined ici pour les erreurs
    }
  },
}));
