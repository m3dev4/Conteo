import { create } from "zustand";

type Chapter = {
  _id: string;
  title: string;
  content: string;
  chapterNumber: number;
};

interface ChapterState {
  chapters: Chapter[];
  loading: boolean;
  error: string | null;
  getChapterByStoryId: (storyId: string) => Promise<void>;
  createChapter: (storyId: string, chapterData: Omit<Chapter, '_id'>) => Promise<void>;
  updateChapter: (chapterId: string, chapterData: Partial<Omit<Chapter, '_id'>>) => Promise<void>;
  deleteChapter: (chapterId: string) => Promise<void>;
  getChapterById: (chapterId: string) => Promise<void>;
}

export const useChapterStore = create<ChapterState>((set, get) => ({
  chapters: [],
  loading: false,
  error: null,

  getChapterByStoryId: async (storyId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:8080/api/stories/${storyId}/chapters`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch chapters");
      }
      const data = await response.json();
      set({ chapters: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createChapter: async (storyId: string, chapterData: Omit<Chapter, '_id'>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:8080/api/story/stories/${storyId}/chapters`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(chapterData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create chapter");
      }
      const newChapter = await response.json();
      set((state) => ({ 
        chapters: [...state.chapters, newChapter], 
        loading: false 
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateChapter: async (chapterId: string, chapterData: Partial<Omit<Chapter, '_id'>>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:8080/api/chapters/${chapterId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(chapterData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update chapter");
      }
      const updatedChapter = await response.json();
      set((state) => ({
        chapters: state.chapters.map((ch) => 
          ch._id === chapterId ? { ...ch, ...updatedChapter } : ch
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteChapter: async (chapterId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:8080/api/chapters/${chapterId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete chapter");
      }
      set((state) => ({
        chapters: state.chapters.filter((ch) => ch._id !== chapterId),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  getChapterById: async (chapterId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:8080/api/chapters/${chapterId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch chapter");
      }
      const chapter = await response.json();
      set((state) => ({
        chapters: state.chapters.some(ch => ch._id === chapterId)
          ? state.chapters.map(ch => ch._id === chapterId ? chapter : ch)
          : [...state.chapters, chapter],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));