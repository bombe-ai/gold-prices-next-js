import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/10 ${className}`}>
            {children}
        </div>
    );
}
