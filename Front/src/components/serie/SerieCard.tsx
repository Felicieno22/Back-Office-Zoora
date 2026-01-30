/**
 * SerieCard - Composant Série (extends BaseCard)
 * Single Responsibility: Afficher une carte Série avec bouton Saisons
 */

import React from 'react';
import { BaseCard } from '../shared/BaseCard';
import { Serie, SerieCardProps } from '../../types/base';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

export function SerieCard({
  serie,
  isDarkMode = false,
  onEdit,
  onDelete,
  onSelect,
  onAddSeason
}: SerieCardProps) {
  return (
    <BaseCard
      content={serie}
      isDarkMode={isDarkMode}
      onEdit={onEdit}
      onDelete={onDelete}
      onSelect={onSelect}
      actions={
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onAddSeason?.(serie.id_serie);
          }}
          className="flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          <span className="text-xs">Saison</span>
        </Button>
      }
    />
  );
}
