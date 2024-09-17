"use client";
import { useStoryStore } from "@/app/api/store/storyStore";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { motion } from 'framer-motion';
import { getImageUrl } from "@/utils/imageUrl"; // Assurez-vous que cette fonction existe et fonctionne correctement

const History = () => {
  const { stories, fetchStories } = useStoryStore();

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return (
    <div className="container mx-auto px-4 py-8 h-screen w-full">
      <h1 className="text-4xl font-bold mb-8 text-center">Histoire</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((story, index) => (
          <motion.li
            key={story._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-lg list-none overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <div>
               
                 <Image
                 src={getImageUrl(story.coverImage)} // Utiliser getImageUrl pour normaliser le chemin
                 alt={story.title}
                 width={200}
                 height={200}
                 style={{ objectFit: "cover" }}
               />
               
               
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                {story.title}
              </h2>
              <p className="text-gray-600 line-clamp-3">
                {story.description}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <Link href={`/stories/${story._id}`}>
                  <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">
                    Lire l'histoire
                  </div>
                </Link>
              </div>
            </div>
          </motion.li>
        ))}
      </div>
    </div>
  );
};

export default History;
