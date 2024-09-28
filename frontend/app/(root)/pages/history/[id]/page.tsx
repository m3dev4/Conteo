"use client"
import React, { useEffect, useState, useRef } from "react";
import { useChapterStore } from "@/app/api/store/chapterStore";
import { useStoryStore } from "@/app/api/store/storyStore";
import { Story } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  AlertCircle,
  Sun,
  Moon,
  Type,
  Bookmark,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const WORDS_PER_PAGE = 300;

const Reader = ({ params }: { params: { id: string } }) => {
  const { getChapterByStoryId, chapters, loading, error } = useChapterStore();
  const { getStoryById } = useStoryStore();
  const [story, setStory] = useState<Story | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [fontFamily, setFontFamily] = useState("serif");
  const [lineHeight, setLineHeight] = useState(1.6);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pages, setPages] = useState<string[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStoryAndChapters = async () => {
      try {
        setFetchError(null);
        const fetchedStory = await getStoryById(params.id);
        if (!fetchedStory) {
          throw new Error("Story not found");
        }
        const story: Story = {
          _id: fetchedStory._id,
          title: fetchedStory.title,
          description: fetchedStory.description,
          author: fetchedStory.author,
          coverImage: fetchedStory.coverImage,
          category: {
            _id: "",
            name: fetchedStory.category,
            slug: "",
          },
          status: fetchedStory.status,
          createdAt: fetchedStory.createdAt,
        };
        setStory(story);
        await getChapterByStoryId(fetchedStory._id);
      } catch (err) {
        console.error("Error fetching story or chapters:", err);
        setFetchError("Failed to load the story. Please try again.");
      }
    };
    fetchStoryAndChapters();
  }, [params.id, getStoryById, getChapterByStoryId]);

  const sortedChapters = chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
  const currentChapter = sortedChapters[currentChapterIndex];

  useEffect(() => {
    if (currentChapter) {
      const words = currentChapter.content.split(/\s+/);
      const newPages = [];
      for (let i = 0; i < words.length; i += WORDS_PER_PAGE) {
        newPages.push(words.slice(i, i + WORDS_PER_PAGE).join(" "));
      }
      setPages(newPages);
      setCurrentPage(0);
    } else {
      setPages([]);
      setCurrentPage(0);
    }
  }, [currentChapter]);

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      goToNextChapter();
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else {
      goToPreviousChapter();
    }
  };

  const goToNextChapter = () => {
    if (currentChapterIndex < sortedChapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentPage(0);
    }
  };

  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentPage(0);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  if (fetchError || error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{fetchError || error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  if (!story) return <div className="flex justify-center items-center h-screen">Histoire introuvable</div>;

  return (
    <div className={`min-h-screen transition-all duration-300 ${theme === "light" ? "bg-amber-50" : "bg-gray-900"}`}>
      {/* Header persistant */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-opacity-90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className={`text-xl sm:text-2xl font-bold truncate ${theme === "light" ? "text-gray-800" : "text-amber-50"}`}>
            {story.title}
          </h1>
          <div className="flex items-center space-x-2">
            <Button onClick={toggleTheme} variant="ghost" size="icon" className="rounded-full bg-gray-200 dark:bg-gray-700">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-gray-200 dark:bg-gray-700">
                  <Settings className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-gradient-to-tl from-slate-50/90 from-20% to-blue-50 to-65%">
                <SheetHeader>
                  <SheetTitle>Paramètres de lecture</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="font-family">Police</Label>
                    <Select onValueChange={setFontFamily} value={fontFamily}>
                      <SelectTrigger id="font-family">
                        <SelectValue placeholder="Choisir une police" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="sans-serif">Sans-serif</SelectItem>
                        <SelectItem value="monospace">Monospace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="font-size">Taille du texte</Label>
                    <div className="flex items-center space-x-2">
                      <Type className="h-4 w-4"  />
                      <Slider
                        id="font-size"
                        min={12}
                        max={24}
                        step={1}
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                        className="bg-slate-700 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="line-height">Interligne</Label>
                    <Slider
                      id="line-height"
                      min={1}
                      max={2}
                      step={0.1}
                      value={[lineHeight]}
                      onValueChange={(value) => setLineHeight(value[0])}
                      className="bg-slate-700 rounded-full"
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-gray-200 dark:bg-gray-700">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-gradient-to-tl from-slate-50/90 from-20% to-blue-50 to-65%">
                <SheetHeader>
                  <SheetTitle>Chapitres</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                  {sortedChapters.length > 0 ? (
                    sortedChapters.map((chapter, index) => (
                      <Button
                        key={chapter._id}
                        variant={currentChapterIndex === index ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => {
                          setCurrentChapterIndex(index);
                          setCurrentPage(0);
                          setIsSettingsOpen(false);
                        }}
                      >
                        <Bookmark className="h-4 w-4 mr-2" />
                        Chapitre {chapter.chapterNumber}: {chapter.title}
                      </Button>
                    ))
                  ) : (
                    <p>Aucun chapitre disponible</p>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div
          className={`rounded-lg shadow-lg transition-all duration-300 ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}
        >
          <div className="px-6 py-8">
            {currentChapter ? (
              <>
                <h2 className={`text-2xl font-semibold mb-6 text-center ${theme === "light" ? "text-gray-800" : "text-amber-50"}`}>
                  Chapitre {currentChapter.chapterNumber}: {currentChapter.title}
                </h2>
                <div
                  ref={contentRef}
                  className="prose max-w-none"
                  style={{
                    fontSize: `${fontSize}px`,
                    fontFamily,
                    lineHeight,
                    color: theme === "light" ? "#1a202c" : "#e2e8f0",
                    transition: "all 0.3s ease",
                  }}
                >
                  {pages[currentPage]}
                </div>
              </>
            ) : (
              <p className={`text-center ${theme === "light" ? "text-gray-800" : "text-amber-50"}`}>
                Aucun chapitre disponible pour l'instant.
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Contrôles de navigation persistants */}
      {currentChapter && (
        <div className="fixed bottom-0 left-0 right-0 bg-opacity-90 backdrop-blur-sm z-[100]  max-sm:realtive max-sm:bottom-[60px] ">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center   ">
            <Button
              onClick={goToPreviousPage}
              disabled={currentChapterIndex === 0 && currentPage === 0}
              className="rounded-full bg-gray-200 dark:bg-gray-700"
            >
              <ChevronLeft className="mr-2" /> Précédent
            </Button>
            <span className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
              Page {currentPage + 1} / {pages.length}
            </span>
            <Button
              onClick={goToNextPage}
              disabled={currentChapterIndex === sortedChapters.length - 1 && currentPage === pages.length - 1}
              className="rounded-full bg-gray-200 dark:bg-gray-700"
            >
              Suivant <ChevronRight className="ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reader;