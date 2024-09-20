"use client";
import { useStoryStore } from "@/app/api/store/storyStore";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getImageUrl } from "@/utils/imageUrl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/app/api/store/categoryStore";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Story } from "@/types";
import { Clock } from "lucide-react";

const History = () => {
  const { stories, fetchStories, addToReaderLater } = useStoryStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  useEffect(() => {
    fetchStories();
    fetchCategories();
  }, [fetchStories, fetchCategories]);

  const filteredStories =
    selectedCategory === "Tous"
      ? stories
      : stories.filter((story) => story.category === selectedCategory);

  const handleAddToReaderLater = (story: Story) => {
    addToReaderLater(story)
    setSelectedStory(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen w-full">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Plongez dans nos univers captivants
      </h1>
      <div className="flex justify-center mb-8 space-x-4 overflow-x-auto py-2">
        <Button
          onClick={() => setSelectedCategory("Tous")}
          className={`${
            selectedCategory === "Tous"
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-800"
          } hover:bg-gray-700 hover:text-white transition-colors`}
        >
          Tous
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat._id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`${
              selectedCategory === cat.slug
                ? "bg-slate-700 text-white"
                : "bg-zinc-300 "
            }  hover:opacity-90 transition-opacity`}
          >
            {cat.slug}
          </Button>
        ))}
      </div>
      <AnimatePresence>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story, index) => (
            <motion.div
              key={story._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedStory(story)}
            >
              <div className="relative h-64">
                <Image
                  src={getImageUrl(story.coverImage)}
                  alt={story.title}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h2 className="text-2xl font-semibold mb-2">{story.title}</h2>
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                  <Badge className="">{story.category._id}</Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <Dialog
        open={!!selectedStory}
        onOpenChange={() => setSelectedStory(null)}
      >
        {selectedStory && (
          <DialogContent className="sm:max-w-[600px] overflow-hidden p-0 flex items-center flex-col flex-wrap">
            <Image
              src={getImageUrl(selectedStory.coverImage)}
              alt={selectedStory.title}
              width={200}
              height={200}
              className="object-cover"
            />
            <div>
              <DialogTitle className="text-3xl font-bold mb-2">
                {selectedStory.title}
              </DialogTitle>
            </div>
            <div className="p-4">
              <p className="text-lg font-semibold mb-4 leading-relaxed">
                {selectedStory.description}
              </p>
              <div className="flex items-center justify-between mb-6">
                <Badge className="px-3 py-1">
                  {selectedStory.category.slug}
                </Badge>
                <span>Statut: {selectedStory.status}</span>
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
                  onClick={() => handleAddToReaderLater(selectedStory!)}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Lire plus tard
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default History;
