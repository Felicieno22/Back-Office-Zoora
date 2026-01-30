import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Tag, Package, BadgePercent, Calendar, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '../../../utils/api';
import { ThemedCard } from '../../../components/ui/ThemedCard';
import { ThemedField } from '../../../components/ui/ThemedField';
import { ThemedButton } from '../../../components/ui/ThemedButton';
import { ThemedIcon } from '../../../components/ui/ThemedIcon';
import { PageContainer } from '../../../components/shared/SharedLayout';

export function MaterialCreate({ isDarkMode }: { isDarkMode: boolean }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idType: '',
    nom: '',
    marque: '',
    modele: '',
    numeroSerie: '',
    etat: 'operationnel',
    dateAchat: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [typesMateriel, setTypesMateriel] = useState<any[]>([]);

  useEffect(() => {
    loadTypesMateriel();
  }, []);

  const loadTypesMateriel = async () => {
    try {
      const typesData = await apiRequest('/api/type-materiel', { method: 'GET' });
      setTypesMateriel(typesData || []);
    } catch (error) {
      console.error('Erreur chargement types matériel:', error);
      toast.error('Erreur lors du chargement des types de matériel');
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
    
    if (!formData.id_type) {
      newErrors.id_type = 'Le type est requis';
    }
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    if (!formData.marque.trim()) {
      newErrors.marque = 'La marque est requise';
    }
    
    if (!formData.numero_serie.trim()) {
      newErrors.numero_serie = 'Le numéro de série est requis';
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
        idType: Number(formData.idType),
        nom: formData.nom,
        marque: formData.marque,
        modele: formData.modele,
        numeroSerie: formData.numeroSerie,
        etat: formData.etat,
        dateAchat: formData.dateAchat || null
      };

      await apiRequest('/api/materiels', {
        method: 'POST',
        data: payload
      });

      toast.success('Matériel créé avec succès !');
      navigate('/admin/production/equipment');
    } catch (error) {
      console.error('Erreur création matériel:', error);
      toast.error('Erreur lors de la création du matériel');
    }
  };

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
        <h1 className="text-2xl font-bold mb-2">Créer un nouveau matériel</h1>
        <p className="text-sm text-gray-600 mb-4">Ajoutez un nouveau équipement à l'inventaire de production</p>
      </ThemedCard>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <ThemedCard 
          moduleName="production" 
          title="Informations du matériel" 
          subtitle="Détails techniques et administratifs"
          hoverable={true}
          useAdvancedHover={true}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ThemedField
              moduleName="production"
              label="Type *"
              type="select"
              value={formData.idType}
              onChange={(value) => handleChange('idType', value)}
              placeholder="Sélectionnez un type"
              options={typesMateriel.map(t => ({ 
                value: String(t.id), 
                label: t.nom,
                key: t.id ? `type-${t.id}` : `type-${Math.random()}` // Éviter les clés undefined
              }))}
              icon={Wrench}
              error={errors.id_type}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Nom *"
              type="text"
              value={formData.nom}
              onChange={(value) => handleChange('nom', value)}
              placeholder="Nom du matériel"
              icon={Package}
              error={errors.nom}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Marque *"
              type="text"
              value={formData.marque}
              onChange={(value) => handleChange('marque', value)}
              placeholder="Marque du matériel"
              icon={Tag}
              error={errors.marque}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Modèle"
              type="text"
              value={formData.modele}
              onChange={(value) => handleChange('modele', value)}
              placeholder="Modèle du matériel"
              icon={BadgePercent}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Numéro de série *"
              type="text"
              value={formData.numeroSerie}
              onChange={(value) => handleChange('numeroSerie', value)}
              placeholder="Numéro de série unique"
              icon={Tag}
              error={errors.numero_serie}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="État"
              type="select"
              value={formData.etat}
              onChange={(value) => handleChange('etat', value)}
              options={[
                { value: 'operationnel', label: 'Opérationnel' },
                { value: 'en-maintenance', label: 'En maintenance' },
                { value: 'hs', label: 'Hors service' },
                { value: 'perdu', label: 'Perdu' }
              ]}
              icon={Wrench}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Date d'achat"
              type="date"
              value={formData.dateAchat}
              onChange={(value) => handleChange('dateAchat', value)}
              icon={Calendar}
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
            Créer le matériel
          </ThemedButton>
        </div>
      </form>
    </PageContainer>
  );
}