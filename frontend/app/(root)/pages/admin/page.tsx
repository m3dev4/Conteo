"use client";

import RecentRead from "@/components/recentRead";
import RecentRegistration from "@/components/recentRegistration";
import StoriesReadChart from "@/components/storieReadChart";
import { Button } from "@/components/ui/button";
import UserLIst from "@/components/userList";
import { Delete, Menu, MenuIcon, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const IsAdmin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div className="p-8 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen ml-11 flex flex-col ">
        <Button
          className={`${
            menuOpen ? "top-2 right-2" : "top-5 right-7"
          }bg-[#161616] fixed p-2 rounded-lg right-7 `}
          onClick={toggleMenu}
        >
          {menuOpen ? (
            <X color="black" />
          ) : (
            <>
              <Menu />
            </>
          )}
        </Button>
        {menuOpen && (
          <div className="bg-[#151515] p-3 fixed right-7 mt-8 top-5 ">
            <ul className="flex flex-col gap-3 ">
              <li className="list-none">
                <Link href="/pages/admin/categoryList">Catgories</Link>
              </li>
              <li className="list-none">
                <Link href="/pages/admin/createHistory">Crée un histoire</Link>
              </li>
              <li className="list-none">
                <Link href="/pages/admin/createChapter">Crée un chapitre</Link>
              </li>
            </ul>
          </div>
        )}

        <h1 className="text-4xl font-extrabold text-white mb-8">
          Dasboard Admin
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 ">
          {/*Card Info */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl text-white font-bold">
              Nombre total utilisateurs
            </h3>
            <p className="text-3xl text-white font-extrabold mt-4">1,500</p>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl text-white font-bold">
              Nombre total histoire
            </h3>
            <p className="text-3xl text-white font-extrabold mt-4">7,500</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-red-500 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl text-white font-bold">
              Nouvelle inscription
            </h3>
            <p className="text-3xl  text-white font-extrabold mt-4">150</p>
          </div>
        </div>
        {/* Section graphique*/}
        <div className="w-full">
          <h3 className="text-4xl font-extrabold text-white mb-8">
            Nombre histoires lues
          </h3>
          <StoriesReadChart />
        </div>
        <UserLIst />
        <div>
          <RecentRegistration />
          <RecentRead />
        </div>
      </div>
    </>
  );
};

export default IsAdmin;
