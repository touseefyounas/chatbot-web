

interface InputProps {
    placeholder: string;
    type: string;
    width: 'small' | 'medium' | 'large';
    focusColor: string;
    roundedBorder: 'none' | 'half' | 'full';
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    ref?: React.Ref<HTMLInputElement | null>;
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


const Input = ({placeholder, type, width, focusColor, roundedBorder, value, onChange, disabled, ref}: InputProps) => {

    return (
        <>
        <input 
        ref={ref}
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
        disabled:cursor-not-allowed 
        ${roundedBorderClass[roundedBorder]}`}
        style={{ backgroundColor: 'white' }}
        onFocus={(e) => e.currentTarget.style.backgroundColor = focusColor}
        onBlur={(e) => e.currentTarget.style.backgroundColor = 'white'}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = focusColor}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
        disabled={disabled}
        />
        </>
    )
}

export default Input;