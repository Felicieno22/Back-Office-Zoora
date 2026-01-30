/**
 * FilmDetails - Détails d'un Film
 * Single Responsibility: Afficher tous les détails d'un film
 */

import React from 'react';
import { Film } from '../../types/base';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { FILM_TYPES, MUX_STATUS_OPTIONS } from '../../constants/base';

interface FilmDetailsProps {
  film: Film;
  isDarkMode?: boolean;
}

export function FilmDetails({ film, isDarkMode = false }: FilmDetailsProps) {
  const filmType = FILM_TYPES.find(t => t.value === film.type_film);
  const muxStatus = MUX_STATUS_OPTIONS.find(s => s.value === film.mux_status);

  return (
    <div className="space-y-4">
      {/* Infos générales */}
      <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle className="text-xl">{film.titre}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-semibold">Synopsis</label>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {film.synopsis || 'Non disponible'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Type</label>
              <p className="text-sm mt-1">{filmType?.label}</p>
            </div>
            <div>
              <label className="text-sm font-semibold">Durée</label>
              <p className="text-sm mt-1">{film.duree}</p>
            </div>
            <div>
              <label className="text-sm font-semibold">Date de sortie</label>
              <p className="text-sm mt-1">
                {new Date(film.date_sortie).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold">Genres</label>
              <div className="flex gap-1 mt-1 flex-wrap">
                {film.genres?.map(g => (
                  <Badge key={g} variant="secondary" className="text-xs">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Infos Mux */}
      <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle className="text-lg">Informations Mux</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Playback ID</label>
              <p className={`text-sm mt-1 break-all font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {film.mux_playback_id}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold">Asset ID</label>
              <p className={`text-sm mt-1 break-all font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {film.mux_asset_id || 'Non disponible'}
              </p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-semibold">Statut Mux</label>
              <Badge className={`mt-1 ${muxStatus?.color || ''}`}>
                {muxStatus?.label || film.mux_status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Média */}
      {(film.miniature || film.mux_poster_url) && (
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className="text-lg">Médias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {film.miniature && (
              <div>
                <label className="text-sm font-semibold block mb-2">Miniature</label>
                <img
                  src={film.miniature}
                  alt="Miniature"
                  className="w-full max-h-48 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x400?text=No+Image';
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
