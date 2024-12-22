import React from 'react'
import { Progress } from '@/components/ui/progress'

interface PasswordStrengthMeterProps {
  password: string
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const calculateStrength = (password: string): number => {
    let strength = 0
    
    if (password.length >= 8) strength += 20
    if (password.match(/[A-Z]/)) strength += 20
    if (password.match(/[a-z]/)) strength += 20
    if (password.match(/[0-9]/)) strength += 20
    if (password.match(/[^A-Za-z0-9]/)) strength += 20
    
    return strength
  }

  const getStrengthText = (strength: number): string => {
    if (strength === 0) return 'No Password'
    if (strength <= 20) return 'Very Weak'
    if (strength <= 40) return 'Weak'
    if (strength <= 60) return 'Medium'
    if (strength <= 80) return 'Strong'
    return 'Very Strong'
  }

  const getStrengthColor = (strength: number): string => {
    if (strength <= 20) return 'bg-red-500'
    if (strength <= 40) return 'bg-orange-500'
    if (strength <= 60) return 'bg-yellow-500'
    if (strength <= 80) return 'bg-green-500'
    return 'bg-emerald-500'
  }

  const strength = calculateStrength(password)
  const strengthText = getStrengthText(strength)
  const strengthColor = getStrengthColor(strength)

  return (
    <div className="space-y-2">
      <Progress 
        value={strength} 
        className={`h-2 ${strengthColor}`}
      />
      <p className="text-sm text-muted-foreground">
        Password Strength: {strengthText}
      </p>
    </div>
  )
}