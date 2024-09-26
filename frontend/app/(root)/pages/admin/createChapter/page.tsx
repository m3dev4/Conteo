'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Book, ChevronDown, Info } from 'lucide-react';
import { useChapterStore } from '@/app/api/store/chapterStore';
import { useStoryStore } from '@/app/api/store/storyStore';
import toast, { Toaster } from 'react-hot-toast';

export const dynamic = 'force-dynamic'

const CreateChapter = () => {
  const router = useRouter();
  const { createChapter, loading, error } = useChapterStore();
  const { stories, fetchStories } = useStoryStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [chapterNumber, setChapterNumber] = useState('');
  const [selectedStoryId, setSelectedStoryId] = useState('');
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
      toast.error('Veuillez remplir tous les champs.');
      return;
    }
    
    try {
      await createChapter(selectedStoryId, {
        title,
        content,
        chapterNumber: parseInt(chapterNumber, 10)
      });
      toast.success('Chapitre créé avec succès.');
    //   router.push(`/stories/${selectedStoryId}`);
    } catch (err) {
      console.error('Erreur lors de la création du chapitre:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
  <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
    <Book className="mr-2" /> Créer un nouveau chapitre
  </h1>
  
  {/* Formulaire */}
  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Sélection de l'histoire */}
    <div>
      <label htmlFor="story" className="block mb-2 font-medium text-gray-700">Sélectionner une histoire</label>
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

    {/* Titre du chapitre */}
    <div>
      <label htmlFor="title" className="block mb-2 font-medium text-gray-700">Titre du chapitre</label>
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

    {/* Numéro du chapitre */}
    <div>
      <label htmlFor="chapterNumber" className="block mb-2 font-medium text-gray-700">Numéro du chapitre</label>
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

    {/* Contenu du chapitre */}
    <div>
      <label htmlFor="content" className="block mb-2 font-medium text-gray-700">Contenu</label>
      <textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
        rows={15}
        required
        placeholder="Écrivez le contenu de votre chapitre ici..."
      />
      <p className="mt-2 text-sm text-gray-600">Nombre de mots: {wordCount}</p>
    </div>

    {/* Boutons de soumission et astuces */}
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
      <button 
        type="submit" 
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 w-full sm:w-auto"
        disabled={loading}
      >
        {loading ? 'Création en cours...' : 'Créer le chapitre'}
      </button>

      <button
        type="button"
        onClick={() => setShowTips(!showTips)}
        className="text-blue-600 hover:text-blue-800 flex items-center"
      >
        <Info className="mr-1" /> Astuces d'écriture
      </button>
    </div>
  </form>
</div>

  );
};

export default CreateChapter;