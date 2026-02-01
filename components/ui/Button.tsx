import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-8 py-3 transition-all duration-300 font-display tracking-wider text-sm sm:text-base uppercase font-semibold flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-royal-gold text-royal-dark hover:bg-white hover:text-royal-red shadow-lg hover:shadow-xl rounded-sm border border-transparent",
    outline: "bg-transparent border border-royal-gold/30 text-royal-gold hover:bg-royal-gold hover:text-royal-dark rounded-sm hover:border-royal-gold",
    text: "bg-transparent text-royal-gold hover:text-white underline-offset-4 hover:underline",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};