import React from 'react';

type BadgeVariant = 'default' | 'neutral' | 'success' | 'warning' | 'error' | 'brand';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    size = 'md',
    className = ''
}) => {
    const variants = {
        default: 'bg-blue-50 text-blue-700 border-blue-200',
        neutral: 'bg-gray-50 text-gray-600 border-gray-200',
        success: 'bg-green-50 text-green-700 border-green-200',
        warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        error: 'bg-red-50 text-red-700 border-red-200',
        brand: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
    };

    const variantStyle = variants[variant as keyof typeof variants] || variants.default;
    const sizeStyle = sizes[size];

    return (
        <span className={`inline-flex items-center rounded-full border font-medium ${variantStyle} ${sizeStyle} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
