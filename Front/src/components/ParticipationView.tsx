/**
 * ParticipationView - Gestion de l'équipage (casting, crew)
 * Single Responsibility: Afficher et gérer les participations
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, Trash2, Edit, Search } from 'lucide-react';
import { Input } from './ui/input';
import { Participation, Personne, Poste } from '../types/admin';
import { useApi } from '../hooks/useApi';
import { apiRequest } from '../utils/api';
import { ParticipationForm } from './forms/ParticipationForm';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { toast } from 'sonner';

interface ParticipationViewProps {
  isDarkMode?: boolean;
}

export function ParticipationView({ isDarkMode = false }: ParticipationViewProps) {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [personnes, setPersonnes] = useState<Personne[]>([]);
  const [postes, setPostes] = useState<Poste[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedParticipation, setSelectedParticipation] = useState<Participation | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [posteFilter, setPosteFilter] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch participations
        const participationsData = await apiRequest('/api/participations', { method: 'GET' });
        setParticipations(Array.isArray(participationsData) ? participationsData : []);

        // Fetch personnes
        const personnesData = await apiRequest('/api/personnes', { method: 'GET' });
        setPersonnes(Array.isArray(personnesData) ? personnesData : []);

        // Fetch postes
        const postesData = await apiRequest('/api/postes', { method: 'GET' });
        setPostes(Array.isArray(postesData) ? postesData : []);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddParticipation = () => {
    setSelectedParticipation(undefined);
    setIsFormOpen(true);
  };

  const handleEditParticipation = (participation: Participation) => {
    setSelectedParticipation(participation);
    setIsFormOpen(true);
  };

  const handleDeleteParticipation = async () => {
    if (!deleteId) return;
    
    try {
      await apiRequest(`/api/participations/${deleteId}`, { method: 'DELETE' });
      toast.success('Participation supprimée ✓');
      setParticipations(participations.filter(p => p.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleFormSuccess = () => {
    // Recharger les données
    setIsLoading(true);
    fetchData();
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch participations
      const participationsData = await apiRequest('/api/participations', { method: 'GET' });
      setParticipations(Array.isArray(participationsData) ? participationsData : []);

      // Fetch personnes
      const personnesData = await apiRequest('/api/personnes', { method: 'GET' });
      setPersonnes(Array.isArray(personnesData) ? personnesData : []);

      // Fetch postes
      const postesData = await apiRequest('/api/postes', { method: 'GET' });
      setPostes(Array.isArray(postesData) ? postesData : []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPersonneName = (id: number | string): string => {
    const personne = personnes.find(p => (p.id_personne || p.id) === id);
    return personne
      ? `${personne.prenom || ''} ${personne.nom}`.trim()
      : 'Inconnu';
  };

  const getPosteName = (id: number | string): string => {
    const poste = postes.find(p => (p.id_poste || p.id) === id);
    return poste?.nom || 'Inconnu';
  };

  const filteredParticipations = participations
    .filter(p =>
      getPersonneName(p.id_personne || p.idPersonne).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(p =>
      posteFilter === '' || (p.id_poste || p.idPoste) === posteFilter
    );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Équipage & Casting</h1>
        <Button onClick={handleAddParticipation} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une personne
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter by Poste */}
        <div>
          <label className="text-sm font-medium mb-2 block">Filtrer par poste:</label>
          <select
            value={posteFilter}
            onChange={(e) => setPosteFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            <option value="">Tous les postes</option>
            {postes.map((p) => (
              <option key={p.id_poste || p.id} value={p.id_poste || p.id}>
                {p.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParticipations.length === 0 ? (
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            Aucune participation trouvée
          </p>
        ) : (
          filteredParticipations.map(participation => (
            <Card key={`${participation.id_contenu}-${participation.id_personne}-${participation.id_poste}`}
              className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {getPersonneName(participation.id_personne)}
                    </CardTitle>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {getPosteName(participation.id_poste)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditParticipation(participation)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      onClick={() => setDeleteId(participation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {participation.detail_fonction && (
                <CardContent className="pt-0">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {participation.detail_fonction}
                  </p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Forms and Dialogs */}
      <ParticipationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        editData={selectedParticipation}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la participation?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogContent>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteParticipation} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
