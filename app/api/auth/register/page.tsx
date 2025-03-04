"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { TfiEmail } from "react-icons/tfi";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Utilizador:", username, "Email:", email, "Senha:", password, "Confirmar Senha:", confirmPassword);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white p-4 font-poppins">
      {/* CONTAINER PRINCIPAL */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white overflow-hidden">
        {/* SEÇÃO DO FORMULÁRIO */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 mr-2">
          {/* LOGO */}
          <div className="flex flex-col items-center mb-6">
            <Image src="/logo.png" alt="MechStand" width={150} height={150} />
            <h1 className="font-smooch-sans font-bold text-3xl md:text-4xl text-black">Registe-se</h1>
            <p className="font-poppins font-normal text-sm text-gray-500 mt-2">Venha fazer parte da família MechStand!</p>
          </div>

          {/* FORMULÁRIO */}
          <form onSubmit={handleRegister} className="w-full space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 w-5 h-5 text-black" />
              <input
                type="text"
                placeholder="Utilizador"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-200 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div className="relative">
            <TfiEmail className="absolute left-3 top-3 w-5 h-5 text-black" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-200 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

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

            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-3 w-5 h-5 text-black" />
              <input
                type="password"
                placeholder="Confirmar Palavra-Passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-200 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
            >
              Próximo
            </button>
          </form>

          {/* Registo com Google e Facebook */}
          <div className="mt-6">
            <p className="text-sm text-center text-black mb-3 font-semibold">Registo com Outros</p>
            <div className="space-y-3">
              <button className="flex items-center justify-center border px-4 py-3 rounded-lg hover:bg-gray-100 transition w-full text-black font-bold">
                <FcGoogle className="w-6 h-6 mr-2" />
                <span className="text-sm font-medium">Registo com <b>Google</b></span>
              </button>
              <button className="flex items-center justify-center border px-4 py-3 rounded-lg hover:bg-gray-100 transition w-full text-black font-bold">
                <FaFacebook className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-sm font-medium">Registo com <b>Facebook</b></span>
              </button>
            </div>
          </div>
        </div>

        {/* SEÇÃO DA IMAGEM */}
        <div className="hidden md:block md:w-1/2 bg-white relative rounded-r-lg overflow-hidden">
          <Image src="/Mudanças.png" alt="mudancas" layout="fill" objectFit="cover" className="rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default Register;
