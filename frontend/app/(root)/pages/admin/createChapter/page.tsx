"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Book, ChevronDown, Info } from "lucide-react";
import { useChapterStore } from "@/app/api/store/chapterStore";
import { useStoryStore } from "@/app/api/store/storyStore";
import toast, { Toaster } from "react-hot-toast";

const CreateChapter = () => {
  const router = useRouter();
  const { createChapter, loading, error } = useChapterStore();
  const { stories, fetchStories } = useStoryStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [selectedStoryId, setSelectedStoryId] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  useEffect(() => {
    setWordCount(content.trim().split(/\s+/).length);
  }, [content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !chapterNumber || !selectedStoryId) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await createChapter(selectedStoryId, {
        title,
        content,
        chapterNumber: parseInt(chapterNumber, 10),
      });
      toast.success("Chapitre créé avec succès.");
      //   router.push(`/stories/${selectedStoryId}`);
    } catch (err) {
      console.error("Erreur lors de la création du chapitre:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <Book className="mr-2" /> Créer un nouveau chapitre
      </h1>

      <div className="mb-6 p-4 bg-blue-50 rounded-md">
        <Toaster position="top-right" />
        <h2 className="text-xl font-semibold mb-2 text-blue-800">
          Conseils pour un bon chapitre
        </h2>
        <ul className="list-disc pl-5 text-blue-700">
          <li>Assurez-vous que le titre est accrocheur et pertinent</li>
          <li>Visez entre 2000 et 5000 mots pour une longueur idéale</li>
          <li>Relisez votre chapitre pour corriger les fautes orthographe</li>
          <li>
            Assurez-vous que le chapitre intègre bien dans une histoire globale
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="story"
            className="block mb-2 font-medium text-gray-700"
          >
            Sélectionner une histoire
          </label>
          <div className="relative">
            <select
              id="story"
              value={selectedStoryId}
              onChange={(e) => setSelectedStoryId(e.target.value)}
              className="w-full px-4 py-2 border rounded-md appearance-none bg-white text-gray-700 pr-8"
              required
            >
              <option value="">Choisissez une histoire</option>
              {stories.map((story) => (
                <option key={story._id} value={story._id}>
                  {story.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div>
          <label
            htmlFor="title"
            className="block mb-2 font-medium text-gray-700"
          >
            Titre du chapitre
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
            placeholder="Entrez le titre du chapitre"
          />
        </div>

        <div>
          <label
            htmlFor="chapterNumber"
            className="block mb-2 font-medium text-gray-700"
          >
            Numéro du chapitre
          </label>
          <input
            type="number"
            id="chapterNumber"
            value={chapterNumber}
            onChange={(e) => setChapterNumber(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
            min="1"
            placeholder="Ex: 1, 2, 3..."
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block mb-2 font-medium text-gray-700"
          >
            Contenu
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            rows={15}
            required
            placeholder="Écrivez le contenu de votre chapitre ici..."
          />
          <p className="mt-2 text-sm text-gray-600">
            Nombre de mots: {wordCount}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Création en cours..." : "Créer le chapitre"}
          </button>

          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <Info className="mr-1" /> Astuces écriture
          </button>
        </div>
      </form>

      {showTips && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-md">
          <h3 className="text-lg font-semibold mb-2 text-yellow-800">
            Astuces écriture
          </h3>
          <ul className="list-disc pl-5 text-yellow-700">
            <li>Commencez par une accroche forte pour captiver le lecteur</li>
            <li>
              Utilisez des descriptions vivantes pour immerger le lecteur dans
              la scène
            </li>
            <li>
              Variez la longueur de vos phrases pour créer un rythme intéressant
            </li>
            <li>
              Terminez le chapitre sur un cliffhanger pour donner envie de lire
              la suite
            </li>
          </ul>
        </div>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default CreateChapter;
