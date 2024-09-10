"use client"
import React, { useEffect, useState } from "react";
import { useCategoryStore } from "@/app/api/store/categoryStore";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type CategoryFormData = {
  name: string;
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
      if (editingCategory) {
        await updateCategory(editingCategory, data.name);
        toast.success("Category updated successfully");
        setEditingCategory(null);
      } else {
        await createCategory(data.name);
        toast.success("Category created successfully");
      }
      reset();
      fetchCategories();
    } catch (err) {
      toast.error("An error occurred");
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
    <div className="flex flex-col justify-center items-center p-11  w-full h-screen bg-gradient-to-r from-gray-900 to-gray-700">
      <h2 className="text-white text-lg font-bold mb-4">
        Gestion des catégories
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
        <div className="flex flex-col mb-4">
          <label className="text-white mb-2">Nom de la catégorie</label>
          <input
            {...register("name", { required: "Le nom est requis" })}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <LoaderIcon className="animate-spin" />
          ) : editingCategory ? (
            "Mettre à jour la catégorie"
          ) : (
            "Ajouter la catégorie"
          )}
        </Button>
      </form>

      <ul className="w-full max-w-md mt-8">
        {categories?.map((category) => (
          <li key={category._id} className="mb-4 p-4 bg-gray-800 rounded flex justify-between items-center">
            <h4 className="text-white font-bold">{category.name}</h4>
            <div>
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
              >
                Supprimer
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
