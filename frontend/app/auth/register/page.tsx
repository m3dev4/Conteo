"use client";
import { useAuthStore } from "@/app/api/store/authStore";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Feather, Lock, Pencil, Sparkles, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  nameOfUser: z.string().min(3, "Le nom doit compter au moins 3 caractères"),
  username: z
    .string()
    .min(3, "Le nom d'utilisateur doit compter au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit compter au moins 6 caractères"),
});
type RegisterFormData = z.infer<typeof schema>;

const Register = () => {
  const { signup, user, error, loading } = useAuthStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema), // Utilise Zod comme résolveur de validation
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { nameOfUser, username, email, password } = data;
    try {
      await signup(nameOfUser, username, email, password);

      if (user) {
        toast.success(`Welcome, ${user.username}!`);
        router.push("/");
      } else if (error) {
        toast.error(`Erreur d'inscription : ${error}`);
      }
    } catch (err) {
      toast.error(
        "Une erreur s'est produite lors de l'inscription. Veuillez réessayer."
      );
      console.error("Erreur d'inscription :", err); // Log de l'erreur pour le débogage
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 relative overflow-hidden">
      <Toaster position="top-right" />
      <div className="m-auto bg-black bg-opacity-50 p-10 rounded-2xl w-full max-w-5xl flex backdrop-blur-md">
        <div className="w-1/2 pr-10">
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
            Bienvenue dans mon univers de contes
          </h2>
          <div className="space-y-6 mb-8">
            <div className="flex items-center bg-gray-800 bg-opacity-50 rounded-lg p-4 transition-all duration-300 hover:bg-opacity-70">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col">
                  <label className="text-white mb-2">Name</label>
                  <div className="flex border px-2 p-2 outline-none rounded-2xl">
                    <Pencil className="text-purple-400 mr-3" size={24} />
                    <input
                      type="text"
                      placeholder="Taper votre nom"
                      className="bg-transparent border-none w-full text-white placeholder-gray-400 focus:outline-none text-lg"
                      {...register("nameOfUser")}
                    />
                  </div>
                  {errors.nameOfUser && (
                    <p className="text-red-500">{errors.nameOfUser.message}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-white mb-2">Username</label>
                  <div className="flex border px-2 p-2 outline-none rounded-2xl">
                    <User className="text-purple-400 mr-3" size={24} />
                    <input
                      type="text"
                      placeholder="Taper votre username"
                      className="bg-transparent border-none w-full text-white placeholder-gray-400 focus:outline-none text-lg"
                      {...register("username")}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500">{errors.username.message}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-white mb-2">Email</label>
                  <div className="flex border px-2 p-2 outline-none rounded-2xl">
                    <Feather className="text-purple-400 mr-3" size={24} />
                    <input
                      type="email"
                      placeholder="Taper votre email"
                      className="bg-transparent border-none w-full text-white placeholder-gray-400 focus:outline-none text-lg"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-white mb-2">Password</label>
                  <div className="flex border px-2 p-2 outline-none rounded-2xl">
                    <Lock className="text-purple-400 mr-3" size={24} />
                    <input
                      type="password"
                      placeholder="Taper votre password"
                      className="bg-transparent border-none w-full text-white placeholder-gray-400 focus:outline-none text-lg"
                      {...register("password")}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-7 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg mb-6"
                >
                  <Sparkles className="mr-2" />
                  {loading ? "Chargement..." : "S'inscrire"}
                </Button>
                <div className="text-white text-center">
                  Avez vous déjà un compte?{" "}
                  <Link href="/auth/login" className="text-purple-400">
                    Se connecter
                  </Link>
                </div>
              </form>
            </div>
          </div>
          <div className="flex absolute top-0 right-0 justify-center items-center ">
            <Image
              src="/images/illustration.png"
              alt="illustration"
              width={500}
              height={800}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
