/**
 * FilmCard - Composant Film (extends BaseCard)
 * Single Responsibility: Afficher une carte Film avec infos spécifiques
 * Liskov Substitution: Compatible avec BaseCard
 */

import React from 'react';
import { BaseCard } from './BaseCard';
import { Film, FilmCardProps } from '../../types/base';
import { FILM_TYPES } from '../../constants/base';
import { Badge } from '../ui/badge';

export function FilmCard({
  film,
  isDarkMode = false,
  onEdit,
  onDelete,
  onSelect
}: FilmCardProps) {
  const filmTypeLabel = FILM_TYPES.find(t => t.value === film.type_film)?.label;

  return (
    <BaseCard
      content={film}
      isDarkMode={isDarkMode}
      onEdit={onEdit}
      onDelete={onDelete}
      onSelect={onSelect}
      actions={
        <div className="flex gap-1">
          {filmTypeLabel && (
            <Badge variant="outline" className="text-xs">
              {filmTypeLabel}
            </Badge>
          )}
          {film.duree && (
            <Badge variant="outline" className="text-xs">
              {film.duree}
            </Badge>
          )}
        </div>
      }
    />
  );
}
