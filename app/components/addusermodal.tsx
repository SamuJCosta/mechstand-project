import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { TfiEmail } from "react-icons/tfi";
import { useState } from "react";
import { PasswordStrength } from "../components/password";
import { authFetch } from "@/utils/authFetch";


export default function AddUserModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("CLIENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    if (password !== confirmPassword) {
      setError("As palavras-passe não coincidem!");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await authFetch("/api/admin/create", {
        method: "POST",
        body: JSON.stringify({ username, email, password, role }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Erro ao criar utilizador.");
        setLoading(false);
        return;
      }
  
      onClose();
      setLoading(false);
    } catch (error) {
      setError("Erro ao criar utilizador. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto font-poppins">
      <div className="flex min-h-screen items-center justify-center px-4">
        <Dialog.Panel className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-xl">
          {/* LOGO */}
          <div className="flex flex-col items-center mb-6">
            <Image src="/logo.png" alt="MechStand" width={100} height={100} />
            <h1 className="text-3xl md:text-4xl font-bold text-black mt-4">
              Adicionar User
            </h1>
          </div>

          {/* FORM */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 w-5 h-5 text-black" />
              <input
                type="text"
                placeholder="Utilizador"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-100 text-black"
              />
            </div>

            <div className="relative">
              <TfiEmail className="absolute left-3 top-3 w-5 h-5 text-black" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-100 text-black"
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
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-100 text-black"
              />
              <PasswordStrength password={password} />
            </div>

            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-3 w-5 h-5 text-black" />
              <input
                type="password"
                placeholder="Confirmar Palavra-Passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-100 text-black"
              />
            </div>

            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-100 text-black"
              >
                <option value="CLIENT">Cliente</option>
                <option value="MECANICO">Mecânico</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
              disabled={loading}
            >
              {loading ? "A criar..." : "Criar"}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
