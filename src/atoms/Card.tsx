import React from 'react'

interface CardProps {
  children: React.ReactNode;
  bgColor?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
}

const Card = ({ children, bgColor = 'primary', className='p-6'}: CardProps) => {

  const backgroundColor = {
    primary: 'var(--color-bg-primary)',
    secondary: 'var(--color-bg-secondary)',
    tertiary: 'var(--color-bg-tertiary)',
  }
  return (
    <div className={
        `
        border-2 
        border-black  
        shadow-[4px_4px_0px_black]
        overflow-auto
        ${className}
        `}
        style={{ backgroundColor: backgroundColor[bgColor] }}
    >
      {children}
    </div>
  )
}

export default Card;
