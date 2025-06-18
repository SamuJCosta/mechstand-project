import { prisma } from '@/lib/prisma'
import Image from "next/image"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../../../components/table"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../components/card"
import { Badge } from "../../../../components/domains/shared/ui/badge"
import { UserActions } from "../../../../components/domains/admin/users/useractions"
import { RoleFilter } from "../../../../components/rolefilter"
import { UserRowActions } from "../../../../components/domains/admin/users/userrowactions"

// Define um tipo compatível com o resultado esperado
type UserWithAvaliacoes = {
  id: number
  name: string
  username: string
  email: string
  role: string
  createdAt: Date
  profileImage?: string | null
  avaliacoesRecebidas?: { nota: number }[]
}

export default async function UserList({
  searchParams: rawSearchParams,
}: {
  searchParams: Promise<{ page?: string; role?: string }>
}) {
  const searchParams = await rawSearchParams

  const page = Number(searchParams?.page || 1)
  const pageSize = 10
  const skip = (page - 1) * pageSize

  const roleFilter =
    searchParams?.role && searchParams.role !== "TODOS"
      ? { role: searchParams.role }
      : {}

  const includeRatings =
    roleFilter.role === "MECANICO" || !roleFilter.role

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: roleFilter,
      skip,
      take: pageSize,
      orderBy: { id: "asc" },
      include: includeRatings
        ? {
            avaliacoesRecebidas: {
              select: { nota: true },
            },
          }
        : undefined,
    }),
    prisma.user.count({
      where: roleFilter,
    }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <>
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
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(users as UserWithAvaliacoes[]).map((user) => {
                const notas = user.avaliacoesRecebidas || []
                const media =
                  notas.length > 0
                    ? (notas.reduce((acc, a) => acc + a.nota, 0) / notas.length).toFixed(1)
                    : null

                return (
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
                      <span>
                        {user.name}
                        {user.role === "MECANICO" && media && (
                          <span className="text-xs text-yellow-600 ml-2">
                            ⭐ {media}
                          </span>
                        )}
                      </span>
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
                    <TableCell>
                      <UserRowActions user={user} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
            <span>
              A mostrar {skip + 1}-{Math.min(skip + pageSize, total)} de {total} utilizadores
            </span>
            <div className="flex gap-2">
              <a
                className={`px-3 py-1 border rounded ${page === 1 ? "pointer-events-none opacity-50" : ""}`}
                href={`?page=${page - 1}`}
              >
                Anterior
              </a>
              <a
                className={`px-3 py-1 border rounded ${page === totalPages ? "pointer-events-none opacity-50" : ""}`}
                href={`?page=${page + 1}`}
              >
                Próximo
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
