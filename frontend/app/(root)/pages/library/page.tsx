"use client";
import { useAuthStore } from "@/app/api/store/authStore";
import { useStoryStore } from "@/app/api/store/storyStore";
import StoryCard from "@/components/StoryCard";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Library = () => {
  const { stories, readerLater, finishedStories } = useStoryStore();
  const { user } = useAuthStore();

  const renderStories = (storyList, emptyMessage) => {
    if (!storyList || storyList.length === 0) {
      return (
        <p className="col-span-full text-center text-lg">{emptyMessage}</p>
      );
    }

    return storyList.map((story) => (
      <StoryCard key={story._id} story={story} showAddReader={false}>
        {story.progress !== undefined && story.progress < 100 && (
          <Progress value={story.progress} className="w-full mt-2" />
        )}
      </StoryCard>
    ));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full p-8 relative">
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        <div className="z-10 text-center">
          <h2 className="text-2xl font-semibold mb-4">Vous n'avez pas de compte</h2>
          <Button asChild>
            <Link href="/auth/login">Se connecter</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-8">
      <div className="w-full absolute top-0 py-11 max-w-4xl">
        <h1 className="text-3xl font-semibold mb-8">
          Bibliothèque Personnelle de {user.username}
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
                "Vous n'avez pas encore ajouté d'histoire à lire plus tard."
              )}
            </div>
          </TabsContent>
          <TabsContent value="in-progress">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* {renderStories(
                stories?.filter(
                  (story) => story.progress !== undefined && story.progress < 100
                ),
                "Vous n'avez pas encore commencé à lire d'histoire."
              )} */}
            </div>
          </TabsContent>
          <TabsContent value="finished">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {renderStories(
                finishedStories,
                "Vous n'avez pas encore terminé une histoire."
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Library;