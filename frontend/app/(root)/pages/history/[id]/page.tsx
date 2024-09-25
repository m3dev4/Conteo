"use client";
import { useChapterStore } from "@/app/api/store/chapterStore";
import { useStoryStore } from "@/app/api/store/storyStore";
import { Story } from "@/types";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Menu, AlertCircle, Sun, Moon, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Reader = ({ params }: { params: { id: string } }) => {
  const { getChapterByStoryId, chapters, loading, error } = useChapterStore();
  const { getStoryById } = useStoryStore();
  const [story, setStory] = useState<Story | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [fontFamily, setFontFamily] = useState("serif");
  const [lineHeight, setLineHeight] = useState(1.5);
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  useEffect(() => {
    const fetchStoryAndChapters = async () => {
      try {
        setFetchError(null);
        const fetchedStory = await getStoryById(params.id);
        if (!fetchedStory) {
          throw new Error("Story not found");
        }
        // Convertir les types de catégorie et auteur si nécessaire
        const adaptedStory: Story = {
          ...fetchedStory,
          category: typeof fetchedStory.category === 'string' 
            ? { _id: fetchedStory.category, name: '', slug: '' } 
            : fetchedStory.category,
          author: typeof fetchedStory.author === 'string' 
            ? { _id: fetchedStory.author, name: '' }
            : fetchedStory.author,
        };
        setStory(adaptedStory);
        await getChapterByStoryId(adaptedStory._id);
      } catch (err) {
        console.error("Error fetching story or chapters:", err);
        setFetchError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    };
    fetchStoryAndChapters();
  }, [params.id, getStoryById, getChapterByStoryId]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (fetchError || error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {fetchError || error}
            <br />
            Please try refreshing the page or contact support if the problem persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  if (!story) return <div className="flex justify-center items-center h-screen">Story not found</div>;

  const sortedChapters = chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
  const currentChapter = sortedChapters[currentChapterIndex];

  const goToNextChapter = () => {
    if (currentChapterIndex < sortedChapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-gray-100" : "bg-gray-900"}`}>
      <header className={`${theme === "light" ? "bg-white" : "bg-gray-800"} shadow`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className={`text-2xl sm:text-3xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>{story.title}</h1>
          <div className="flex items-center space-x-4">
            <Button onClick={toggleTheme} variant="outline">
              {theme === "light" ? <Moon /> : <Sun />}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline"><Menu /></Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Chapters</SheetTitle>
                  <SheetDescription>
                    {sortedChapters.map((chapter, index) => (
                      <Button
                        key={chapter._id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setCurrentChapterIndex(index)}
                      >
                        Chapter {chapter.chapterNumber}: {chapter.title}
                      </Button>
                    ))}
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
        <div className={`${theme === "light" ? "bg-white" : "bg-gray-800"} shadow sm:rounded-lg`}>
          <div className="px-4 py-5 sm:p-6">
            <h2 className={`text-xl sm:text-2xl font-semibold ${theme === "light" ? "text-gray-900" : "text-white"} mb-4 text-center`}>
              Chapter {currentChapter.chapterNumber}: {currentChapter.title}
            </h2>
            <div
              className="prose max-w-none"
              style={{
                fontSize: `${fontSize}px`,
                fontFamily,
                lineHeight,
                color: textColor,
                backgroundColor,
              }}
            >
              {currentChapter.content}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center flex-wrap">
          <Button onClick={goToPreviousChapter} disabled={currentChapterIndex === 0} className="mb-2 sm:mb-0">
            <ChevronLeft className="mr-2" /> Previous Chapter
          </Button>
          <div className="flex items-center space-x-4">
            <Select onValueChange={(value) => setFontFamily(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="sans-serif">Sans-serif</SelectItem>
                <SelectItem value="monospace">Monospace</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center">
              <Type className="mr-2" />
              <Slider
                min={12}
                max={24}
                step={1}
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
                className="w-[100px]"
              />
            </div>
          </div>
          <Button onClick={goToNextChapter} disabled={currentChapterIndex === sortedChapters.length - 1}>
            Next Chapter <ChevronRight className="ml-2" />
          </Button>
        </div>

        <div className="mt-6 space-y-4 flex justify-between flex-col sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Label htmlFor="line-height">Line Height</Label>
            <Slider
              id="line-height"
              min={1}
              max={2}
              step={0.1}
              value={[lineHeight]}
              onValueChange={(value) => setLineHeight(value[0])}
              className="w-[200px]"
            />
          </div>
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Label htmlFor="text-color">Text Color</Label>
            <input
              id="text-color"
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-[50px] h-[30px] ml-4"
            />
          </div>
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Label htmlFor="background-color">Background Color</Label>
            <input
              id="background-color"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-[50px] h-[30px] ml-4"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reader;
