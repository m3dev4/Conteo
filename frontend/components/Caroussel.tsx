import React, { useState, useEffect, useRef } from 'react';
import { Story } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Carousel = ({ stories }: { stories: Story[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    if (stories.length > 1) {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % stories.length);
    }
  };

  const prevSlide = () => {
    if (stories.length > 1) {
      setDirection(-1);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + stories.length) % stories.length);
    }
  };

  useEffect(() => {
    if (stories.length > 1) {
      const startTimer = () => {
        timeoutRef.current = setTimeout(nextSlide, 5000);
      };

      startTimer();

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [currentIndex, stories.length]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  if (stories.length === 0) {
    return (
      <div className="flex justify-center items-center h-64  bg-gray-100 rounded-lg">
        <p className="text-lg text-gray-600 text-center">
          Aucune histoire en vedette pour le moment. Revenez bientôt !
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto  overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute w-full "
        >
          <Card className="w-full h-96 overflow-hidden shadow-lg">
            <CardContent className="p-4 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{stories[currentIndex].title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-4">{stories[currentIndex].description}</p>
              </div>
              <div className="mt-auto">
                
                <Button variant="outline" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" /> Lire
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
      {stories.length > 1 && (
        <>
          <Button onClick={prevSlide} className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
            <ChevronLeft />
          </Button>
          <Button onClick={nextSlide} className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
            <ChevronRight />
          </Button>
        </>
      )}
    </div>
  );
};

export default Carousel;