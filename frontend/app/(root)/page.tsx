"use client";
import React, { useEffect, useState, useRef } from "react";
import { useStoryStore } from "@/app/api/store/storyStore";
import { Story } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StoryCard from "@/components/StoryCard";
import Carousel from "@/components/Caroussel";


export default function Home() {
  const { fetchStories, stories, readerLater } = useStoryStore();
  const [featuredStories, setFeaturedStories] = useState<Story[]>([]);
  const [newReleases, setNewReleases] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAllStories = async () => {
      try {
        setLoading(true);
        await fetchStories();
        const allStories = useStoryStore.getState().stories;

        if (Array.isArray(allStories)) {
          setFeaturedStories(allStories.slice(0, 10));
          setNewReleases(allStories.slice(5, 15));
        } else {
          setError("Les données récupérées ne sont pas valides.");
        }
      } catch (error) {
        setError("Une erreur est survenue lors du chargement des histoires.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getAllStories();
  }, [fetchStories]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-md p-6 ">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Votre Bibliothèque Personnelle
        </h1>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs defaultValue="later" className="space-y-8">
          <TabsList className="mb-4 bg-white p-1 rounded-lg shadow-md">
            <TabsTrigger
              value="later"
              className="data-[state=active]:bg-blue-100"
            >
              <Clock className="mr-2 h-4 w-4" /> À lire plus tard
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="data-[state=active]:bg-blue-100"
            >
              <Sparkles className="mr-2 h-4 w-4" /> Nouveautés
            </TabsTrigger>
          </TabsList>

          <TabsContent value="later">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {readerLater.length > 0 ? (
                readerLater.map((story) => (
                  <StoryCard key={story._id} story={story} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 text-lg">
                  Vous n'avez pas encore ajouté d'histoire à lire plus tard.
                </p>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="new">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {newReleases.length > 0 ? (
                newReleases.map((story) => (
                  <StoryCard key={story._id} story={story} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 text-lg">
                  Pas de nouvelles histoires pour le moment.
                </p>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Sélection de la semaine
          </h2>
          <Carousel stories={featuredStories}/>
        </section>
      </main>

      <footer className="bg-gray-100 text-center py-4 mt-8">
        <p className="text-sm text-gray-600">
          &copy; 2024 Votre Bibliothèque. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}
