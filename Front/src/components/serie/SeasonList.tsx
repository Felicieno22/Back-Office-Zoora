/**
 * SeasonList - Gestion des saisons avec CRUD complet
 */

import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Search, ChevronUp, ChevronDown } from "lucide-react";
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
import { apiRequest, getSaisons } from "../../utils/api";
import { Saison, ContentStatus } from "../../types/base";
import { SeasonForm } from "./SeasonForm";

interface SeasonListProps {
  idSerie: number;
  isDarkMode?: boolean;
  onRefresh?: () => void;
}

type SortField = 'numero_saison' | 'titre' | 'date_sortie';
const STATUTS: ContentStatus[] = ['en_attente', 'approuve', 'rejete'];

export function SeasonList({ idSerie, isDarkMode = false, onRefresh }: SeasonListProps) {
  const [saisons, setSaisons] = useState<Saison[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSaison, setSelectedSaison] = useState<Saison | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  // Recherche et filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState<ContentStatus | ''>('');
  const [sortBy, setSortBy] = useState<SortField>('numero_saison');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchSaisons();
  }, [idSerie]);

  const fetchSaisons = async () => {
    try {
      setIsLoading(true);
      // getSaisons garantit un tableau
      const data = await getSaisons({ serieId: idSerie });
      setSaisons(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des saisons');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSaisons = saisons
    .filter(s => (s.titre || '').toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(s => statutFilter === '' || s.statut === statutFilter)
    .sort((a, b) => {
      let aVal: any = a[sortBy] || '';
      let bVal: any = b[sortBy] || '';
      
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? cmp : -cmp;
    });

  const totalPages = Math.ceil(filteredSaisons.length / itemsPerPage);
  const paginatedSaisons = filteredSaisons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteSaison = async () => {
    if (!deleteId) return;
    try {
      await apiRequest('DELETE', `/api/saison/${deleteId}`);
      setSaisons(saisons.filter(s => s.id_saison !== deleteId));
      toast.success('Saison supprimée ✓');
      setDeleteId(null);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleFormSuccess = () => {
    fetchSaisons();
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-32"><p>Chargement...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Saisons ({filteredSaisons.length})</h2>
        <Button onClick={() => {
          setSelectedSaison(undefined);
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
              <SelectItem value="numero_saison">Numéro</SelectItem>
              <SelectItem value="titre">Titre</SelectItem>
              <SelectItem value="date_sortie">Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{filteredSaisons.length}</p>
            <p className="text-sm text-gray-500">Saisons</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-green-600">{filteredSaisons.filter(s => s.statut === 'approuve').length}</p>
            <p className="text-sm text-gray-500">Approuvées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-yellow-600">{filteredSaisons.filter(s => s.statut === 'en_attente').length}</p>
            <p className="text-sm text-gray-500">En attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-red-600">{filteredSaisons.filter(s => s.statut === 'rejete').length}</p>
            <p className="text-sm text-gray-500">Rejetées</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Liste</span>
            <Button variant="outline" size="sm" onClick={() => toggleSort('numero_saison')}>
              <SortIcon field="numero_saison" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedSaisons.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Aucune saison trouvée</p>
            ) : (
              paginatedSaisons.map((saison) => (
                <div key={saison.id_saison} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {saison.miniature && (
                        <img src={saison.miniature} alt={saison.titre} className="w-12 h-16 object-cover rounded" />
                      )}
                      <div>
                        <h3 className="font-semibold">Saison {saison.numero_saison}</h3>
                        {saison.titre && <p className="text-sm text-gray-600">{saison.titre}</p>}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className={getStatusColor(saison.statut)}>
                        {saison.statut === 'en_attente' ? 'En attente' : saison.statut === 'approuve' ? 'Approuvé' : 'Rejeté'}
                      </Badge>
                      {saison.date_sortie && (
                        <span className="text-sm text-gray-500">{new Date(saison.date_sortie).toLocaleDateString('fr-FR')}</span>
                      )}
                      {saison.episodes && (
                        <Badge variant="outline">{saison.episodes.length} épisodes</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => {
                      setSelectedSaison(saison);
                      setIsFormOpen(true);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => setDeleteId(saison.id_saison)}>
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

      <SeasonForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        editData={selectedSaison}
        idSerie={idSerie}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette saison?</AlertDialogTitle>
            <AlertDialogDescription>Irréversible</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogContent>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSaison} className="bg-red-500">Supprimer</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}