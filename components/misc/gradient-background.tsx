import React from 'react'

interface GradientBackgroundProps {
  children: React.ReactNode
  className?: string
  from: string
  to: string
}

export function GradientBackground({ children, className = '', from, to }: GradientBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(to bottom, ${from}, ${to})`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

