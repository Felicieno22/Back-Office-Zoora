/**
 * SoustitreView - Gestion des sous-titres
 * Single Responsibility: Afficher et gérer les sous-titres
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, Trash2, FileText, Globe } from 'lucide-react';
import { Input } from './ui/input';
import { Soustitrage } from '../types/admin';
import { useApi } from '../hooks/useApi';
import { apiRequest, getSubtitling } from '../utils/api';
import { SoustitreForm } from './forms/SoustitreForm';
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

interface SoustitreViewProps {
  isDarkMode?: boolean;
}

export function SoustitreView({ isDarkMode = false }: SoustitreViewProps) {

  const [subtitles, setSubtitles] = useState<Soustitrage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // getSubtitling garantit un tableau
        const data = await getSubtitling();
        setSubtitles(data);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddSubtitle = () => {
    setIsFormOpen(true);
  };

  const handleDeleteSubtitle = async () => {
    if (!deleteId) return;
    
    try {
      await apiRequest(`/api/soustitres/${deleteId}`, { method: 'DELETE' });
      toast.success('Sous-titre supprimé ✓');
      setSubtitles(subtitles.filter(s => s.id !== deleteId));
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

  const filteredSubtitles = subtitles.filter(subtitle => 
    subtitle.langue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subtitle.url_fichier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // getSubtitling garantit un tableau
      const data = await getSubtitling();
      setSubtitles(data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold">Sous-titres</h1>
        <Button onClick={handleAddSubtitle} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter des sous-titres
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par langue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter: Forced subtitles */}
        <div className="flex gap-2">
          <Button
            variant={languageFilter === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguageFilter('')}
          >
            Tous
          </Button>
          <Button
            variant={languageFilter === 'forced' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguageFilter('forced')}
          >
            Forcés uniquement
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="pt-6">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total sous-titres
            </p>
            <p className="text-2xl font-bold mt-2">{subtitles.length}</p>
          </CardContent>
        </Card>
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="pt-6">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Langues
            </p>
            <p className="text-2xl font-bold mt-2">
              {new Set(subtitles.map(s => s.langue)).size}
            </p>
          </CardContent>
        </Card>
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="pt-6">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Forcés
            </p>
            <p className="text-2xl font-bold mt-2">
              {subtitles.filter(s => s.est_force).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredSubtitles.length === 0 ? (
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            Aucun sous-titre trouvé
          </p>
        ) : (
          filteredSubtitles.map(subtitle => (
            <Card key={subtitle.id_soustitrage} className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-semibold">{subtitle.langue}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {subtitle.url_fichier}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {subtitle.est_force && (
                      <Badge className="bg-orange-500">Forcé</Badge>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setDeleteId(subtitle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className={`text-xs mt-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Ajouté le {new Date(subtitle.date_ajout).toLocaleDateString('fr-FR')}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Forms and Dialogs */}
      <SoustitreForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le sous-titre?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogContent>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSubtitle} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
