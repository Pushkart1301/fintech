import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={`
        bg-[#111827] border border-[#1F2937] rounded-xl
        ${hover ? 'hover:border-[#374151] hover:shadow-lg hover:shadow-black/20' : ''}
        transition-all duration-300 ease-out
        ${className}
      `}
    >
      {children}
    </div>
  )
}
