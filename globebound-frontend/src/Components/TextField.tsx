import React from 'react';

export interface TextFieldProps {
    id: string;
    type: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    min?: string;
    max?: string;
    className?: string;
    label?: string;
}

function TextField({
                       id,
                       type,
                       placeholder,
                       value,
                       onChange,
                       disabled = false,
                       min,
                       max,
                       className = "form-control",
                   }: TextFieldProps) {
    return (
        <div className="form-group">
            <input
                type={type}
                className={`${className} max-width`}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                min={min}
                max={max}
                style={{maxWidth: '500px'}}
            />
        </div>
    );
}

export default TextField;