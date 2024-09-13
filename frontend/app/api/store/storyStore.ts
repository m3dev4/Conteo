import { create } from 'zustand';

type Story = {
  _id: string;
  title: string;
  description: string;
  content: string;
  image?: string ;
  category: string;
};


interface StoryState {
  stories: Story[];
  loading: boolean;
  error: string | null;
  fetchStories: () => Promise<void>;
  createStory: (storyData: Omit<Story, "_id">) => Promise<void>;
  updateStory: (id: string, storyData: Partial<Omit<Story, "_id">>) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string | void>;
}

export const useStoryStore = create<StoryState>((set) => ({
  stories: [],
  loading: false,
  error: null,

  fetchStories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:8080/api/stories");
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      set({ stories: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  createStory: async (storyData: Omit<Story, "_id">) => {
    set({ loading: true, error: null });
    const token = localStorage.getItem('token');
    console.log("Token from localStorage:", token); // Ajoutez ce log

    try {
      const token = localStorage.getItem('token'); // Assurez-vous que c'est le bon nom de clé
      console.log("Token from localStorage:", token);
  
      const response = await fetch("http://localhost:8080/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(storyData),
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create story");
      }
  
      const newStory = await response.json();
      set((state) => ({
        stories: [...state.stories, newStory],
        loading: false,
      }));
    } catch (error: any) {
      console.error("Error creating story:", error);
      set({ error: error.message, loading: false });
    }
  },
  
  
  updateStory: async (id, storyData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:8080/api/stories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storyData),
      });
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const updatedStory = await response.json();
      set((state) => ({
        stories: state.stories.map((story) => story._id === id ? updatedStory : story),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  deleteStory: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:8080/api/stories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      set((state) => ({
        stories: state.stories.filter((story) => story._id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  uploadImage: async (file) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("image", file);
  
      const response = await fetch("http://localhost:8080/api/upload", {
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
