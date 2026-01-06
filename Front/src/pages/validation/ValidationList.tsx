import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { CheckCircle2, XCircle, Search, Filter, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Card } from '../../components/ui/card';

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
  const [items, setItems] = useState(mockValidationItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

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

  const handleApprove = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: 'Approuvé' } : item
    ));
    toast.success('Contenu approuvé avec succès');
  };

  const handleReject = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: 'Rejeté' } : item
    ));
    toast.error('Contenu rejeté');
  };

  const genres = ['all', ...Array.from(new Set(items.map(i => i.genre)))];

  const pendingCount = items.filter(i => i.status === 'En attente').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-orange-600' : 'bg-orange-500'}`}>
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
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

      <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-2 mb-4">
          <Filter className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Filtres
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="Film">Films</SelectItem>
              <SelectItem value="Série">Séries</SelectItem>
            </SelectContent>
          </Select>

          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}>
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <SelectItem value="all">Tous les genres</SelectItem>
              {genres.filter(g => g !== 'all').map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}>
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <SelectItem value="all">Toutes les dates</SelectItem>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

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
            {filteredItems.length === 0 ? (
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
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={isDarkMode ? 'hover:bg-gray-800 text-gray-400' : ''}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {item.status === 'En attente' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleApprove(item.id)}
                            className={isDarkMode ? 'hover:bg-gray-800 text-green-400' : 'text-green-600'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleReject(item.id)}
                            className={isDarkMode ? 'hover:bg-gray-800 text-red-400' : 'text-red-600'}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
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
