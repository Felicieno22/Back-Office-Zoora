/**
 * SerieDetails - Détails d'une Série
 * Single Responsibility: Afficher tous les détails d'une série
 */

import React from 'react';
import { Serie, Saison } from '../../types/base';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { SeasonList } from './SeasonList';
import { EpisodeList } from './EpisodeList';

interface SerieDetailsProps {
  serie: Serie;
  saisons?: Saison[];
  isLoadingSaisons?: boolean;
  onAddSeason?: () => void;
  onAddEpisode?: (seasonId: number) => void;
  isDarkMode?: boolean;
}

export function SerieDetails({
  serie,
  saisons = [],
  isLoadingSaisons = false,
  onAddSeason,
  onAddEpisode,
  isDarkMode = false
}: SerieDetailsProps) {
  const [expandedSeasons, setExpandedSeasons] = useState<Set<number>>(new Set());
  const [showSeasonList, setShowSeasonList] = useState(false);
  const [selectedSeasonForEpisodes, setSelectedSeasonForEpisodes] = useState<number | null>(null);

  const toggleSeason = (seasonId: number) => {
    const newExpanded = new Set(expandedSeasons);
    if (newExpanded.has(seasonId)) {
      newExpanded.delete(seasonId);
    } else {
      newExpanded.add(seasonId);
    }
    setExpandedSeasons(newExpanded);
  };

  return (
    <div className="space-y-4">
      {/* Infos générales */}
      <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle className="text-xl">{serie.titre}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-semibold">Synopsis</label>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {serie.synopsis || 'Non disponible'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Date de sortie</label>
              <p className="text-sm mt-1">
                {new Date(serie.date_sortie).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold">Genres</label>
              <div className="flex gap-1 mt-1 flex-wrap">
                {serie.genres?.map(g => (
                  <Badge key={g} variant="secondary" className="text-xs">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vue avec Listes filtrées */}
      {showSeasonList && selectedSeasonForEpisodes ? (
        <div className="space-y-4">
          <Button variant="outline" onClick={() => {
            setSelectedSeasonForEpisodes(null);
            setShowSeasonList(false);
          }}>
            ← Retour aux saisons
          </Button>
          <EpisodeList idSaison={selectedSeasonForEpisodes} />
        </div>
      ) : showSeasonList ? (
        <div className="space-y-4">
          <Button variant="outline" onClick={() => setShowSeasonList(false)}>
            ← Retour
          </Button>
          <SeasonList 
            idSerie={serie.id_serie} 
            onRefresh={() => setShowSeasonList(false)}
          />
        </div>
      ) : (
        <>
          {/* Saisons avec vue simple */}
          <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Saisons ({saisons.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowSeasonList(true)}>
                  Gestion avancée
                </Button>
                <Button
                  size="sm"
                  onClick={onAddSeason}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {isLoadingSaisons ? (
                <p className="text-sm text-gray-500">Chargement...</p>
              ) : saisons.length === 0 ? (
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Aucune saison
                </p>
              ) : (
                <div className="space-y-2">
                  {saisons.map(season => (
                    <div
                      key={season.id_saison}
                      className={`border rounded-lg p-3 ${isDarkMode ? 'border-gray-700 bg-gray-700/50' : 'bg-gray-50'}`}
                    >
                      {/* En-tête Saison */}
                      <button
                        onClick={() => toggleSeason(season.id_saison)}
                        className="w-full flex justify-between items-center"
                      >
                        <div className="text-left">
                          <p className="font-semibold">Saison {season.numero_saison}</p>
                          {season.titre && (
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {season.titre}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSeasonForEpisodes(season.id_saison);
                              setShowSeasonList(true);
                            }}
                            className="text-xs"
                          >
                            Épisodes
                          </Button>
                          {expandedSeasons.has(season.id_saison) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </button>

                      {/* Episodes (expandable) */}
                      {expandedSeasons.has(season.id_saison) && (
                        <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600 space-y-2">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-semibold">
                              Episodes ({season.episodes?.length || 0})
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onAddEpisode?.(season.id_saison)}
                              className="text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Episode
                            </Button>
                          </div>

                          {season.episodes && season.episodes.length > 0 ? (
                            <ul className="space-y-1">
                              {season.episodes.map(episode => (
                                <li
                                  key={episode.id_episode}
                                  className={`text-sm p-2 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-white border'}`}
                                >
                                  <p>
                                    <span className="font-semibold">E{episode.numero_episode}:</span> {episode.titre}
                                  </p>
                                  {episode.duree && (
                                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {episode.duree}
                                    </p>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Aucun épisode
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
