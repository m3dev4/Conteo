// store/categoryStore.ts
import { create } from "zustand";

type Category = {
  _id: string;
  name: string;
};

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (name: string, ) => Promise<void>;
  updateCategory: (id: string, name: string, ) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
}

// Store Zustand
export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:8080/api/categories/categories");
      const data = await response.json();
      console.log("Fetched categories:", data); // Add this line
      set({ categories: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createCategory: async (name) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:8080/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
        
      });
        if(!response.ok){
          const errorData = await response.json();
          throw new Error(errorData.message || 'Something went wrong');
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
      const response = await fetch(`http://localhost:8080/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
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
      const response = await fetch(`http://localhost:8080/api/categories/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
  
      set((state) => ({
        categories: state.categories.filter((category) => category._id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
