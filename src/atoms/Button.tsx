import { useState } from 'react';

interface ButtonProps {
    children: React.ReactNode;
    width?: 'small' | 'medium' | 'large';
    hoverColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'error';
    roundedBorder?: 'none' | 'half' | 'full';
    bgColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'error';
    onClick: () => void;
    disabled?: boolean;
}

const widthClass = {
    small: 'min-w-20',
    medium: 'min-w-24',
    large: 'min-w-32',
}
const roundedBorderClass = {
    none: 'rounded-none',
    half: 'rounded-md',
    full: 'rounded-full',
}

const bgColorStyle = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    accent: 'var(--color-accent)',
    success: 'var(--color-success)',
    error: 'var(--color-error)',
    // Add more colors as needed
}

const Button = ({ children, width ='large', hoverColor='secondary', roundedBorder='full', bgColor='primary', onClick, disabled=false}: ButtonProps) => {

    const [pressed, setPressed] = useState(false);
    const [hovered, setHovered] = useState(false);

    const currentBgColor = hovered ? hoverColor : bgColor;


    return (
        <>
        <button
        onClick={onClick} 
        className={`
        cursor-pointer
        h-12 
        border-black 
        border-2 
        p-2.5
        transition-all duration-100
        ${widthClass[width]}
        ${roundedBorderClass[roundedBorder]}
        ${pressed ? 'translate-x-[3px] translate-y-[3px] shadow-none' : 'shadow-[3px_3px_0px_rgba(0,0,0,1)]'}      
        `}
        style={{ backgroundColor: bgColorStyle[currentBgColor] }}
        onMouseDown={()=> setPressed(true)}
        onMouseUp={()=> setPressed(false)} 
        onMouseLeave={() => setPressed(false)}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        disabled={disabled}
        >
        {children}
        </button>
        </>
    )
}

export default Button;