"use client"
import React, { useEffect, useState } from "react";
import { useCategoryStore } from "@/app/api/store/categoryStore";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type CategoryFormData = {
  name: string;
  coverImage: FileList;
};

const CategoryList: React.FC = () => {
  const {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    removeCategory,
    loading,
    error,
  } = useCategoryStore();

  const { register, handleSubmit, reset } = useForm<CategoryFormData>();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const file = data.coverImage && data.coverImage.length > 0 ? data.coverImage[0] : undefined;
      await createCategory(data.name, file); 
      toast.success("Category created successfully");
      reset();
      fetchCategories();
    } catch (err) {
      toast.error("An error occurred");
      console.log(err);
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

  const handleDelete = async (id: string) => {
    try {
      await removeCategory(id);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      toast.error("An error occurred while deleting");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 md:p-11 w-full h-screen bg-gradient-to-r from-gray-900 to-gray-700">
      <h2 className="text-white text-lg font-bold mb-4">
        Gestion des catégories
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
        <div className="flex flex-col mb-4">
          <label className="text-white mb-2">Nom de la catégorie</label>
          <input
            {...register("name", { required: "Le nom est requis" })}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <input
          type="file"
          id="coverImage"
          accept="image/*"
          {...register("coverImage", { required: "L'image de couverture est requise" })}
          onChange={handleImageChange}
          className="mt-1 block w-full py-2 text-sm text-white"
        />
        <Button type="submit" disabled={loading} className="w-full mt-2">
          {loading ? (
            <LoaderIcon className="animate-spin" />
          ) : editingCategory ? (
            "Mettre à jour la catégorie"
          ) : (
            "Ajouter la catégorie"
          )}
        </Button>
      </form>

      <div className="">
      <ul className="w-full  mt-8 grid grid-cols-3 gap-6">
        {categories?.map((category) => (
          <li key={category._id} className="mb-4 p-4 bg-gray-800 rounded flex flex-1 justify-center items-center">
            <h4 className="text-white font-bold">{category.name}</h4>
            <div className="flex flex-col justify-center items-center gap-4 ">
              <Button
                onClick={() => {
                  setEditingCategory(category._id);
                  reset({ name: category.name });
                }}
                disabled={loading}
                className="mr-2"
              >
                Modifier
              </Button>
              <Button
                onClick={() => handleDelete(category._id)}
                disabled={loading}
                variant="destructive"
                className="bg-red-600"
              >
                Supprimer
              </Button>
            </div>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default CategoryList;
