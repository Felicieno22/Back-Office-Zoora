import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon: LucideIcon;
    isDarkMode: boolean;
    iconBgColor?: string;
    rightElement?: React.ReactNode;
}

export function PageHeader({
    title,
    subtitle,
    icon: Icon,
    isDarkMode,
    iconBgColor = 'bg-blue-600',
    rightElement
}: PageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl shadow-lg ${iconBgColor} text-white`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                    </h1>
                    {subtitle && (
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            {rightElement && (
                <div className="flex items-center gap-2">
                    {rightElement}
                </div>
            )}
        </div>
    );
}
