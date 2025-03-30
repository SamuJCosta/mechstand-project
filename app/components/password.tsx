'use client'

import { useEffect, useState } from 'react'

interface Props {
  password: string
}

export function PasswordStrength({ password }: Props) {
  const [score, setScore] = useState(0)

  const requirements = [
    (pw: string) => pw.length >= 8,
    (pw: string) => /[A-Z]/.test(pw),
    (pw: string) => /[a-z]/.test(pw),
    (pw: string) => /\d/.test(pw),
    (pw: string) => /[\W_]/.test(pw),
  ]

  useEffect(() => {
    const passed = requirements.filter((test) => test(password)).length
    setScore(passed)
  }, [password])

  const getLabel = () => {
    if (score <= 2) return 'Fraca'
    if (score === 3 || score === 4) return 'Média'
    return 'Forte'
  }

  const getColor = () => {
    if (score <= 2) return 'bg-red-500'
    if (score === 3 || score === 4) return 'bg-yellow-500'
    return 'bg-green-600'
  }

  return (
    <div className="mt-2">
      <div className="flex gap-1 h-2 mb-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm transition-all duration-300 ${
              i < score ? getColor() : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      <p className="text-sm font-medium text-gray-600 ml-1">
        Segurança: <span className={getColor().replace('bg-', 'text-')}>{getLabel()}</span>
      </p>
    </div>
  )
}
