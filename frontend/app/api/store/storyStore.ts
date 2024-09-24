import toast from "react-hot-toast";
import { create } from "zustand";

type Story = {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
  status: string;
};

interface StoryState {
  finishedStories: any;
  stories: Story[];
  readerLater: Story[];
  loading: boolean;
  error: string | null;
  fetchStories: () => Promise<void>;
  createStory: (storyData: FormData) => Promise<void>;
  updateStory: (id: string, storyData: FormData) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
  uploadcoverImage: (file: File) => Promise<string | void>;
  getStoryById: (id: string) => Promise<Story | null>;
  fetchStoriesByCategory: (slug: string) => Promise<void>;
  addToReaderLater: (story: Story) => void;
  markAsFinished: (story: Story) => void
  updateProgress: (storyId: string, progress: number) => void
}

const API_URL = "http://localhost:8080/api/story";

export const useStoryStore = create<StoryState>((set, get) => ({
  stories: [],
  readerLater: JSON.parse(localStorage.getItem("readerLater") || "[]"),
  finishedStories: [],
  loading: false,
  error: null,

  fetchStories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:8080/api/story/stories", {
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
      if (Array.isArray(data)) {
        set({ stories: data, loading: false });
      } else {
        throw new Error("Fetched data is not an array");
      }
      console.log("Fetched data:", data);
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addToReaderLater: (story: Story) => {
    set((state) => {
      const isAlraedyAdded = state.readerLater.some((s) => s._id === story._id);
      if (isAlraedyAdded) {
        toast.error("Story already added to reader later");
        return state;
      }

      const updatedReaderLater = [...state.readerLater, story];
      localStorage.setItem("readerLater", JSON.stringify(updatedReaderLater)); // Sauvegarder dans localStorage
      return { readerLater: updatedReaderLater };
    });
  },

  createStory: async (storyData: FormData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:8080/api/story/stories", {
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

  fetchStoriesByCategory: async (slug: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/category/${slug}`, {
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
      if (Array.isArray(data)) {
        set({ stories: data, loading: false });
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      console.log(error.message);
    }
  },

  uploadcoverImage: async (file) => {
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
  markAsFinished: (story) => set((state) => ({
    finishedStories: [...state.finishedStories, story],
    stories: state.stories.filter((s) => s._id !== story._id),
    readerLater: state.readerLater.filter((s) => s._id !== story._id),
  })),
  updateProgress: (storyId, progress) => set((state) => ({
    stories: state.stories.map((story) =>
      story._id === storyId ? { ...story, progress } : story
    ),
  })),
}));
