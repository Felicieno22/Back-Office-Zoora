import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Wrench, Film, Users, Calendar, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest, getContenus, getMateriels, getPersonnes } from '../../../utils/api';
import { ThemedCard } from '../../../components/ui/ThemedCard';
import { ThemedField } from '../../../components/ui/ThemedField';
import { ThemedButton } from '../../../components/ui/ThemedButton';
import { ThemedIcon } from '../../../components/ui/ThemedIcon';
import { PageContainer } from '../../../components/shared/SharedLayout';

export function MaterialUsedEdit({ isDarkMode }: { isDarkMode: boolean }) {
  const { idContenu, idMateriel } = useParams<{ idContenu: string; idMateriel: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idContenu: '',
    idMateriel: '',
    idPersonne: '',
    dateDebut: '',
    dateFin: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [contenus, setContenus] = useState<any[]>([]);
  const [materiels, setMateriels] = useState<any[]>([]);
  const [personnes, setPersonnes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDropdownData();
    loadMaterialUsedData();
  }, []);

  const loadDropdownData = async () => {
    try {
      const [contenusData, materielsData, personnesData] = await Promise.all([
        getContenus(),
        getMateriels(),
        getPersonnes()
      ]);

      setContenus(contenusData);
      setMateriels(materielsData);
      setPersonnes(personnesData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      toast.error('Erreur lors du chargement des données');
    }
  };

  const loadMaterialUsedData = async () => {
    try {
      setIsLoading(true);
      const materialUsedData = await apiRequest(`/api/materiels-utilises/${id_contenu}/${id_materiel}`, { method: 'GET' });
      
      setFormData({
        idContenu: String(materialUsedData.idContenu),
        idMateriel: String(materialUsedData.idMateriel),
        idPersonne: String(materialUsedData.idPersonne),
        dateDebut: materialUsedData.dateDebut ? new Date(materialUsedData.dateDebut).toISOString().split('T')[0] : '',
        dateFin: materialUsedData.dateFin ? new Date(materialUsedData.dateFin).toISOString().split('T')[0] : '',
        notes: materialUsedData.notes || ''
      });
    } catch (error) {
      console.error('Erreur chargement utilisation matériel:', error);
      toast.error('Erreur lors du chargement des données d\'utilisation du matériel');
      navigate('/admin/production/equipment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.id_contenu) {
      newErrors.id_contenu = 'Le contenu est requis';
    }
    
    if (!formData.id_materiel) {
      newErrors.id_materiel = 'Le matériel est requis';
    }
    
    if (!formData.id_personne) {
      newErrors.id_personne = 'La personne est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        idContenu: Number(formData.idContenu),
        idMateriel: Number(formData.idMateriel),
        idPersonne: Number(formData.idPersonne),
        dateDebut: formData.dateDebut ? new Date(formData.dateDebut).toISOString() : null,
        dateFin: formData.dateFin ? new Date(formData.dateFin).toISOString() : null,
        notes: formData.notes
      };

      await apiRequest(`/api/materiel-utilise/${idContenu}/${idMateriel}`, {
        method: 'PUT',
        data: payload
      });

      toast.success('Utilisation de matériel mise à jour avec succès !');
      navigate('/admin/production/equipment');
    } catch (error) {
      console.error('Erreur mise à jour utilisation matériel:', error);
      toast.error('Erreur lors de la mise à jour de l\'utilisation du matériel');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-sm text-muted-foreground">Chargement des données...</p>
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center gap-4 mb-6">
        <ThemedButton 
          moduleName="production"
          variant="secondary"
          onClick={() => navigate('/admin/production/equipment')}
          useGradient={true}
          useHoverScale={true}
          useAdvancedShadow={true}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste
        </ThemedButton>
      </div>

      <ThemedCard
        moduleName="production"
        hoverable={true}
        useAdvancedHover={true}
      >
        <h1 className="text-2xl font-bold mb-2">Modifier l'utilisation de matériel</h1>
        <p className="text-sm text-gray-600 mb-4">Mettez à jour l'enregistrement d'utilisation du matériel</p>
      </ThemedCard>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <ThemedCard 
          moduleName="production" 
          title="Détails de l'utilisation" 
          subtitle="Informations sur l'utilisation du matériel"
          hoverable={true}
          useAdvancedHover={true}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ThemedField
              moduleName="production"
              label="Contenu *"
              type="select"
              value={formData.idContenu}
              onChange={(value) => handleChange('idContenu', value)}
              placeholder="Sélectionnez un contenu"
              options={contenus.map(c => ({ value: String(c.id), label: c.titre || c.nom }))}
              icon={Film}
              error={errors.id_contenu}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Matériel *"
              type="select"
              value={formData.idMateriel}
              onChange={(value) => handleChange('idMateriel', value)}
              placeholder="Sélectionnez un matériel"
              options={materiels.map(m => ({ value: String(m.id), label: `${m.nom} (${m.marque})` }))}
              icon={Wrench}
              error={errors.id_materiel}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Personne responsable *"
              type="select"
              value={formData.idPersonne}
              onChange={(value) => handleChange('idPersonne', value)}
              placeholder="Sélectionnez une personne"
              options={personnes.map(p => ({ value: String(p.id), label: `${p.nom} ${p.prenom || ''}`.trim() }))}
              icon={Users}
              error={errors.id_personne}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Date de début *"
              type="date"
              value={formData.dateDebut}
              onChange={(value) => handleChange('dateDebut', value)}
              icon={Calendar}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Date de fin"
              type="date"
              value={formData.dateFin}
              onChange={(value) => handleChange('dateFin', value)}
              icon={Calendar}
              useAdvancedFocus={true}
              useModernBorder={true}
            />
          </div>

          <div className="mt-6">
            <ThemedField
              moduleName="production"
              label="Notes"
              type="textarea"
              value={formData.notes}
              onChange={(value) => handleChange('notes', value)}
              placeholder="Informations complémentaires sur l'utilisation du matériel..."
              icon={Wrench}
              rows={4}
              useAdvancedFocus={true}
              useModernBorder={true}
            />
          </div>
        </ThemedCard>

        <div className="flex justify-end gap-3 pt-4">
          <ThemedButton
            moduleName="production"
            variant="secondary"
            type="button"
            onClick={() => navigate('/admin/production/equipment')}
            useGradient={true}
            useHoverScale={true}
            useAdvancedShadow={true}
          >
            Annuler
          </ThemedButton>
          <ThemedButton
            moduleName="production"
            variant="primary"
            type="submit"
            useGradient={true}
            useHoverScale={true}
            useAdvancedShadow={true}
          >
            <Save className="w-4 h-4 mr-2" />
            Mettre à jour
          </ThemedButton>
        </div>
      </form>
    </PageContainer>
  );
}