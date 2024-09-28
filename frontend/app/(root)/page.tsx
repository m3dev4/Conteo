"use client"
import React, { useEffect, useState, useCallback } from "react";
import { useStoryStore } from "@/app/api/store/storyStore";
import { useAuthStore } from "../api/store/authStore";
import StoryCard from "@/components/StoryCard";
import { motion } from "framer-motion";
import { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ITEMS_PER_PAGE = 15;

export default function Home() {
  const { fetchStories, stories } = useStoryStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [displayedStories, setDisplayedStories] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    const getAllStories = async () => {
      try {
        setLoading(true);
        await fetchStories();
        const allStories = useStoryStore.getState().stories;

        if (Array.isArray(allStories)) {
          setDisplayedStories(allStories.slice(0, ITEMS_PER_PAGE));
          setHasMore(allStories.length > ITEMS_PER_PAGE);
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

  const fetchMoreData = useCallback(() => {
    const allStories = useStoryStore.getState().stories;
    const start = ITEMS_PER_PAGE * page;
    const end = start + ITEMS_PER_PAGE;
    const newItems = allStories.slice(start, end);

    if (newItems.length > 0) {
      setDisplayedStories(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
    } else {
      setHasMore(false);
    }
  }, [page]);

  const renderSection = (title, stories) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10 mt-32 w-full px-4 sm:px-6 md:px-8"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">{title}</h2>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={isMobile ? 1.2 : 5}
        navigation
        pagination={{ clickable: true }}
        className="mySwiper"
      >
        {stories.map((story) => (
          <SwiperSlide key={story._id}>
            <StoryCard story={story} />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
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
    <div className="w-full min-h-screen flex justify-between">
      <div className="w-full h-auto py-7 px-4 sm:px-6 flex justify-center items-center flex-col space-y-7">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-5 sticky top-0 py-5 bg-white bg-opacity-95 w-full z-40 flex justify-center items-center"
        >
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
            Hi there👋 <span className="uppercase font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              {user?.username}
            </span>
          </h3>
        </motion.div>
        {renderSection("Conteo Original", displayedStories.slice(0, 5))}
        {renderSection("Meilleurs choix pour vous", displayedStories.slice(5, 10))}
        {renderSection("Des histoires suscitant les conversations", displayedStories.slice(10))}
      </div>
    </div>
  );
}