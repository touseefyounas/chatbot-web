import { useState } from 'react';

interface IconButtonProps {
    children: React.ReactNode;
    hoverColor: 'primary' | 'secondary' | 'accent' | 'success' | 'error';
    roundedBorder: 'none' | 'half' | 'full';
    bgColor: 'primary' | 'secondary' | 'accent' | 'success' | 'error';
    onClick: () => void;
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

const IconButton = ({ children, hoverColor, roundedBorder, bgColor, onClick}: IconButtonProps) => {

    const [pressed, setPressed] = useState(false);
    const [hovered, setHovered] = useState(false);

    const currentBgColor = hovered ? hoverColor : bgColor;


    return (
        <>
        <button
        onClick={onClick} 
        className={`
        cursor-pointer
        border-black 
        border-2 
        p-1
        transition-all duration-100
        ${roundedBorderClass[roundedBorder]}
        ${pressed ? 'translate-x-[3px] translate-y-[3px] shadow-none' : 'shadow-[3px_3px_0px_rgba(0,0,0,1)]'}      
        `}
        style={{ backgroundColor: bgColorStyle[currentBgColor] }}
        onMouseDown={()=> setPressed(true)}
        onMouseUp={()=> setPressed(false)} 
        onMouseLeave={() => setPressed(false)}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        >
        {children}
        </button>
        </>
    )
}

export default IconButton;