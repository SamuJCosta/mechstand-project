"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../../shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../dropdown-menu";
import { authFetch } from "@/utils/authFetch";
import EditarPerfilModal from "../../publico/editarperfilmodal";

export function User() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    profileImage?: string;
  } | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await authFetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={user?.profileImage || "/userimage.png"}
                alt="User Avatar"
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {user?.name || "Conta"}
            <br />
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button onClick={() => setOpenModal(true)}>Editar Perfil</button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <button>Definições</button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button onClick={handleLogout} className="text-red-500">
              Sign Out
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {openModal && user && (
        <EditarPerfilModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          user={user}
          onUpdate={fetchUser}
        />
      )}
    </>
  );
}
