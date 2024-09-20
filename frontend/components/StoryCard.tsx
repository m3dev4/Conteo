import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Story } from "@/types";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { getImageUrl } from "@/utils/imageUrl";
import { BookOpen } from "lucide-react";

const StoryCard = ({ story }: { story: Story }) => (
  <Card className="w-64 h-96 m-2 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
    {/* <Image src={getImageUrl(story.coverImage)} alt={story.title} width={100} height={100} /> */}
    <CardContent className="p-4 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {story.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {story.description}
        </p>
      </div>
      <div className="mt-auto">
        <Button variant="outline" className="mt-2 w-full">
          <BookOpen className="mr-2 h-4 w-4" /> Lire
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default StoryCard;
