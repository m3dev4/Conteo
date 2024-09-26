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
  category: string;
  coverImage: FileList;
};

const CreateHistory: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StoryFormData>();
  const fetchStories = useStoryStore((state) => state.fetchStories);
  const createStory = useStoryStore((state) => state.createStory);
  const loading = useStoryStore((state) => state.loading);

  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const categories = useCategoryStore((state) => state.categories);

  const router = useRouter();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchStories();
    fetchCategories();
  }, [fetchStories, fetchCategories]);

  useEffect(() => {
    Object.values(errors).forEach((error) => {
      if (error) {
        toast.error(error.message);
      }
    });
  }, [errors]);

  const handleCreateStory = async (data: StoryFormData) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);

      if (data.coverImage && data.coverImage.length > 0) {
        formData.append('coverImage', data.coverImage[0]);
      }

      await createStory(formData);
      toast.success("Histoire créée avec succès");
      reset();
      setImagePreview(null);
      router.push('/'); // Rediriger vers la liste des histoires
    } catch (error) {
      console.error(error);
      toast.error("Échec de la création de l'histoire");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="bg-gradient-to-tr w-full from-slate-800 to-gray-800 min-h-screen p-4 md:p-8 flex justify-center items-center flex-col">
      <Toaster position="top-right" />
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center">Créer une nouvelle histoire</h1>
      <div className="w-full max-w-lg md:max-w-md space-y-5">
        <form onSubmit={handleSubmit(handleCreateStory)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white">Titre</label>
            <input
              type="text"
              id="title"
              {...register("title", { required: "Le titre est requis" })}
              className=" mt-1 block py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white">Description</label>
            <textarea
              id="description"
              {...register("description", { required: "La description est requise" })}
              className=" mt-1 block w-full py-9 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows={3}
            ></textarea>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-white">Catégorie</label>
            <select
              id="category"
              {...register("category", { required: "La catégorie est requise" })}
              className=" mt-1 block w-full py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-white">Image de couverture</label>
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              {...register("coverImage", { required: "L'image de couverture est requise" })}
              onChange={handleImageChange}
              className="mt-1 block w-full py-2 text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-4 max-w-full rounded-md" />
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2Icon className="animate-spin inline mr-2" />
                Création en cours...
              </>
            ) : (
              "Créer l'histoire"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateHistory;
