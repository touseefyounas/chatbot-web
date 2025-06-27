

interface InputProps {
    placeholder: string;
    type: string;
    width: 'small' | 'medium' | 'large';
    focusColor: string;
    roundedBorder: 'none' | 'half' | 'full';
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const widthClass = {
    small: 'max-w-48',
    medium: 'max-w-72',
    large: 'max-w-96',
}

const roundedBorderClass = {
    none: 'rounded-none',
    half: 'rounded-md',
    full: 'rounded-full',
}


const Input = ({placeholder, type, width, focusColor, roundedBorder, value, onChange}: InputProps) => {

    return (
        <>
        <input 
        value={value}
        onChange={onChange}
        type={type} 
        placeholder={placeholder} 
        className={`${widthClass[width]} 
        border-black 
        border-2 
        p-2.5 
        transition-all duration-100
        focus:outline-none 
        focus:shadow-[3px_3px_0px_rgba(0,0,0,1)]
        active:shadow-[3px_3px_0px_rgba(0,0,0,1)] 
        ${roundedBorderClass[roundedBorder]}`}
        style={{ backgroundColor: 'white' }}
        onFocus={(e) => e.currentTarget.style.backgroundColor = focusColor}
        onBlur={(e) => e.currentTarget.style.backgroundColor = 'white'}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = focusColor}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
        />
        </>
    )
}

export default Input;