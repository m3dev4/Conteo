"use client";

import RecentRead from "@/components/recentRead";
import RecentRegistration from "@/components/recentRegistration";
import StoriesReadChart from "@/components/storieReadChart";
import { Button } from "@/components/ui/button";
import UserLIst from "@/components/userList";
import { X, Menu } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const IsAdmin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div className=" p-4 lg:p-16 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen  flex flex-col">
        {/* Menu Button */}
        <Button
          className={`${
            menuOpen ? "top-2 right-2" : "top-5 right-7"
          } bg-[#ffffff] absolute p-2 rounded-lg right-4 sm:right-6 md:right-7 z-50`}
          onClick={toggleMenu}
        >
          {menuOpen ? <X color="black" /> : <Menu />}
        </Button>

        {/* Sidebar Menu */}
        {menuOpen && (
          <div className="bg-[#f0eded]  p-3 fixed right-4 sm:right-6 md:right-7 mt-8 top-5 z-40 shadow-lg rounded-lg">
            <ul className="flex flex-col gap-3">
              <li className="list-none">
                <Link href="/pages/admin/categoryList">Catégories</Link>
              </li>
              <li className="list-none">
                <Link href="/pages/admin/createHistory">Crée une histoire</Link>
              </li>
              <li className="list-none">
                <Link href="/pages/admin/createChapter">Crée un chapitre</Link>
              </li>
            </ul>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">
          Dashboard Admin
        </h1>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {/* Card 1 */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 sm:p-6 rounded-xl shadow-lg">
            <h3 className="text-lg sm:text-xl text-white font-bold">
              Nombre total utilisateurs
            </h3>
            <p className="text-2xl sm:text-3xl text-white font-extrabold mt-4">
              1,500
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 sm:p-6 rounded-xl shadow-lg">
            <h3 className="text-lg sm:text-xl text-white font-bold">
              Nombre total histoire
            </h3>
            <p className="text-2xl sm:text-3xl text-white font-extrabold mt-4">
              7,500
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-r from-yellow-400 to-red-500 p-4 sm:p-6 rounded-xl shadow-lg">
            <h3 className="text-lg sm:text-xl text-white font-bold">
              Nouvelle inscription
            </h3>
            <p className="text-2xl sm:text-3xl text-white font-extrabold mt-4">
              150
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="w-full mb-12">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">
            Nombre histoires lues
          </h3>
          <StoriesReadChart />
        </div>

        {/* User List */}
        <UserLIst />

        {/* Recent Registrations and Reads */}
        <div className="flex flex-col gap-6 mt-8">
          <RecentRegistration />
          <RecentRead />
        </div>
      </div>
    </>
  );
};

export default IsAdmin;
