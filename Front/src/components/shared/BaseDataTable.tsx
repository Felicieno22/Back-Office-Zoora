/**
 * BaseDataTable - Table générique réutilisable
 * Single Responsibility: Afficher données en tableau
 * Open/Closed: Extensible via colonnes personnalisées
 */

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
  sortable?: boolean;
}

interface BaseDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  isDarkMode?: boolean;
}

export function BaseDataTable<T extends { [key: string]: any }>({
  data,
  columns,
  isLoading = false,
  isEmpty = false,
  emptyMessage = 'Aucun élément trouvé',
  onRowClick,
  actions,
  isDarkMode = false
}: BaseDataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isEmpty || data.length === 0) {
    return (
      <div className={`flex justify-center items-center h-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader className={isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}>
          <TableRow>
            {columns.map(column => (
              <TableHead
                key={String(column.key)}
                className={`${column.width ? `w-${column.width}` : ''} font-semibold`}
              >
                {column.label}
              </TableHead>
            ))}
            {actions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={index}
              onClick={() => onRowClick?.(item)}
              className={`${onRowClick ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}
            >
              {columns.map(column => (
                <TableCell key={String(column.key)}>
                  {column.render
                    ? column.render(item[column.key], item)
                    : String(item[column.key] ?? '-')}
                </TableCell>
              ))}
              {actions && (
                <TableCell className="text-right">{actions(item)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
