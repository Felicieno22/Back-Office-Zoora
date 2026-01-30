/**
 * BaseCard - Composant de base pour afficher un contenu
 * Single Responsibility: Afficher une carte contenu avec infos essentielles
 * Open/Closed: Extensible pour Film et Série
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MoreVertical } from 'lucide-react';
import { Contenu } from '../../types/base';
import { CONTENT_STATUS_OPTIONS, DEFAULT_THUMBNAIL } from '../../constants/base';

interface BaseCardProps {
  content: Contenu;
  onEdit?: (content: Contenu) => void;
  onDelete?: (contentId: number) => void;
  onSelect?: (content: Contenu) => void;
  isDarkMode?: boolean;
  actions?: React.ReactNode;
}

export function BaseCard({
  content,
  onEdit,
  onDelete,
  onSelect,
  isDarkMode = false,
  actions
}: BaseCardProps) {
  const statusOption = CONTENT_STATUS_OPTIONS.find(s => s.value === content.statut);

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
      {/* Thumbnail */}
      <div
        className="h-48 bg-cover bg-center rounded-t-lg"
        style={{
          backgroundImage: `url('${DEFAULT_THUMBNAIL}')`
        }}
        onClick={() => onSelect?.(content)}
      />

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <CardTitle className="line-clamp-2 text-lg">{content.titre}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {new Date(content.date_sortie).toLocaleDateString('fr-FR')}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              // Ouvrir menu d'actions
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Genres */}
        {content.genres && content.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {content.genres.slice(0, 3).map(genre => (
              <Badge key={genre} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
            {content.genres.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{content.genres.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Synopsis */}
        {content.synopsis && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {content.synopsis}
          </p>
        )}

        {/* Status */}
        {statusOption && (
          <div className="flex justify-between items-center pt-2">
            <Badge className={statusOption.color}>
              {statusOption.label}
            </Badge>
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
