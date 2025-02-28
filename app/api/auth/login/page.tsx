"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Utilizador:", email, "Senha:", password);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      {/* CONTAINER PRINCIPAL */}
      <div className="flex w-4/5 h-4/5 bg-white">
        {/* SEÇÃO DO FORMULÁRIO */}
        <div className="w-1/2 flex flex-col justify-center px-12">
          {/* LOGO */}
          <div className="flex flex-col items-center mb-6">
            <Image src="/logo.png" alt="MechStand" width={400} height={400} />
            <h1 className="-mt-10 text-7xl font-bold mt-2 text-black">Bem Vindo</h1>
            <p className="text-sm text-gray-500 mt-2">Estamos felizes por tê-lo de volta!</p>
          </div>

          {/* FORMULÁRIO */}
          <form onSubmit={handleLogin} className="w-full space-y-4">
            {/* Campo de Email */}
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 w-5 h-5 text-black" />
              <input
                type="email"
                placeholder="Utilizador"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-200 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Campo de Senha */}
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-3 w-5 h-5 text-black" />
              <input
                type="password"
                placeholder="Palavra-Passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-200 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
            >
              Próximo
            </button>
          </form>

          {/* Login com Google e Facebook */}
          <div className="mt-6">
            <p className="text-sm text-center text-black mb-3 font-semibold">Login com Outros</p>
            <div className="space-y-3">
              <button className="flex items-center justify-center border px-4 py-3 rounded-lg hover:bg-gray-100 transition w-full text-black font-bold">
                <FcGoogle className="w-6 h-6 mr-2" />
                <span className="text-sm font-medium">Login com <b>Google</b></span>
              </button>
              <button className="flex items-center justify-center border px-4 py-3 rounded-lg hover:bg-gray-100 transition w-full text-black font-bold">
                <FaFacebook className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-sm font-medium">Login com <b>Facebook</b></span>
              </button>
            </div>
          </div>
        </div>

        {/* SEÇÃO DA IMAGEM */}
        <div className="w-1/2 bg-white relative rounded-r-lg overflow-hidden">
          <Image src="/Mudanças.png" alt="mudancas" layout="fill" objectFit="cover" className="rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default Login;