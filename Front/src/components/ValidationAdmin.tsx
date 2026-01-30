/**
 * ValidationAdmin - Gestion des validations en attente
 */

import React, { useState, useEffect } from "react";
import { Check, X, Eye, Loader2, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";
import { apiRequest, getValidations } from '../utils/api';
import { dropdownDataService, useConstantData, Genre } from "../services/dropdownDataService";

interface ValidationItem {
  id: string;
  type: 'film' | 'serie' | 'participation' | 'materiel' | 'personne';
  titre: string;
  description?: string;
  status: 'en_attente' | 'approuve' | 'rejete';
  dateCreation: string;
  dateModification?: string;
  demandeur?: string;
  contenu?: any;
  raison_rejet?: string;
}

interface ValidationAdminProps {
  isDarkMode?: boolean;
}

export function ValidationAdmin({ isDarkMode = false }: ValidationAdminProps) {
  // Utiliser le cache pour les genres
  const { data: genres, loading: genresLoading } = useConstantData<Genre>(
    () => dropdownDataService.getGenres()
  );

  const [validations, setValidations] = useState<ValidationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'en_attente' | 'approuve' | 'rejete' | ''>('en_attente');
  const [selectedType, setSelectedType] = useState<'film' | 'serie' | 'participation' | 'materiel' | 'personne' | ''>('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ValidationItem | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchValidations();
  }, []);

  const fetchValidations = async () => {
    try {
      setIsLoading(true);
      // getValidations garantit un tableau
      const data = await getValidations({ statut: 'en_attente' });
      setValidations(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des validations');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredValidations = validations
    .filter(v => selectedStatus === '' || v.status === selectedStatus)
    .filter(v => selectedType === '' || v.type === selectedType);

  const totalPages = Math.ceil(filteredValidations.length / itemsPerPage);
  const paginatedValidations = filteredValidations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApprove = async (id: string) => {
    try {
      await apiRequest(`/api/admin/validation/approve/content/${id}`, { method: 'POST' });
      setValidations(validations.map(v => v.id === id ? { ...v, status: 'approuve' } : v));
      toast.success('Validation approuvée ✓');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async () => {
    if (!rejectId) return;
    try {
      await apiRequest(`/api/admin/validation/reject/content/${rejectId}`, { 
        method: 'POST',
        data: { reason: rejectReason } 
      });
      setValidations(validations.map(v => v.id === rejectId ? { ...v, status: 'rejete', raison_rejet: rejectReason } : v));
      toast.success('Validation rejetée ✓');
      setRejectId(null);
      setRejectReason('');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du rejet');
    }
  };

  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      'film': 'bg-blue-100 text-blue-800',
      'serie': 'bg-purple-100 text-purple-800',
      'participation': 'bg-green-100 text-green-800',
      'materiel': 'bg-orange-100 text-orange-800',
      'personne': 'bg-pink-100 text-pink-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'en_attente':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approuve':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'rejete':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string): string => {
    const labels: { [key: string]: string } = {
      'en_attente': 'En attente',
      'approuve': 'Approuvé',
      'rejete': 'Rejeté',
    };
    return labels[status] || status;
  };

  const stats = {
    total: validations.length,
    enAttente: validations.filter(v => v.status === 'en_attente').length,
    approuves: validations.filter(v => v.status === 'approuve').length,
    rejetes: validations.filter(v => v.status === 'rejete').length,
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Validations</h1>
        <p className="text-gray-500 mt-1">Gestion des contenus en attente d'approbation</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-gray-500">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-yellow-600">{stats.enAttente}</p>
            <p className="text-sm text-gray-500">En attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-green-600">{stats.approuves}</p>
            <p className="text-sm text-gray-500">Approuvés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-red-600">{stats.rejetes}</p>
            <p className="text-sm text-gray-500">Rejetés</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select value={selectedStatus} onValueChange={(value: any) => {
          setSelectedStatus(value);
          setCurrentPage(1);
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="approuve">Approuvé</SelectItem>
            <SelectItem value="rejete">Rejeté</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={(value: any) => {
          setSelectedType(value);
          setCurrentPage(1);
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="film">Film</SelectItem>
            <SelectItem value="serie">Série</SelectItem>
            <SelectItem value="participation">Participation</SelectItem>
            <SelectItem value="materiel">Matériel</SelectItem>
            <SelectItem value="personne">Personne</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste ({paginatedValidations.length}/{filteredValidations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedValidations.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Aucune validation trouvée</p>
            ) : (
              paginatedValidations.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{item.titre}</h3>
                      <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(item.status)}
                        <span className="text-sm text-gray-600">{getStatusLabel(item.status)}</span>
                      </div>
                    </div>
                    {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                    <div className="flex gap-4 text-xs text-gray-500 mt-2">
                      {item.demandeur && <span>Demandeur: {item.demandeur}</span>}
                      <span>Créée: {new Date(item.dateCreation).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {item.raison_rejet && (
                      <p className="text-sm text-red-600 mt-2">Raison: {item.raison_rejet}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => {
                      setSelectedItem(item);
                      setDetailsOpen(true);
                    }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {item.status === 'en_attente' && (
                      <>
                        <Button size="sm" variant="ghost" className="text-green-500" onClick={() => handleApprove(item.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500" onClick={() => setRejectId(item.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
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

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem?.titre}</DialogTitle>
            <DialogDescription>Détails de la validation</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <Badge className={getTypeColor(selectedItem.type)}>{selectedItem.type}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Statut</p>
                <p className="font-medium">{getStatusLabel(selectedItem.status)}</p>
              </div>
              {selectedItem.description && (
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium">{selectedItem.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Créé le</p>
                <p>{new Date(selectedItem.dateCreation).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              {selectedItem.raison_rejet && (
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-sm font-medium text-red-800">Raison du rejet</p>
                  <p className="text-sm text-red-700">{selectedItem.raison_rejet}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!rejectId} onOpenChange={(open) => !open && setRejectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeter cette validation?</AlertDialogTitle>
            <AlertDialogDescription>
              Veuillez indiquer la raison du rejet
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            placeholder="Raison du rejet..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <AlertDialog open={true} onOpenChange={() => {}}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Rejeter?</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="flex gap-2">
                <AlertDialogCancel onClick={() => setRejectId(null)}>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleReject} className="bg-red-500">Rejeter</AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}