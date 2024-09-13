import { create } from "zustand";

type Story = {
  _id: string;
  title: string;
  description: string;
  Coverimage: string;
  category: string;
  author: {
    _id: string;
    name: string;
  };
};

interface StoryState {
  stories: Story[];
  loading: boolean;
  error: string | null;
  fetchStories: () => Promise<void>;
  createStory: (storyData: FormData) => Promise<void>;
    updateStory: (id: string, storyData: FormData) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
  uploadCoverImage: (file: File) => Promise<string | void>;
  getStoryById: (id: string) => Promise<Story | null>;
}

const API_URL = "http://localhost:8080/api/story";

export const useStoryStore = create<StoryState>((set, get) => ({
  stories: [],
  loading: false,
  error: null,

  fetchStories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('http://localhost:8080/api/story/stories', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch stories");
      }
      const data = await response.json();
      set({ stories: data, loading: false });
      console.log(data);
      console.log(localStorage.getItem("token"));

    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createStory: async (storyData: FormData) => {
    set({ loading: true, error: null });
    try {
     
      
      const response = await fetch('http://localhost:8080/api/story/stories', {
        method: "POST",
     
        body: storyData,
        credentials: "include",
      
      });
      if (!response.ok) {
        throw new Error("Failed to create story");
      }
      const newStory = await response.json();
      set((state) => ({
        stories: [...state.stories, newStory],
        loading: false,
      }));
      console.log("Story created successfully:", newStory);
    } catch (error: any) {
      console.error("Error creating story:", error);
      set({ error: error.message, loading: false });
    }
  },

  updateStory: async (id: string, storyData: FormData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Unauthorized");
      }
      const response = await fetch(`${API_URL}/stories/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: storyData,
        credentials: "include",
      });
      const updatedStory = await response.json();
      set((state) => ({
        stories: state.stories.map((story) =>
          story._id === id ? updatedStory : story
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteStory: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Unauthorized");
      }
      const response = await fetch(`${API_URL}/stories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete story");
      }
      set((state) => ({
        stories: state.stories.filter((story) => story._id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      console.log(error.message);
    }
  },

  getStoryById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/stories/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch story");
      }
      const storyId = await response.json();
      set({ loading: false });
      return storyId;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      console.log(error.message);
    }
  },

  uploadCoverImage: async (file) => {
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

