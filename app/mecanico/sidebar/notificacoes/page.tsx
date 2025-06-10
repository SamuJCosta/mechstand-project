"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/card";
import { Badge } from "@/components/domains/shared/ui/badge";
import { NotificacaoRowActions } from "@/components/domains/mecanico/notificacao/notificacaorowactions";

interface Notificacao {
  id: number;
  mensagem: string;
  lida: boolean;
  createdAt: string;
  reparacaoId?: number;
}

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  const fetchNotificacoes = async () => {
    try {
      const res = await fetch("/api/mecanico/notificacoes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await res.json();
      if (res.ok) setNotificacoes(data.notificacoes);
    } catch (err) {
      console.error("Erro ao buscar notificações");
    }
  };

  useEffect(() => {
    fetchNotificacoes();
  }, []);

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mensagem</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notificacoes.map((n) => (
              <TableRow key={n.id}>
                <TableCell>{n.mensagem}</TableCell>
                <TableCell>
                  <Badge variant={n.lida ? "secondary" : "default"}>
                    {n.lida ? "Lida" : "Por ler"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(n.createdAt).toLocaleDateString("pt-PT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <NotificacaoRowActions
                    id={n.id}
                    lida={n.lida}
                    onRefresh={fetchNotificacoes}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
