'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '../components/button'

const roles = ['TODOS', 'ADMIN', 'CLIENT', 'MECANICO']

export function RoleFilter() {
  const router = useRouter()
  const params = useSearchParams()
  const selected = params.get('role') || 'TODOS'

  const handleFilter = (role: string) => {
    const query = role === 'TODOS' ? '' : `?role=${role}`
    router.push(`/admin/users${query}`)
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {roles.map((role) => (
        <Button
          key={role}
          variant={selected === role ? 'default' : 'outline'}
          onClick={() => handleFilter(role)}
        >
          {role}
        </Button>
      ))}
    </div>
  )
}
