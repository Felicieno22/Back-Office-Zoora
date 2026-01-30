import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, BookOpen, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '../../../utils/api';
import { ThemedCard } from '../../../components/ui/ThemedCard';
import { ThemedField } from '../../../components/ui/ThemedField';
import { ThemedButton } from '../../../components/ui/ThemedButton';
import { ThemedIcon } from '../../../components/ui/ThemedIcon';
import { PageContainer } from '../../../components/shared/SharedLayout';

export function PersonneCreate({ isDarkMode }: { isDarkMode: boolean }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    biographie: ''
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
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (formData.telephone && !/^\+?[0-9\s\-\(\)]+$/.test(formData.telephone)) {
      newErrors.telephone = 'Numéro de téléphone invalide';
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
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        dateNaissance: formData.dateNaissance || null,
        biographie: formData.biographie
      };

      await apiRequest('/api/personnes', {
        method: 'POST',
        data: payload
      });

      toast.success('Personne créée avec succès !');
      navigate('/admin/production/crew');
    } catch (error) {
      console.error('Erreur création personne:', error);
      toast.error('Erreur lors de la création de la personne');
    }
  };

  return (
    <PageContainer>
      <div className="flex items-center gap-4 mb-6">
        <ThemedButton 
          moduleName="production"
          variant="secondary"
          onClick={() => navigate('/admin/production/crew')}
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
        <h1 className="text-2xl font-bold mb-2">Créer une nouvelle personne</h1>
        <p className="text-sm text-gray-600 mb-4">Ajoutez les informations de contact et de profil</p>
      </ThemedCard>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <ThemedCard 
          moduleName="production" 
          title="Informations personnelles" 
          subtitle="Détails de base de la personne"
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
              placeholder="Nom de famille"
              icon={User}
              error={errors.nom}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Prénom"
              type="text"
              value={formData.prenom}
              onChange={(value) => handleChange('prenom', value)}
              placeholder="Prénom"
              icon={User}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
              placeholder="email@exemple.com"
              icon={Mail}
              error={errors.email}
            />

            <ThemedField
              moduleName="production"
              label="Téléphone"
              type="text"
              value={formData.telephone}
              onChange={(value) => handleChange('telephone', value)}
              placeholder="+33 1 23 45 67 89"
              icon={Phone}
              error={errors.telephone}
            />

            <ThemedField
              moduleName="production"
              label="Date de naissance"
              type="date"
              value={formData.dateNaissance}
              onChange={(value) => handleChange('dateNaissance', value)}
              icon={Calendar}
            />
          </div>

          <div className="mt-6">
            <ThemedField
              moduleName="production"
              label="Biographie"
              type="textarea"
              value={formData.biographie}
              onChange={(value) => handleChange('biographie', value)}
              placeholder="Courte biographie ou informations professionnelles..."
              icon={BookOpen}
              rows={4}
            />
          </div>
        </ThemedCard>

        <div className="flex justify-end gap-3 pt-4">
          <ThemedButton
            moduleName="production"
            variant="secondary"
            type="button"
            onClick={() => navigate('/admin/production/crew')}
          >
            Annuler
          </ThemedButton>
          <ThemedButton
            moduleName="production"
            variant="primary"
            type="submit"
          >
            <Save className="w-4 h-4 mr-2" />
            Créer la personne
          </ThemedButton>
        </div>
      </form>
    </PageContainer>
  );
}