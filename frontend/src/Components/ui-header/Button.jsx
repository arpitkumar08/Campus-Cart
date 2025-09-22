import React from 'react';

const Button = ({ children, variant = "filled", size = "md", className = "", ...props }) => {
    const base = "rounded-lg font-semibold transition-all duration-200 flex items-center justify-center focus:outline-none";
    const sizes = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-base",
        icon: "p-2"
    };
    const variants = {
        filled: "bg-purple-500 hover:bg-purple-600 text-white shadow-lg",
        ghost: "bg-transparent hover:bg-white/10 text-white",
    };
    return (
        <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
