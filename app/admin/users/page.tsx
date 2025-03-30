import { prisma } from '@/lib/prisma'
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../components/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/card";
import { Badge } from "../../components/badge";
import { UserActions } from "./useractions";
import { RoleFilter } from "../../components/rolefilter";

export default async function UserList({
  searchParams,
}: {
  searchParams: { page?: string; role?: string };
}) {
  const page = Number(searchParams?.page || 1);
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const roleFilter =
    searchParams?.role && searchParams.role !== "TODOS"
      ? { role: searchParams.role }
      : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: roleFilter,
      skip,
      take: pageSize,
      orderBy: { id: "asc" },
    }),
    prisma.user.count({
      where: roleFilter,
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      {/* Botões fora do Card */}
      <div className="flex justify-between items-center px-6 mt-6 mb-4 flex-wrap gap-4">
        <RoleFilter />
        <UserActions />
      </div>

      <Card className="m-4">
        <CardHeader>
          <CardTitle>Utilizadores</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilizador</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center gap-3">
                    <Image
                      src={user.profileImage ?? "/userimage.png"}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                      unoptimized
                    />
                    <span>{user.name}</span>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "ADMIN"
                          ? "default"
                          : user.role === "MECANICO"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("pt-PT")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginação */}
          <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
            <span>
              A mostrar {skip + 1}-{Math.min(skip + pageSize, total)} de {total}{" "}
              utilizadores
            </span>
            <div className="flex gap-2">
              <a
                className={`px-3 py-1 border rounded ${
                  page === 1 ? "pointer-events-none opacity-50" : ""
                }`}
                href={`?page=${page - 1}`}
              >
                Prev
              </a>
              <a
                className={`px-3 py-1 border rounded ${
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }`}
                href={`?page=${page + 1}`}
              >
                Next
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
