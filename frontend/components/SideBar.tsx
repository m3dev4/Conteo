"use client";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  HomeIcon,
  LibraryBig,
  LogInIcon,
  Pin,
  LogOutIcon,
  LayoutDashboardIcon,
} from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { ModeToggle } from "./theme";
import Link from "next/link";
import { useAuthStore } from "@/app/api/store/authStore"; // Importation de useAuthStore
import { useRouter } from "next/navigation"; // Pour rediriger l'utilisateur

type NavItems = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

const navItems: NavItems[] = [
  {
    label: "Home",
    icon: <HomeIcon />,
    href: "/",
  },
  {
    label: "History",
    icon: <LibraryBig />,
    href: "/pages/history",
  },
  {
    label: "Favorite",
    icon: <Bookmark />,
    href: "/pages/favorite",
  },
];

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isPinned, setIspinned] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // État pour gérer le menu déroulant
  const { user, logout } = useAuthStore(); // Récupère les infos de l'utilisateur et la fonction logout
  const router = useRouter(); // Pour rediriger l'utilisateur

  const toggleSidebar = () => {
    if (!isPinned) {
      setIsOpen(!isOpen);
    }
  };

  const togglePin = () => {
    setIspinned(!isPinned);
    setIsOpen(true);
  };

  const handleLogout = () => {
    logout(); // Appelle la fonction de déconnexion
    router.push("/auth/login"); // Redirige l'utilisateur vers la page de connexion
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div
      className={cn(
        `h-screen bg-gray-800 transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        } relative`
      )}
      onMouseEnter={() => !isPinned && setIsOpen(true)}
      onMouseLeave={() => !isPinned && setIsOpen(false)}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-bold text-white">Conteo</h1>
          {isOpen && (
            <button
              onClick={togglePin}
              className={cn(
                `flex items-center text-gray-300 hover:text-gray-500 ${
                  isPinned ? "text-blue-500" : ""
                }`
              )}
            >
              <Pin size={20} />
            </button>
          )}
        </div>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center p-2 text-gray-400 gap-5 hover:bg-slate-700 rounded-md cursor-pointer"
              >
                {item.icon}
                {isOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            ))}
            {user?.isAdmin && (
              <Link
                href="/pages/admin"
                className="flex items-center p-2 text-gray-400 gap-5 hover:bg-slate-700 rounded-md cursor-pointer"
              >
                <LayoutDashboardIcon size={20} />
                {isOpen && <span className="ml-3">Dashboard</span>}
              </Link>
            )}
          </ul>
        </nav>
      </div>
      <div className="absolute bottom-4 left-4 space-y-4">
        {user ? (
          // Afficher l'avatar, le nom d'utilisateur et le menu déroulant si connecté
          <div className="relative">
            <div
              className="flex items-center text-gray-200 space-x-4 cursor-pointer"
              onClick={toggleDropdown}
            >
              <Image
                src="/icons/utilisateur.png" // Remplace avec la source de l'avatar de l'utilisateur
                alt={user.username}
                width={30}
                height={30}
                className="rounded-full"
              />
              {isOpen && <span className="ml-2">{user.username}</span>}
            </div>
            {isDropdownOpen && (
              <div className="absolute flex flex-row flex-wrap items-center top-0 left-0 mt-[-100px] w-40 bg-gray-700 text-white rounded shadow-lg">
                {isOpen && (
                  <>
                    <div className="flex items-center justify-center ">
                      <Link
                        href="/profile"
                        className="flex items-center justify-center p-4"
                      >
                        profile
                      </Link>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-400 hover:text-red-600 hover:bg-gray-600"
                    >
                      <LogOutIcon size={20} />
                      <span className="ml-2">Logout</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          // Afficher le bouton "Login" si non connecté
          <button className="flex items-center text-gray-200 hover:text-gray-400">
            <LogInIcon size={20} />
            {isOpen && (
              <Link href="/auth/login" className="ml-2">
                Login
              </Link>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default SideBar;