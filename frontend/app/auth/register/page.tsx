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
  username: z.string().min(3, "Le nom d'utilisateur doit compter au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit compter au moins 6 caractères"),
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
    resolver: zodResolver(schema),
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
      toast.error("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
      console.error("Erreur d'inscription :", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 relative overflow-hidden">
      <Toaster position="top-right" />
      <div className="m-auto bg-black bg-opacity-50 p-6 sm:p-10 rounded-2xl w-full max-w-5xl flex flex-col lg:flex-row backdrop-blur-md">
        <div className="w-full lg:w-1/2 pr-0 lg:pr-10 mb-8 lg:mb-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
            Bienvenue dans mon univers de contes
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              label="Name"
              name="nameOfUser"
              icon={<Pencil className="text-purple-400 mr-3" size={24} />}
              placeholder="Taper votre nom"
              register={register}
              error={errors.nameOfUser}
            />
            <InputField
              label="Username"
              name="username"
              icon={<User className="text-purple-400 mr-3" size={24} />}
              placeholder="Taper votre username"
              register={register}
              error={errors.username}
            />
            <InputField
              label="Email"
              name="email"
              icon={<Feather className="text-purple-400 mr-3" size={24} />}
              placeholder="Taper votre email"
              register={register}
              error={errors.email}
            />
            <InputField
              label="Password"
              name="password"
              icon={<Lock className="text-purple-400 mr-3" size={24} />}
              placeholder="Taper votre password"
              type="password"
              register={register}
              error={errors.password}
            />
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
              <Link href="/auth/login" className="text-purple-400 hover:underline">
                Se connecter
              </Link>
            </div>
          </form>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <Image
            src="/images/illustration.png"
            alt="illustration"
            width={500}
            height={800}
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, icon, placeholder, type = "text", register, error }) => (
  <div className="flex flex-col">
    <label className="text-white mb-2">{label}</label>
    <div className="flex border px-2 p-2 outline-none rounded-2xl">
      {icon}
      <input
        type={type}
        placeholder={placeholder}
        className="bg-transparent border-none w-full text-white placeholder-gray-400 focus:outline-none text-lg"
        {...register(name)}
      />
    </div>
    {error && <p className="text-red-500 mt-1">{error.message}</p>}
  </div>
);

export default Register;