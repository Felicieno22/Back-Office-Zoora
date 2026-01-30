/**
 * EpisodeList - Gestion des épisodes avec CRUD complet
 */

import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Search, ChevronUp, ChevronDown, Play } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "sonner";
import { apiRequest, getEpisodes } from "../../utils/api";
import { Episode, ContentStatus } from "../../types/base";
import { EpisodeForm } from "./EpisodeForm";

interface EpisodeListProps {
  idSaison: number;
  isDarkMode?: boolean;
  onRefresh?: () => void;
}

type SortField = 'numero_episode' | 'titre' | 'date_sortie' | 'duree';
const STATUTS: ContentStatus[] = ['en_attente', 'approuve', 'rejete'];

export function EpisodeList({ idSaison, isDarkMode = false, onRefresh }: EpisodeListProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  // Recherche et filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState<ContentStatus | ''>('');
  const [sortBy, setSortBy] = useState<SortField>('numero_episode');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEpisodes();
  }, [idSaison]);

  const fetchEpisodes = async () => {
    try {
      setIsLoading(true);
      // getEpisodes garantit un tableau
      const data = await getEpisodes({ saisonId: idSaison });
      setEpisodes(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des épisodes');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEpisodes = episodes
    .filter(e => (e.titre || '').toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(e => statutFilter === '' || e.statut === statutFilter)
    .sort((a, b) => {
      let aVal: any = a[sortBy] || '';
      let bVal: any = b[sortBy] || '';
      
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? cmp : -cmp;
    });

  const totalPages = Math.ceil(filteredEpisodes.length / itemsPerPage);
  const paginatedEpisodes = filteredEpisodes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteEpisode = async () => {
    if (!deleteId) return;
    try {
      await apiRequest('DELETE', `/api/episode/${deleteId}`);
      setEpisodes(episodes.filter(e => e.id_episode !== deleteId));
      toast.success('Épisode supprimé ✓');
      setDeleteId(null);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleFormSuccess = () => {
    fetchEpisodes();
    onRefresh?.();
    setCurrentPage(1);
  };

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return <span className="text-xs text-gray-400">⇅</span>;
    return sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  };

  const getStatusColor = (status: ContentStatus): string => {
    const colors: { [key: string]: string } = {
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'approuve': 'bg-green-100 text-green-800',
      'rejete': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getMuxStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      'ready': 'bg-green-100 text-green-800',
      'preparing': 'bg-blue-100 text-blue-800',
      'errored': 'bg-red-100 text-red-800',
      'deleted': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-32"><p>Chargement...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Épisodes ({filteredEpisodes.length})</h2>
        <Button onClick={() => {
          setSelectedEpisode(undefined);
          setIsFormOpen(true);
        }} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par titre..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select value={statutFilter} onValueChange={(value: any) => {
            setStatutFilter(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {STATUTS.map(s => (
                <SelectItem key={s} value={s}>
                  {s === 'en_attente' ? 'En attente' : s === 'approuve' ? 'Approuvé' : 'Rejeté'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => {
            setSortBy(value);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="numero_episode">Numéro</SelectItem>
              <SelectItem value="titre">Titre</SelectItem>
              <SelectItem value="date_sortie">Date</SelectItem>
              <SelectItem value="duree">Durée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{filteredEpisodes.length}</p>
            <p className="text-sm text-gray-500">Épisodes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-green-600">{filteredEpisodes.filter(e => e.statut === 'approuve').length}</p>
            <p className="text-sm text-gray-500">Approuvés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-blue-600">{filteredEpisodes.filter(e => e.mux_status === 'ready').length}</p>
            <p className="text-sm text-gray-500">Prêts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-yellow-600">{filteredEpisodes.filter(e => e.mux_status === 'preparing').length}</p>
            <p className="text-sm text-gray-500">Préparation</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Liste</span>
            <Button variant="outline" size="sm" onClick={() => toggleSort('numero_episode')}>
              <SortIcon field="numero_episode" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedEpisodes.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Aucun épisode trouvé</p>
            ) : (
              paginatedEpisodes.map((episode) => (
                <div key={episode.id_episode} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {episode.mux_poster_url && (
                        <img src={episode.mux_poster_url} alt={episode.titre} className="w-12 h-16 object-cover rounded" />
                      )}
                      {!episode.mux_poster_url && (
                        <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <Play className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">Épisode {episode.numero_episode}</h3>
                        <p className="text-sm text-gray-600">{episode.titre}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className={getStatusColor(episode.statut)}>
                        {episode.statut === 'en_attente' ? 'En attente' : episode.statut === 'approuve' ? 'Approuvé' : 'Rejeté'}
                      </Badge>
                      <Badge className={getMuxStatusColor(episode.mux_status)}>
                        {episode.mux_status === 'ready' ? 'Prêt' : episode.mux_status === 'preparing' ? 'Préparation' : episode.mux_status === 'errored' ? 'Erreur' : 'Supprimé'}
                      </Badge>
                      {episode.duree && (
                        <span className="text-sm text-gray-500">{episode.duree}</span>
                      )}
                      {episode.date_sortie && (
                        <span className="text-sm text-gray-500">{new Date(episode.date_sortie).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => {
                      setSelectedEpisode(episode);
                      setIsFormOpen(true);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => setDeleteId(episode.id_episode)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <p className="text-sm text-gray-500">Page {currentPage} sur {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                  Précédent
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <EpisodeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        editData={selectedEpisode}
        idSaison={idSaison}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet épisode?</AlertDialogTitle>
            <AlertDialogDescription>Irréversible</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogContent>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEpisode} className="bg-red-500">Supprimer</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}