"use client"
import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { getImageUrl } from "@/utils/imageUrl";
import { useRouter } from "next/navigation";
import { useMediaQuery } from 'react-responsive';
import { useAuthStore } from "@/app/api/store/authStore";

const StoryCard = ({ story, children, showAddReader = true }) => {
  const {user} = useAuthStore()
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handleReadNow = (e) => {
    e.preventDefault();
    if (user) {
      router.push(`/pages/history/${story._id}`);
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <>
      <Card
        className={`${isMobile ? 'w-48 h-72' : 'w-64 h-96'} m-2 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer`}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={getImageUrl(story.coverImage)}
          alt={story.title}
          width={isMobile ? 192 : 256}
          height={isMobile ? 192 : 256}
          objectFit="cover"
        />
        <CardContent className="p-4 h-1/3 flex flex-col justify-end">
          <h3 className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold mb-2 line-clamp-2`}>
            {story.title}
          </h3>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-start space-x-4">
              <Image
                src={getImageUrl(story.coverImage)}
                alt={story.title}
                width={isMobile ? 100 : 150}
                height={isMobile ? 150 : 225}
                objectFit="cover"
                className="rounded-md"
              />
              <div>
                <DialogTitle className="mb-2">{story.title}</DialogTitle>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {story.status}
                  </span>
                </div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} line-clamp-4`}>{story.description}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1" onClick={handleReadNow}>
                Lire maintenant
              </Button>
              {showAddReader && (
                <Button variant="outline">
                  +
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoryCard;