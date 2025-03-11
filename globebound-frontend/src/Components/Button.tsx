import React, { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    color?: string;
    disabled?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

function Button({
                    children,
                    color = 'primary',
                    onClick,
                    disabled = false,
                    type = 'button',
                    className = ''
                }: ButtonProps) {
    return (
        <button
            className={`btn btn-${color} ${className}`}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {children}
        </button>
    );
}

export default Button;