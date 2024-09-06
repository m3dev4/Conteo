"use client"
import { useEffect } from "react";
import { useAuthStore } from "@/app/api/store/authStore";

const AppInitializer = () => {
  const loadUserFromLocalStorage = useAuthStore(
    (state) => state.loadUserFromLocalStorage
  );

  useEffect(() => {
    loadUserFromLocalStorage(); // Charger l'utilisateur depuis le stockage local au démarrage
  }, []);

  return null; // Ce composant est juste un initialisateur
};

export default AppInitializer;
