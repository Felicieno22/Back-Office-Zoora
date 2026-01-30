import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Film, Tv, Globe, Link, Edit, Trash2, Plus, Search, Loader2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest, getSubtitling } from '../../../utils/api';
import { ThemedCard } from '../../../components/ui/ThemedCard';
import { ThemedField } from '../../../components/ui/ThemedField';
import { ThemedButton } from '../../../components/ui/ThemedButton';
import { ThemedIcon } from '../../../components/ui/ThemedIcon';
import { PageContainer } from '../../../components/shared/SharedLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../components/ui/alert-dialog';

export function SubtitlingList({ isDarkMode }: { isDarkMode: boolean }) {
  const navigate = useNavigate();

  const [subtitrages, setSubtitrages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // getSubtitling garantit un tableau
      const subtitragesData = await getSubtitling();
      setSubtitrages(subtitragesData);
    } catch (error) {
      console.error('Erreur chargement sous-titrages:', error);
      toast.error('Erreur lors du chargement des sous-titrages');
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await apiRequest(`/api/soustitrages/${deleteId}`, { method: 'DELETE' });
      setSubtitrages(prev => prev.filter(s => s.id_soustitrage !== deleteId));
      toast.success('Sous-titrage supprimé avec succès !');
      setDeleteId(null);
    } catch (error) {
      console.error('Erreur suppression sous-titrage:', error);
      toast.error('Erreur lors de la suppression du sous-titrage');
    }
  };

  const filteredSubtitrages = subtitrages.filter(s => {
    const titrePrincipal = s.titre_principal || '';
    const contexteComplet = s.contexte_complet || '';
    const langue = s.langue || '';
    
    return (
      titrePrincipal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contexteComplet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      langue.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm text-muted-foreground animate-pulse">Chargement des sous-titrages...</p>
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Liste des sous-titrages</h1>
          <p className="text-sm text-muted-foreground">Gestion des fichiers de sous-titres pour les contenus</p>
        </div>
        <ThemedButton 
          moduleName="production"
          variant="primary"
          onClick={() => navigate('/admin/production/subtitles/create')}
          useGradient={true}
          useHoverScale={true}
          useAdvancedShadow={true}
        >
          <Plus className="mr-2 h-4 w-4" /> Nouveau sous-titrage
        </ThemedButton>
      </div>

      <ThemedCard 
        moduleName="production" 
        className="p-4 mb-6"
        hoverable={true}
        useAdvancedHover={true}
      >
        <ThemedField
          moduleName="production"
          label="Rechercher"
          type="text"
          placeholder="Rechercher par contenu, épisode ou langue..."
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
          icon={Search}
          useAdvancedFocus={true}
          useModernBorder={true}
        />
      </ThemedCard>

      <div className={`rounded-xl border ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'bg-white shadow-sm overflow-hidden'}`}>
        <Table>
          <TableHeader className={isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}>
            <TableRow>
              <TableHead>Titre Principal</TableHead>
              <TableHead>Contexte Complet</TableHead>
              <TableHead>Langue</TableHead>
              <TableHead>Fichier</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date d'ajout</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubtitrages.length > 0 ? (
              filteredSubtitrages.map((subtitrage) => (
                <TableRow 
                  key={subtitrage.id_soustitrage} 
                  className={isDarkMode ? 'border-gray-800 hover:bg-gray-800/40' : 'hover:bg-gray-50/50'}
                >
                  <TableCell>
                    <div className="font-medium">{subtitrage.titre_principal}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">{subtitrage.contexte_complet}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{subtitrage.langue}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-gray-500" />
                      <a 
                        href={subtitrage.url_fichier} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline truncate max-w-xs"
                      >
                        {subtitrage.url_fichier}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    {subtitrage.est_force ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Forcé
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Normal
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {subtitrage.date_ajout ? new Date(subtitrage.date_ajout).toLocaleDateString('fr-FR') : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ThemedButton
                        moduleName="production"
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/admin/production/subtitles/edit/${subtitrage.id_soustitrage}`)}
                        className="h-8 w-8 p-0"
                        useGradient={true}
                        useHoverScale={true}
                        useAdvancedShadow={true}
                      >
                        <Edit className="h-4 w-4" />
                      </ThemedButton>
                      <ThemedButton
                        moduleName="production"
                        variant="error"
                        size="sm"
                        onClick={() => setDeleteId(subtitrage.id_soustitrage)}
                        className="h-8 w-8 p-0"
                        useGradient={true}
                        useHoverScale={true}
                        useAdvancedShadow={true}
                      >
                        <Trash2 className="h-4 w-4" />
                      </ThemedButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  Aucun sous-titrage trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation suppression */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className={isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : ''}>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le sous-titrage ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement ce fichier de sous-titres.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <ThemedButton
              moduleName="production"
              variant="secondary"
              onClick={() => setDeleteId(null)}
              useGradient={true}
              useHoverScale={true}
              useAdvancedShadow={true}
            >
              Annuler
            </ThemedButton>
            <ThemedButton
              moduleName="production"
              variant="error"
              onClick={handleDelete}
              useGradient={true}
              useHoverScale={true}
              useAdvancedShadow={true}
            >
              Supprimer
            </ThemedButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}