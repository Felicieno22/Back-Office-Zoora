import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, XCircle, Filter, Search, Eye, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../../components/ui/card';
import { apiRequest, getValidations } from '../../utils/api';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { ThemedCard } from '../../components/ui/ThemedCard';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { ThemedField } from '../../components/ui/ThemedField';
import { ThemedIcon } from '../../components/ui/ThemedIcon';

interface ValidationListProps {
  isDarkMode: boolean;
}

// Mock data pour les contenus en attente de validation
const mockValidationItems = [
  {
    id: '1',
    type: 'Film',
    title: 'The Last Journey',
    genre: 'Science-Fiction',
    submittedBy: 'John Doe',
    submittedDate: '2024-12-15',
    status: 'En attente',
    thumbnail: 'https://images.unsplash.com/photo-1758592670606-096a0fc94aed?w=300&h=450&fit=crop'
  },
  {
    id: '2',
    type: 'Série',
    title: 'Dark Mysteries',
    genre: 'Thriller',
    submittedBy: 'Jane Smith',
    submittedDate: '2024-12-16',
    status: 'En attente',
    thumbnail: 'https://images.unsplash.com/photo-1688678004647-945d5aaf91c1?w=300&h=450&fit=crop'
  },
  {
    id: '3',
    type: 'Film',
    title: 'Comedy Night',
    genre: 'Comédie',
    submittedBy: 'Mike Johnson',
    submittedDate: '2024-12-17',
    status: 'En attente',
    thumbnail: 'https://images.unsplash.com/photo-1652968171302-5b9e1bb0e0b1?w=300&h=450&fit=crop'
  },
  {
    id: '4',
    type: 'Série',
    title: 'Epic Fantasy',
    genre: 'Fantasy',
    submittedBy: 'Sarah Williams',
    submittedDate: '2024-12-18',
    status: 'En attente',
    thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop'
  },
  {
    id: '5',
    type: 'Film',
    title: 'Action Heroes',
    genre: 'Action',
    submittedBy: 'Tom Brown',
    submittedDate: '2024-12-19',
    status: 'En attente',
    thumbnail: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=450&fit=crop'
  },
];

