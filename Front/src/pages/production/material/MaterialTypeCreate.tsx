import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Tag, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '../../../utils/api';
import { ThemedCard } from '../../../components/ui/ThemedCard';
import { ThemedField } from '../../../components/ui/ThemedField';
import { ThemedButton } from '../../../components/ui/ThemedButton';
import { ThemedIcon } from '../../../components/ui/ThemedIcon';
import { PageContainer } from '../../../components/shared/SharedLayout';

export function MaterialTypeCreate({ isDarkMode }: { isDarkMode: boolean }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    code: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Le code est requis';
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
        nom: formData.nom,
        code: formData.code
      };

      await apiRequest('/api/type-materiel', {
        method: 'POST',
        data: payload
      });

      toast.success('Type de matériel créé avec succès !');
      navigate('/admin/production/equipment');
    } catch (error) {
      console.error('Erreur création type matériel:', error);
      toast.error('Erreur lors de la création du type de matériel');
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
        <h1 className="text-2xl font-bold mb-2">Créer un nouveau type de matériel</h1>
        <p className="text-sm text-gray-600 mb-4">Définissez un nouveau type de matériel pour la production</p>
      </ThemedCard>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <ThemedCard 
          moduleName="production" 
          title="Informations du type de matériel" 
          subtitle="Détails de base du type de matériel"
          hoverable={true}
          useAdvancedHover={true}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ThemedField
              moduleName="production"
              label="Nom *"
              type="text"
              value={formData.nom}
              onChange={(value) => handleChange('nom', value)}
              placeholder="Ex: Caméra, Drone, Microphone"
              icon={Wrench}
              error={errors.nom}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Code *"
              type="text"
              value={formData.code}
              onChange={(value) => handleChange('code', value)}
              placeholder="Ex: CAM, DRN, MIC"
              icon={Tag}
              error={errors.code}
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
            Créer le type de matériel
          </ThemedButton>
        </div>
      </form>
    </PageContainer>
  );
}