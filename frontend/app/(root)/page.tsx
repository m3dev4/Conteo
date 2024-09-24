"use client"
import React, { useEffect, useState, useCallback } from "react";
import { useStoryStore } from "@/app/api/store/storyStore";
import { Story } from "@/types";
import { useAuthStore } from "../api/store/authStore";
import InfiniteScroll from 'react-infinite-scroll-component';
import StoryCard from "@/components/StoryCard";

const ITEMS_PER_PAGE = 15; // 5 items per section, 3 sections

export default function Home() {
  const { fetchStories, stories } = useStoryStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [displayedStories, setDisplayedStories] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

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
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stories.map((story) => (
          <StoryCard key={story._id} story={story} />
        ))}
      </div>
    </div>
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
      <div className="w-full h-auto py-7 px-10 flex justify-center items-center flex-col space-y-7">
        <div className="mt-5">
          <h3 className="text-5xl font-bold">
            Hi there👋 <span className="uppercase font-extrabold">
              {user?.username}
            </span>
          </h3>
        </div>
        <InfiniteScroll
          dataLength={displayedStories.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Chargement...</h4>}
        >
          {renderSection("Conteo Original", displayedStories.slice(0, 5))}
          {renderSection("Meilleurs choix pour vous", displayedStories.slice(5, 10))}
          {renderSection("Des histoires suscitant les conversations", displayedStories.slice(10))}
        </InfiniteScroll>
      </div>
    </div>
  );
}