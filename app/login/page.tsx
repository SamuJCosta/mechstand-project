"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // Pode ser email ou username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Ocorreu um erro ao fazer login.");
      return;
    }

    // Guardar tokens no localStorage
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    // Redirecionar conforme o papel do utilizador
    if (data.role === "ADMIN") {
      window.location.href = "/admin";
    } else if (data.role === "MECHANIC") {
      window.location.href = "/mecanico";
    } else {
      window.location.href = "/cliente";
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white p-4 font-poppins">
      <div className="flex flex-col md:flex-row w-full max-w-7xl bg-white overflow-hidden gap-10">
        {/* SEÇÃO DO FORMULÁRIO */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 mr-2">
          {/* LOGO */}
          <div className="flex flex-col items-center mb-6">
            <Image src="/logo.png" alt="MechStand" width={150} height={150} />
            <h1 className="font-poopins text-3xl md:text-6xl font-bold text-black">
              Bem Vindo
            </h1>
            <p className="font-poppins font-normal text-sm text-gray-500 mt-2">
              Estamos felizes por tê-lo de volta!
            </p>
          </div>

          {/* MENSAGEM DE ERRO */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* FORMULÁRIO */}
          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 w-5 h-5 text-black " />
              <input
                type="text"
                placeholder="Utilizador ou Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
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
                required
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-200 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-normal hover:bg-gray-800 transition"
              disabled={loading}
            >
              {loading ? "Aguarde..." : "Próximo"}
            </button>
          </form>

          {/* Login com Google e Facebook */}
          <div className="mt-6">
            <p className="text-sm text-center text-black mb-3">
              Login com Outros
            </p>
            <div className="space-y-3">
              <button className="flex items-center justify-center border px-4 py-3 rounded-lg hover:bg-gray-100 transition w-full text-black font-normal">
                <FcGoogle className="w-6 h-6 mr-2" />
                <span className="text-sm font-medium">
                  Login com <b>Google</b>
                </span>
              </button>
              <button className="flex items-center justify-center border px-4 py-3 rounded-lg hover:bg-gray-100 transition w-full text-black font-normal">
                <FaFacebook className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-sm font-medium">
                  Login com <b>Facebook</b>
                </span>
              </button>
            </div>
          </div>

          {/* Link para Registro */}
          <div className="mt-4 text-center">
            <p className="text-sm text-black">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="text-black font-normal hover:underline"
              >
                Registe-se
              </Link>
            </p>
          </div>
        </div>

        {/* SEÇÃO DA IMAGEM */}
        <div className="hidden md:flex md:w-1/2 h-auto bg-white relative rounded-r-lg overflow-hidden">
          <Image
            src="/Mudanças.png"
            alt="mudancas"
            width={500}
            height={500}
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
