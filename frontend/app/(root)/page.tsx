// "use client"
// import React, { useEffect, useState, useCallback } from "react";
// import { useStoryStore } from "@/app/api/store/storyStore";
// import { useAuthStore } from "../api/store/authStore";
// import InfiniteScroll from 'react-infinite-scroll-component';
// import StoryCard from "@/components/StoryCard";
// import { motion } from "framer-motion";
// import { useMediaQuery } from 'react-responsive';
// import { Story } from "@/types";

// const ITEMS_PER_PAGE = 15; 

// export default function Home() {
//   const { fetchStories, stories } = useStoryStore();
//   const { user } = useAuthStore();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [displayedStories, setDisplayedStories] = useState<Story[]>([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(1);

//   const isMobile = useMediaQuery({ maxWidth: 767 });

//   useEffect(() => {
//     const getAllStories = async () => {
//       try {
//         setLoading(true);
//         await fetchStories();
//         const allStories = useStoryStore.getState().stories as unknown as Story[];

//         if (Array.isArray(allStories)) {
//           setDisplayedStories(allStories.slice(0, ITEMS_PER_PAGE) as Story[]);

//           setHasMore(allStories.length > ITEMS_PER_PAGE);
//         } else {
//           setError(error);
//         }
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getAllStories();
//   }, [fetchStories]);

//   const fetchMoreData = useCallback(() => {
//     const allStories = useStoryStore.getState().stories.map(story => ({
//       ...story,
//       author: typeof story.author === 'string' 
//         ? { _id: story.author, name: '' } // Transforme en objet Author avec un `name` vide
//         : story.author
//     }));
//     const start = ITEMS_PER_PAGE * page;
//     const end = start + ITEMS_PER_PAGE;
//     const newItems = allStories.slice(start, end).map(story => ({
//       ...story,
//       author: {
//         _id: story.author._id || "", // S'assurer que c'est un objet Author
//         name: story.author.name || "",
//       },
//       category: {
//         id: typeof story.category === 'object' && story.category?._id ? story.category._id : '',
//         name: story.category?.name || '',
//         slug: story.category?.slug || '',
//       },
//     }));
    

//     if (newItems.length > 0) {
//       setDisplayedStories(prev => [...prev, ...newItems as Story[]]);

//       setPage(prev => prev + 1);
//     } else {
//       setHasMore(false);
//     }
//   }, [page]);

//   const renderSection = (title, stories) => (
//     <div className="mb-10 mt-32 w-full px-4 sm:px-6 md:px-8">
//       <h2 className="text-2xl sm:text-3xl font-bold mb-4">{title}</h2>
//       <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'} gap-4`}>
//         {stories.map((story) => (
//           <StoryCard key={story._id} story={story} />
//         ))}
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-red-500 text-xl">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full min-h-screen flex justify-between">
//       <div className="w-full h-auto py-7 px-4 sm:px-6 md:flex-wrap md:px-8 flex justify-center items-center flex-col space-y-7">
//         <div className="mt-5 sticky top-0 py-5 bg-white transparent bg-opacity-95 w-full flex justify-center items-center">
//           <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
//             Hi there👋 <span className="uppercase font-extrabold">
//               {user?.username}
//             </span>
//           </h3>
//         </div>
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//         >
//           <InfiniteScroll
//             dataLength={displayedStories.length}
//             next={fetchMoreData}
//             hasMore={hasMore}
//             loader={<h4 className="text-center">Chargement...</h4>}
//           >
//             {renderSection("Conteo Original", displayedStories.slice(0, 5))}
//             {renderSection("Meilleurs choix pour vous", displayedStories.slice(5, 10))}
//             {renderSection("Des histoires suscitant les conversations", displayedStories.slice(10))}
//           </InfiniteScroll>
//         </motion.div>
//       </div>
//     </div>
//   );
// }