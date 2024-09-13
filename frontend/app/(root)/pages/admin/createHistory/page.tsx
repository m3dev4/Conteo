"use client";
import { useCategoryStore } from "@/app/api/store/categoryStore";
import { useStoryStore } from "@/app/api/store/storyStore";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

type StoryFormData = {
  title: string;
  description: string;
  content: string;
  category: string;
  image: FileList;
};

const CreateHistory: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoryFormData>();
  const fetchStories = useStoryStore((state) => state.fetchStories);
  const createStory = useStoryStore((state) => state.createStory);
  const uploadImage = useStoryStore((state) => state.uploadImage);
  const loading = useStoryStore((state) => state.loading);

  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const categories = useCategoryStore((state) => state.categories);

  const navigate = useRouter();

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  useEffect(() => {
    fetchCategories();
  });

  useEffect(() => {
    Object.values(errors).forEach((error) => {
      if (error) {
        toast.error(error.message);
      }
    });
  }, [errors]);

  const handleSubmitSorty = async (data: StoryFormData) => {
    try {
      let imageUrl: string | null = null;

      if (data.image[0]) {
        imageUrl = await uploadFileHandle(data.image[0]);
      }

      const storyData = {
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
      };

      await createStory(storyData); // Assurez-vous que le backend accepte JSON et pas FormData
        if(!storyData){
          toast.error("Failed to create story");
        } else {
          toast.success("Story created successfully");
        }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create story");
    }
  };

  const uploadFileHandle = async (file: File): Promise<string | null> => {
    try {
      const imageUrl = await uploadImage(file); // Appel correct ici
      if (imageUrl) {
        toast.success("Image uploaded successfully");
        return imageUrl; // Utiliser imageUrl ici directement
      }
      return null;
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  return (
    <div className="container sm:mx-0 bg-gradient-to-tr w-full from-slate-800 to-gray-800 h-screen">
      <Toaster position="top-right" />
      <div className="flex justify-center items-center flex-col md:w-full p-10 ml-10 ">
        <h3 className="h-12 font-semibold text-[22px]">Crée un Histoire</h3>
        <div className="flex flex-col w-full p-11 justify-center items-center gap-6">
          <form onSubmit={handleSubmit(handleSubmitSorty)}>
            <div className="one">
              <label className="font-semibold">Titre</label> <br />
              <input
                {...register("title", { required: true })}
                placeholder="Titre de l'histoire"
                className="w-full p-2 py-3 border mt-2 border-gray-300 rounded-md bg-slate-800"
              />
            </div>
            <div className="two">
              <label className="font-semibold">Description</label> <br />
              <input
                {...register("description", { required: true })}
                placeholder="Description de l'histoire"
                className="w-full p-2 py-3 border mt-2 border-gray-300 rounded-md bg-slate-800"
              />
            </div>
            <div className="three">
              <label className="font-semibold">Contenu</label> <br />
              <textarea
                {...register("content", { required: true })}
                placeholder="Contenu de l'histoire"
                className="w-[500px] h-[200px] p-2 py-3 border mt-2 border-gray-300 rounded-md bg-slate-800"
              />
            </div>
            <div className="four">
              <label className="font-semibold">Catégorie</label> <br />
              <select
                {...register("category", { required: true })}
                className="w-full p-2 py-3 border mt-2 border-gray-300 rounded-md bg-slate-800"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="five">
              <label className="font-semibold">Couverture image</label> <br />
              <input
                type="file"
                {...register("image", { required: true })}
                className="w-full p-2 py-3 border mt-2 border-gray-300 rounded-md bg-slate-800"
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
              {loading ? <Loader2Icon className="animate-spin" /> : "Soumettre"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateHistory;
