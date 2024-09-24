"use client"
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/app/api/store/authStore";

const ProfilePage = () => {
  const { user, updateUserProfile, fetchUserProfile, loading, error } = useAuthStore();
  const [nameOfUser, setNameOfUser] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchUserProfile(); // Charger le profil utilisateur
  }, [fetchUserProfile]);

  useEffect(() => {
    if (user) {
      setNameOfUser(user.nameOfUser);
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    await updateUserProfile(nameOfUser, username, email);
  };

  const handleDeleteAccount = async () => {
    const confirmation = confirm("Es-tu sûr de vouloir supprimer ton compte ?");
    if (confirmation) {
      await deleteAccount();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <label className="block mb-2">Nom</label>
        <input
          type="text"
          value={nameOfUser}
          onChange={(e) => setNameOfUser(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Nom d'utilisateur</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <button
        onClick={handleUpdateProfile}
        className="bg-blue-500 text-white py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? "Mise à jour en cours..." : "Mettre à jour"}
      </button>

      <button
        onClick={handleDeleteAccount}
        className="bg-red-500 text-white py-2 px-4 rounded mt-4"
        disabled={loading}
      >
        {loading ? "Suppression en cours..." : "Supprimer le compte"}
      </button>
    </div>
  );
};

export default ProfilePage;
