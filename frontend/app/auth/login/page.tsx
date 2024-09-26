"use client";
import { useAuthStore } from "@/app/api/store/authStore";
import { Feather, Lock, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit compter au moins 6 caractères"),
});

type LoginFormData = z.infer<typeof schema>;

const Login = () => {
  const { login, user, error, loading } = useAuthStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const { email, password } = data;
    await login(email, password);

    if (user) {
      toast.success(`Happy to see you, ${user.username}!`);
      router.push("/");
    } else if (error) {
      toast.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 relative overflow-hidden">
      <Toaster position="top-right" />
      <div className="m-auto bg-black bg-opacity-50 p-6 sm:p-10 rounded-2xl w-full max-w-5xl flex flex-col lg:flex-row backdrop-blur-md">
        <div className="w-full lg:w-1/2 pr-0 lg:pr-10 mb-8 lg:mb-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
            Entrez dans mon univers de contes
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
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
              {errors.password && <p className="text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-7 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg mb-6"
            >
              <Sparkles className="mr-2" />
              {loading ? "Chargement..." : "Se connecter"}
            </Button>
            <div className="text-white text-center">
              Vous n'avez pas encore de compte ?{" "}
              <Link href="/auth/register" className="text-purple-400 hover:underline">
                S'inscrire
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

export default Login;