import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface FilterOption {
    value: string;
    label: string;
}

interface FilterBarProps {
    isDarkMode: boolean;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filterValue?: string;
    onFilterChange?: (value: string) => void;
    filterOptions?: FilterOption[];
    filterPlaceholder?: string;
    children?: React.ReactNode;
}

export function FilterBar({
    isDarkMode,
    searchTerm,
    onSearchChange,
    searchPlaceholder = "Rechercher...",
    filterValue,
    onFilterChange,
    filterOptions = [],
    filterPlaceholder = "Filtrer par...",
    children
}: FilterBarProps) {
    return (
        <div className={`p-4 rounded-xl border transition-all ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
            }`}>
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className={`pl-10 h-11 transition-all focus:ring-2 ${isDarkMode
                                ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500/50'
                                : 'bg-gray-50 border-gray-300 focus:ring-blue-500/20'
                            }`}
                    />
                </div>

                {onFilterChange && filterOptions.length > 0 && (
                    <Select value={filterValue} onValueChange={onFilterChange}>
                        <SelectTrigger className={`w-full md:w-56 h-11 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300'
                            }`}>
                            <SelectValue placeholder={filterPlaceholder} />
                        </SelectTrigger>
                        <SelectContent className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}>
                            {filterOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {children}
            </div>
        </div>
    );
}
