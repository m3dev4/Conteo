"use client"
import React, { useEffect, useState } from "react";
import { useStoryStore } from "@/app/api/store/storyStore";
import { useCategoryStore } from "@/app/api/store/categoryStore";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "@/utils/imageUrl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Story } from "@/types";
import { Clock } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { ModeToggle } from "@/components/theme";

const History = () => {
  const { stories, fetchStories, addToReaderLater } = useStoryStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    fetchStories();
    fetchCategories();
  }, [fetchStories, fetchCategories]);

  const filteredStories = selectedCategory
    ? stories.filter((story) => story.category.slug === selectedCategory)
    : [];

  const handleAddToReaderLater = (story) => {
    addToReaderLater(story);
    setSelectedStory(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ModeToggle />
      <h1 className="text-4xl font-bold mb-8 text-center">
        Parcourir les catégories
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {categories.map((category) => (
          <motion.div
            key={category._id}
            className="relative cursor-pointer overflow-hidden  rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            onClick={() => setSelectedCategory(category.slug)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={getImageUrl(category.coverImage)}
              alt={category.name}
              width={300}
              height={200}
              className="object-contain w-full h-40 z-50 relative left-28"
            />
            <div className="absolute inset-0 px-10 flex items-center justify-start">
              <h3 className="text-black text-xl font-bold">{category.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedCategory && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Histoires dans {selectedCategory}
          </h2>
          <AnimatePresence>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStories.map((story, index) => (
                <motion.div
                  key={story._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                  onClick={() => setSelectedStory(story)}
                >
                  <div className="relative h-48">
                    <Image
                      src={getImageUrl(story.coverImage)}
                      alt={story.title}
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{story.title}</h2>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-3">{story.description}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge>{story.category.slug}</Badge>
                      <span className="text-sm text-gray-500">{story.status}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <Dialog
        open={!!selectedStory}
        onOpenChange={() => setSelectedStory(null)}
      >
        {selectedStory && (
          <DialogContent className="sm:max-w-[600px] overflow-hidden p-0 bg-white flex flex-col">
            <div className="relative h-64 w-full">
              <Image
                src={getImageUrl(selectedStory.coverImage)}
                alt={selectedStory.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-6">
              <DialogTitle className="text-3xl font-bold mb-4">
                {selectedStory.title}
              </DialogTitle>
              <p className="text-lg mb-4">{selectedStory.description}</p>
              <div className="flex items-center justify-between mb-6">
                <Badge>{selectedStory.category.slug}</Badge>
                <span className="text-sm text-gray-500">Statut: {selectedStory.status}</span>
              </div>
              <div className="flex justify-between space-x-4">
                <Button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-400 text-white">
                  <Link href={`/pages/history/${selectedStory._id}`}>
                    Lire maintenant
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-2 hover:bg-gray-100"
                  onClick={() => handleAddToReaderLater(selectedStory)}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Lire plus tard
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
      <Toaster />
    </div>
  );
};

export default History;