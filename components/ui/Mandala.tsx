import React from 'react';

interface MandalaProps {
  className?: string;
  opacity?: number;
}

export const Mandala: React.FC<MandalaProps> = ({ className = "", opacity = 0.1 }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`animate-[spin_60s_linear_infinite] pointer-events-none ${className}`}
      style={{ opacity }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rub el Hizb / Islamic Geometric 8-point star base */}
      <g stroke="currentColor" strokeWidth="0.8" fill="none">
        <rect x="20" y="20" width="60" height="60" transform="rotate(45 50 50)" />
        <rect x="20" y="20" width="60" height="60" />
      </g>
      
      {/* Inner details */}
      <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <circle cx="50" cy="50" r="5" fill="currentColor" opacity="0.5" />
      
      {/* Decorative dots at corners */}
      <circle cx="50" cy="10" r="1.5" fill="currentColor" />
      <circle cx="90" cy="50" r="1.5" fill="currentColor" />
      <circle cx="50" cy="90" r="1.5" fill="currentColor" />
      <circle cx="10" cy="50" r="1.5" fill="currentColor" />
      
      <circle cx="21" cy="21" r="1" fill="currentColor" />
      <circle cx="79" cy="79" r="1" fill="currentColor" />
      <circle cx="79" cy="21" r="1" fill="currentColor" />
      <circle cx="21" cy="79" r="1" fill="currentColor" />
    </svg>
  );
};