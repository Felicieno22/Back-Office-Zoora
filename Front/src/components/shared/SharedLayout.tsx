import React from 'react';

interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
    return (
        <div className={`space-y-6 animate-in fade-in duration-500 ${className}`}
             style={{ 
                 backgroundColor: '#0F172A', // Fond principal Zoora
                 color: '#F1F5F9' // Texte principal Zoora
             }}>
            {children}
        </div>
    );
}

interface SectionCardProps {
    children: React.ReactNode;
    isDarkMode?: boolean; // Garder pour compatibilité
    className?: string;
    padding?: string;
}

export function SectionCard({ children, isDarkMode = true, className = '', padding = 'p-6' }: SectionCardProps) {
    return (
        <div className={`rounded-xl border shadow-sm transition-all duration-300 ${padding} ${className}`}
             style={{ 
                 backgroundColor: '#0F172A', // Fond principal Zoora
                 borderColor: 'rgba(241, 245, 249, 0.2)', // Bordure Zoora
                 color: '#F1F5F9', // Texte principal Zoora
                 boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.3), 0 2px 4px -1px rgba(15, 23, 42, 0.2)'
             }}>
            {children}
        </div>
    );
}
