import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Trash2, Loader2, Tag } from 'lucide-react';
import { apiRequest } from '../utils/api';
import { toast } from 'sonner';

interface Genre {
    id_genre: number;
    nom: string;
}

interface GenresViewProps {
    isDarkMode: boolean;
}

export function GenresView({ isDarkMode }: GenresViewProps) {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);
    const [newGenreName, setNewGenreName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            const data = await apiRequest('/api/genres');
            setGenres(data);
        } catch (error) {
            console.error('Failed to fetch genres:', error);
            toast.error('Erreur lors du chargement des genres');
        } finally {
            setLoading(false);
        }
    };

    const handleAddGenre = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGenreName.trim()) return;

        setIsAdding(true);
        try {
            const newGenre = await apiRequest('/api/genres', {
                method: 'POST',
                data: { nom: newGenreName.trim() }
            });
            setGenres([...genres, newGenre]);
            setNewGenreName('');
            toast.success('Genre ajouté avec succès');
        } catch (error) {
            toast.error('Erreur lors de l’ajout du genre');
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteGenre = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce genre ?')) return;

        try {
            await apiRequest(`/genres/${id}`, { method: 'DELETE' });
            setGenres(genres.filter(g => g.id_genre !== id));
            toast.success('Genre supprimé');
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Gestion des Genres</h2>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        Gérer les catégories de films et séries
                    </p>
                </div>
            </div>

            <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
                <CardHeader>
                    <CardTitle className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                        Ajouter un nouveau genre
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddGenre} className="flex gap-4">
                        <div className="relative flex-1">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                placeholder="Nom du genre (ex: Science-Fiction)"
                                value={newGenreName}
                                onChange={(e) => setNewGenreName(e.target.value)}
                                className={`pl-10 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isAdding || !newGenreName.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                            Ajouter
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className={isDarkMode ? 'border-gray-800' : 'border-gray-200'}>
                                    <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Nom</TableHead>
                                    <TableHead className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-right`}>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {genres.map((genre) => (
                                    <TableRow key={genre.id_genre} className={isDarkMode ? 'border-gray-800' : 'border-gray-200'}>
                                        <TableCell className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {genre.nom}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteGenre(genre.id_genre)}
                                                className="text-red-500 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {genres.length === 0 && (
                                    <TableRow key="no-genres">
                                        <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                                            Aucun genre trouvé
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
