"use client";
import { useState, useEffect } from "react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { PasswordStrength } from "../../components/domains/shared/passwordstrenght";
import { useSearchParams } from "next/navigation";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setMessage("Token inválido ou expirado!");
    }
  }, [token]);

  // Enviar requisição para resetar a senha
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("As palavras-passe não coincidem!");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setMessage("Por favor, insira as duas senhas.");
      return;
    }

    if (!token) {
      setMessage("Token não encontrado!");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Senha atualizada com sucesso!");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setMessage(data.error || data.message || "Erro ao redefinir a senha!");
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white p-4 font-poppins">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white overflow-hidden gap-10">
        {/* SEÇÃO DO FORMULÁRIO */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          {/* LOGO */}
          <div className="flex flex-col items-center mb-6">
            <Image src="/logo.png" alt="MechStand" width={150} height={150} />
            <h1 className="font-poppins text-3xl md:text-6xl font-bold text-black">
              Redefinir Senha
            </h1>
            <p className="font-poppins font-normal text-sm text-gray-500 mt-2">
              Insira a nova senha para sua conta.
            </p>
          </div>

          {/* MENSAGEM DE ERRO OU SUCESSO */}
          {message && <p className="text-red-500 text-center mb-4">{message}</p>}

          {/* FORMULÁRIO */}
          {tokenValid ? (
            <form onSubmit={handleResetPassword} className="w-full space-y-4">
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-3 w-5 h-5 text-black" />
                <input
                  type="password"
                  placeholder="Nova palavra-passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-200 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <PasswordStrength password={newPassword} />
              </div>

              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-3 w-5 h-5 text-black" />
                <input
                  type="password"
                  placeholder="Confirmar palavra-passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-200 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-normal hover:bg-gray-800 transition"
                disabled={loading}
              >
                {loading ? "Aguarde..." : "Redefinir Senha"}
              </button>
            </form>
          ) : (
            <p className="text-center text-red-600">{message}</p>
          )}

          {/* Link para Login */}
          <div className="mt-4 text-center">
            <p className="text-sm text-black">
              Lembrou-se da palavra-passe?{" "}
              <a href="/login" className="text-black font-normal hover:underline">
                Fazer Login
              </a>
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

export default ResetPassword;
