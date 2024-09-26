"use client";
import { useStoryStore } from "@/app/api/store/storyStore";
import { Category, Story } from "@/types";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getImageUrl } from "@/utils/imageUrl";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/app/api/store/authStore";

const CategoryStory = () => {
  const { slug } = useParams();
  const { stories, loading, error, fetchStoriesByCategory, addToReaderLater } = useStoryStore();
  const [selectStorie, setSelectedStory] = useState<Story | null>(null);
  const { user } = useAuthStore()

  const router = useRouter();

  const handleReadNow = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la navigation par défaut du lien
    if (user) {
      router.push(`/pages/history/${selectStorie._id}`);
    } else {
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    if (slug) {
      const slugString = Array.isArray(slug) ? slug.join(',') : slug;
      fetchStoriesByCategory(slugString);
      console.log(slugString);
      console.log(stories);
    }
  }, [fetchStoriesByCategory, slug]);


  const handleAddToReaderLater = (story: Story) => {
    const storyWithCategoryString = { ...story, category: story.category.toString() }
    addToReaderLater(storyWithCategoryString);
    setSelectedStory(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error} </div>;

  return (
    <div className="w-full container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-items-center flex-col py-10 mt-10">
        <h3 className="text-2xl sm:text-3xl font-semi-bold mb-4 text-center">
          Histoire dans la catégorie: {slug}
        </h3>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {stories.map((story) => (
            <motion.div
              key={story._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              onClick={() => setSelectedStory(story as Story & { category: string })}
            >
              <div className="relative h-48 sm:h-56">
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
                  <h2 className="text-lg sm:text-xl font-semibold mb-2">
                    {story.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                    {story.description}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <Badge>{(story.category as unknown as Category).slug}</Badge>
                  <span className="text-sm text-gray-500">{story.status}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Dialog open={!!selectStorie} onOpenChange={() => setSelectedStory(null)}>
        {selectStorie && (
          <DialogContent className="w-full sm:w-[90%] lg:w-[70%] h-auto max-h-[90vh] overflow-y-scroll p-4 sm:p-6 bg-white flex flex-col">
            <div className="p-6">
              <DialogTitle className="text-2xl sm:text-3xl font-semi-bold mb-4">
                {selectStorie.title}
              </DialogTitle>
              <DialogDescription className="w-full sm:w-[90%] text-base sm:text-lg font-semibold">
                {selectStorie.description}
              </DialogDescription>
              <div className="flex items-center justify-between py-5">
                <Badge>{selectStorie.category.slug}</Badge>
                <span className="text-sm">
                  {new Date(selectStorie.createdAt).toLocaleDateString()}
                </span>
                <span className="text-sm text-gray-500">
                  Statut: {selectStorie.status}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <Button className="w-full sm:flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-400 text-white" onClick={handleReadNow}>
                    Lire maintenant
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:flex-1 border-2 hover:bg-gray-100"
                  onClick={() => handleAddToReaderLater(selectStorie)}
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

export default CategoryStory;
