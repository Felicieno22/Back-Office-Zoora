/**
 * FilterBar générique
 * Single Responsibility: Filtrer contenu par genre et statut
 * Open/Closed: Extensible via props
 */

import React from 'react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search } from 'lucide-react';
import { GENRES, CONTENT_STATUS_OPTIONS } from '../../constants/base';

interface FilterBarProps {
  onSearchChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onStatusChange?: (value: string) => void;
  isDarkMode?: boolean;
  showStatusFilter?: boolean;
  placeholder?: string;
}

export function FilterBar({
  onSearchChange,
  onGenreChange,
  onStatusChange,
  isDarkMode = false,
  showStatusFilter = false,
  placeholder = 'Rechercher...'
}: FilterBarProps) {
  return (
    <div className={`flex flex-col gap-4 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg border`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Genre Filter */}
      <Select onValueChange={onGenreChange}>
        <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
          <SelectValue placeholder="Filtrer par genre..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les genres</SelectItem>
          {GENRES.map(genre => (
            <SelectItem key={genre} value={genre}>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter (optionnel) */}
      {showStatusFilter && (
        <Select onValueChange={onStatusChange}>
          <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
            <SelectValue placeholder="Filtrer par statut..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {CONTENT_STATUS_OPTIONS.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
