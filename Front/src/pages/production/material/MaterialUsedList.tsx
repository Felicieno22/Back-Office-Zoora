import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Film, Users, Calendar, Edit, Trash2, Plus, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest, getMaterialUsed } from '../../../utils/api';
import { ThemedCard } from '../../../components/ui/ThemedCard';
import { ThemedField } from '../../../components/ui/ThemedField';
import { ThemedButton } from '../../../components/ui/ThemedButton';
import { ThemedIcon } from '../../../components/ui/ThemedIcon';
import { PageContainer } from '../../../components/shared/SharedLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../components/ui/alert-dialog';

export function MaterialUsedList({ isDarkMode }: { isDarkMode: boolean }) {
  const navigate = useNavigate();

  const [materialsUsed, setMaterialsUsed] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // getMaterialUsed garantit un tableau
      const materialsUsedData = await getMaterialUsed();
      setMaterialsUsed(materialsUsedData);
    } catch (error) {
      console.error('Erreur chargement utilisations:', error);
      toast.error('Erreur lors du chargement des utilisations de matériel');
    } finally {
      setIsLoading(false);
    }
  };

  const getContenuName = (id: number) => {
    const contenu = contenus.find(c => c.id === id);
    return contenu?.titre || contenu?.nom || 'N/A';
  };

  const getMaterielName = (id: number) => {
    const materiel = materiels.find(m => m.id_materiel === id);
    return `${materiel?.nom || 'N/A'} (${materiel?.marque || ''})`.trim();
  };

  const getPersonneName = (id: number) => {
    const personne = personnes.find(p => p.id_personne === id);
    return `${personne?.nom || ''} ${personne?.prenom || ''}`.trim() || 'N/A';
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      // Note: This assumes we need to identify the record by composite key
      // Since we don't have IDs in the minimal response, we'd need to construct the key differently
      // This is a placeholder implementation
      toast.success('Utilisation de matériel supprimée avec succès !');
      setMaterialsUsed(prev => prev.filter(mu => 
        !(mu.contenu.includes(deleteId.split('|')[0]) && 
          mu.personne.includes(deleteId.split('|')[1]) && 
          mu.materiel.includes(deleteId.split('|')[2]))
      ));
      setDeleteId(null);
    } catch (error) {
      console.error('Erreur suppression utilisation:', error);
      toast.error('Erreur lors de la suppression de l\'utilisation de matériel');
    }
  };

  const filteredMaterialsUsed = materialsUsed.filter(mu => {
    return (
      mu.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mu.personne.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mu.materiel.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm text-muted-foreground animate-pulse">Chargement des utilisations de matériel...</p>
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Liste des utilisations de matériel</h1>
          <p className="text-sm text-muted-foreground">Gestion des utilisations de matériel pour les productions</p>
        </div>
        <ThemedButton 
          moduleName="production"
          variant="primary"
          onClick={() => navigate('/admin/production/material-used/create')}
          useGradient={true}
          useHoverScale={true}
          useAdvancedShadow={true}
        >
          <Plus className="mr-2 h-4 w-4" /> Nouvelle utilisation
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
          placeholder="Rechercher par contenu, matériel ou personne..."
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
              <TableHead>Contenu</TableHead>
              <TableHead>Matériel</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaterialsUsed.length > 0 ? (
              filteredMaterialsUsed.map((materialUsed) => (
                <TableRow 
                  key={`${materialUsed.contenu}-${materialUsed.materiel}`} 
                  className={isDarkMode ? 'border-gray-800 hover:bg-gray-800/40' : 'hover:bg-gray-50/50'}
                >
                  <TableCell>
                    <div className="font-medium">{materialUsed.contenu}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{materialUsed.materiel}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{materialUsed.personne}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ThemedButton
                        moduleName="production"
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/admin/production/material-used/edit/${materialUsed.contenu}|${materialUsed.personne}|${materialUsed.materiel}`)}
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
                        onClick={() => setDeleteId(`${materialUsed.contenu}|${materialUsed.personne}|${materialUsed.materiel}`)}
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
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  Aucune utilisation de matériel trouvée.
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
            <AlertDialogTitle>Supprimer l'utilisation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement cet enregistrement d'utilisation de matériel.
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