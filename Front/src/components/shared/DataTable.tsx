import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Loader2, Inbox } from 'lucide-react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
    align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    isDarkMode: boolean;
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
    keyExtractor: (item: T) => string | number;
}

export function DataTable<T>({
    columns,
    data,
    loading,
    isDarkMode,
    onRowClick,
    emptyMessage = "Aucune donnée trouvée",
    keyExtractor
}: DataTableProps<T>) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className={`w-10 h-10 animate-spin ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`} />
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Chargement des données...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className={`p-4 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <Inbox className={`w-10 h-10 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <div>
                    <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{emptyMessage}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Essayez de modifier vos filtres ou de faire une nouvelle recherche.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className={isDarkMode ? 'border-gray-800 hover:bg-transparent' : 'border-gray-100 hover:bg-transparent'}>
                        {columns.map((col, idx) => (
                            <TableHead
                                key={idx}
                                className={`
                  ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-semibold py-4
                  ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                  ${col.className || ''}
                `}
                            >
                                {col.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow
                            key={keyExtractor(item)}
                            onClick={() => onRowClick?.(item)}
                            className={`
                group transition-colors duration-200 
                ${isDarkMode ? 'border-gray-800 hover:bg-gray-900/50' : 'border-gray-100 hover:bg-gray-50/50'}
                ${onRowClick ? 'cursor-pointer' : ''}
              `}
                        >
                            {columns.map((col, idx) => (
                                <TableCell
                                    key={idx}
                                    className={`
                    py-4 
                    ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                    ${col.className || ''}
                  `}
                                >
                                    {typeof col.accessor === 'function'
                                        ? col.accessor(item)
                                        : (item[col.accessor] as React.ReactNode)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
