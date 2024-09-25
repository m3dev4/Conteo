"use client";
import { useAuthStore } from "@/app/api/store/authStore";
import { useStoryStore } from "@/app/api/store/storyStore";
import StoryCard from "@/components/StoryCard";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

import { Metadata } from "next";
import { Trash2Icon } from "lucide-react";

const Library = () => {
  const { stories, readerLater, finishedStories, removeReaderLater } = useStoryStore();
  const { user } = useAuthStore();

  const handleRemove = (story) => {
    removeReaderLater(story);
  };

  const renderStories = (storyList, emptyMessage, showTrash = false) => {
    if (!storyList || storyList.length === 0) {
      return <p className="col-span-full text-center text-lg">{emptyMessage}</p>;
    }

    return storyList.map((story) => (
      <div key={story._id} className="relative">
        <StoryCard key={story._id} story={story} showAddReader= {false}>
          {story.progress !== undefined && story.progress < 100 && (
            <Progress value={story.progress} className="w-full mt-2" />
          )}
        </StoryCard>

        {showTrash && (
          <button
            onClick={() => handleRemove(story)}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <Trash2Icon className="h-5 w-5" />
          </button>
        )}
      </div>
    ));
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-8">
      <div className="w-full absolute top-0 py-11 max-w-4xl">
        <h1 className="text-3xl font-semibold mb-8">
          Bibliothèque Personnelle de {user?.username || "Utilisateur"}
        </h1>

        <Tabs defaultValue="to-read" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="to-read">À lire</TabsTrigger>
            <TabsTrigger value="in-progress">En cours</TabsTrigger>
            <TabsTrigger value="finished">Terminées</TabsTrigger>
          </TabsList>
          <TabsContent value="to-read">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {renderStories(
                readerLater,
                "Vous avez pas encore ajouté une histoire.",
                true 
              )}
            </div>
          </TabsContent>
          <TabsContent value="in-progress">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* {renderStories(
                stories?.filter(
                  (story) =>
                    story.progress !== undefined && story.progress < 100
                ),
                "Vous avez pas encore commencé à lire un histoire."
              )} */}
            </div>
          </TabsContent>
          <TabsContent value="finished">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {renderStories(
                finishedStories,
                "Vous avez pas encore terminé une histoire."
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Library;
