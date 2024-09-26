"use client"
import React, { useEffect } from "react";
import { useCategoryStore } from "@/app/api/store/categoryStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getImageUrl } from "@/utils/imageUrl";
import { ModeToggle } from "@/components/theme";

const History = () => {
  const { categories, fetchCategories } = useCategoryStore();
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryClick = (categorySlug) => {
    router.push(`/pages/history/category/${categorySlug}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center">
        Parcourir les catégories
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {categories.map((category) => (
          <motion.div
            key={category._id}
            className="relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            onClick={() => handleCategoryClick(category.slug)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={getImageUrl(category.coverImage)}
              alt={category.name}
              width={500}
              height={300}
              className="object-cover w-full h-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-75 flex items-center justify-start p-4">
              <h3 className="text-white text-sm sm:text-md md:text-xl font-bold">
                {category.name}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default History;
