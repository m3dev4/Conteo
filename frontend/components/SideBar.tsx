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
  Menu,
  UserIcon,
  Book, // Ajout de l'icône utilisateur
} from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { ModeToggle } from "./theme";
import Link from "next/link";
import { useAuthStore } from "@/app/api/store/authStore";
import { useRouter } from "next/navigation";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

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
    label: "Bibliothéque",
    icon: <Book />,
    href: "/pages/library",
  },
];

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isPinned, setIspinned] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

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
    logout();
    router.push("/auth/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {/* Sidebar pour les écrans larges */}
      <div
        className={cn(
          `hidden sm:block h-screen bg-gray-800 transition-all duration-300 z-10 ${
            isOpen ? "w-64" : "w-16"
          } fixed`
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
        {/* Section utilisateur */}
        <div className="absolute bottom-4 left-4 space-y-4">
          {user ? (
            <div className="relative">
              <div
                className="flex items-center text-gray-200 space-x-4 cursor-pointer"
                onClick={toggleDropdown}
              >
                <Image
                  src="/icons/utilisateur.png"
                  alt={user.username}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                {isOpen && <span className="ml-2">{user.username}</span>}
              </div>
              {isDropdownOpen && (
                <div className="absolute flex flex-col bg-gray-700 text-white rounded shadow-lg mt-2">
                  <Link href="/profile" className="p-2 hover:bg-gray-600">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center p-2 text-red-400 hover:text-red-600 hover:bg-gray-600"
                  >
                    <LogOutIcon size={20} />
                    <span className="ml-2">Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="flex items-center text-gray-200 hover:text-gray-400">
              <LogInIcon size={20} />
              <span className="ml-2">Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Bottom navigation pour les mobiles */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-gray-800 z-10 flex justify-around py-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center text-gray-400"
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
        {user?.isAdmin && (
          <Link href="/pages/admin" className="flex flex-col items-center text-gray-400">
            <LayoutDashboardIcon size={20} />
            <span className="text-xs">Dashboard</span>
          </Link>
        )}

        {/* Icône utilisateur pour mobile */}
        <div className="relative flex flex-col items-center text-gray-400">
          <button onClick={toggleDropdown} className="flex flex-col items-center">
            <UserIcon />
            <span className="text-xs">Profile</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute bottom-12 left-0 bg-gray-700 text-white rounded shadow-lg w-40">
              <Link href="/profile" className="block p-2 hover:bg-gray-600">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full p-2 text-red-400 hover:text-red-600 hover:bg-gray-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideBar;