export function ValidationList({ isDarkMode }: ValidationListProps) {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const fetchPendingItems = async () => {
    setIsLoading(true);
    try {
      // getValidations garantit un tableau
      const data = await getValidations({ statut: 'en_attente' });
      // Backend returns a list of contents with specific fields
      const transformed = data.map((item: any) => ({
        id: item.id || item.idContenu.toString(),
        type: item.estSerie ? 'Série' : 'Film',
        title: item.titre,
        genre: item.genre || 'N/A',
        submittedBy: item.soumisPar || 'System',
        submittedDate: item.dateAjout || new Date().toISOString(),
        status: 'En attente',
        thumbnail: item.thumbnail || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300'
      }));
      setItems(transformed);
    } catch (error) {
      console.error('Failed to fetch pending items:', error);
      toast.error('Erreur lors du chargement des validations');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === 'all' || item.genre === genreFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;

    // Date filter
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const itemDate = new Date(item.submittedDate);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dateFilter === 'today') matchesDate = daysDiff === 0;
      else if (dateFilter === 'week') matchesDate = daysDiff <= 7;
      else if (dateFilter === 'month') matchesDate = daysDiff <= 30;
    }

    return matchesSearch && matchesGenre && matchesDate && matchesType;
  });

  const handleApprove = async (id: string) => {
    const toastId = toast.loading("Approbation en cours...");
    try {
      await apiRequest(`/api/validation/approve/${id}`, { method: 'POST' });
      setItems(items.filter(item => item.id !== id));
      toast.success('Contenu approuvé avec succès', { id: toastId });
    } catch (error) {
      console.error('Approve failed:', error);
      toast.error('Erreur lors de l\'approbation', { id: toastId });
    }
  };

  const handleReject = async (id: string) => {
    const toastId = toast.loading("Rejet en cours...");
    try {
      await apiRequest(`/api/validation/reject/${id}`, { method: 'POST' });
      setItems(items.filter(item => item.id !== id));
      toast.error('Contenu rejeté', { id: toastId });
    } catch (error) {
      console.error('Reject failed:', error);
      toast.error('Erreur lors du rejet', { id: toastId });
    }
  };

  const genres = ['all', ...Array.from(new Set(items.map(i => i.genre)))];

  const pendingCount = items.filter(i => i.status === 'En attente').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ThemedIcon 
            moduleName="validation" 
            icon={CheckCircle2} 
            size="lg" 
            variant="gradient"
            useHover={true}
          />
          <div>
            <h2 className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Validation Admin
            </h2>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              {pendingCount} contenu(s) en attente de validation
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-orange-600/20 text-orange-400 px-4 py-2">
          {pendingCount} en attente
        </Badge>
      </div>

      <ThemedCard 
        moduleName="validation" 
        className="p-4"
        hoverable={true}
        useAdvancedHover={true}
      >
        <div className="flex items-center gap-2 mb-4">
          <ThemedIcon 
            moduleName="validation" 
            icon={Filter} 
            size="sm" 
            variant="gradient"
            useHover={false}
          />
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Filtres
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ThemedField
            moduleName="validation"
            label=""
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(value: string) => setSearchTerm(value)}
            icon={Search}
            useAdvancedFocus={true}
            useModernBorder={true}
          />

          <ThemedField
            moduleName="validation"
            label="Type"
            type="select"
            value={typeFilter}
            onChange={(value: string) => setTypeFilter(value)}
            options={[
              { value: 'all', label: 'Tous les types' },
              { value: 'Film', label: 'Films' },
              { value: 'Série', label: 'Séries' }
            ]}
            useAdvancedFocus={true}
            useModernBorder={true}
          />

          <ThemedField
            moduleName="validation"
            label="Genre"
            type="select"
            value={genreFilter}
            onChange={(value: string) => setGenreFilter(value)}
            options={[
              { value: 'all', label: 'Tous les genres' },
              ...genres.filter(g => g !== 'all').map(genre => ({ value: genre, label: genre }))
            ]}
            useAdvancedFocus={true}
            useModernBorder={true}
          />

          <ThemedField
            moduleName="validation"
            label="Date"
            type="select"
            value={dateFilter}
            onChange={(value: string) => setDateFilter(value)}
            options={[
              { value: 'all', label: 'Toutes les dates' },
              { value: 'today', label: 'Aujourd\'hui' },
              { value: 'week', label: 'Cette semaine' },
              { value: 'month', label: 'Ce mois' }
            ]}
            useAdvancedFocus={true}
            useModernBorder={true}
          />
        </div>
      </ThemedCard>

      <div className={`rounded-lg border overflow-hidden ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <Table>
          <TableHeader>
            <TableRow className={isDarkMode ? 'border-gray-800 hover:bg-gray-800/50' : ''}>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Affiche</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Type</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Titre</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Genre</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Soumis par</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Date</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Statut</TableHead>
              <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Chargement...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Aucun contenu trouvé
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow
                  key={item.id}
                  className={isDarkMode ? 'border-gray-800 hover:bg-gray-800/30' : 'hover:bg-gray-50'}
                >
                  <TableCell>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={
                      item.type === 'Film'
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'bg-purple-600/20 text-purple-400'
                    }>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {item.title}
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {item.genre}
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {item.submittedBy}
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {new Date(item.submittedDate).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={
                      item.status === 'En attente'
                        ? 'bg-yellow-600/20 text-yellow-400'
                        : item.status === 'Approuvé'
                          ? 'bg-green-600/20 text-green-400'
                          : 'bg-red-600/20 text-red-400'
                    }>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <ThemedButton
                        moduleName="validation"
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 p-0"
                        useGradient={true}
                        useHoverScale={true}
                        useAdvancedShadow={true}
                      >
                        <Eye className="w-4 h-4" />
                      </ThemedButton>
                      {item.status === 'En attente' && (
                        <>
                          <ThemedButton
                            moduleName="validation"
                            variant="success"
                            size="sm"
                            onClick={() => handleApprove(item.id)}
                            className="h-8 w-8 p-0"
                            useGradient={true}
                            useHoverScale={true}
                            useAdvancedShadow={true}
                          >
                            <Check className="w-4 h-4" />
                          </ThemedButton>
                          <ThemedButton
                            moduleName="validation"
                            variant="error"
                            size="sm"
                            onClick={() => handleReject(item.id)}
                            className="h-8 w-8 p-0"
                            useGradient={true}
                            useHoverScale={true}
                            useAdvancedShadow={true}
                          >
                            <X className="w-4 h-4" />
                          </ThemedButton>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
