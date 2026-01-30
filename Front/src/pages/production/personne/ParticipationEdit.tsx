import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Film, Briefcase, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest, getContenus, getPersonnes, getPostes } from '../../../utils/api';
import { ThemedCard } from '../../../components/ui/ThemedCard';
import { ThemedField } from '../../../components/ui/ThemedField';
import { ThemedButton } from '../../../components/ui/ThemedButton';
import { ThemedIcon } from '../../../components/ui/ThemedIcon';
import { PageContainer } from '../../../components/shared/SharedLayout';

export function ParticipationEdit({ isDarkMode }: { isDarkMode: boolean }) {
  const { idContenu, idPersonne, idPoste } = useParams<{ idContenu: string; idPersonne: string; idPoste: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idContenu: '',
    idPersonne: '',
    idPoste: '',
    detailFonction: '',
    ordreAffichage: 999
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [contenus, setContenus] = useState<any[]>([]);
  const [personnes, setPersonnes] = useState<any[]>([]);
  const [postes, setPostes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDropdownData();
    loadParticipationData();
  }, []);

  const loadDropdownData = async () => {
    try {
      const [contenusData, personnesData, postesData] = await Promise.all([
        getContenus(),
        getPersonnes(),
        getPostes()
      ]);

      setContenus(contenusData);
      setPersonnes(personnesData);
      setPostes(postesData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      toast.error('Erreur lors du chargement des données');
    }
  };

  const loadParticipationData = async () => {
    try {
      setIsLoading(true);
      const participationData = await apiRequest(`/api/participations/${idContenu}/${idPersonne}/${idPoste}`, { method: 'GET' });
      
      setFormData({
        idContenu: String(participationData.idContenu),
        idPersonne: String(participationData.idPersonne),
        idPoste: String(participationData.idPoste),
        detailFonction: participationData.detailFonction || '',
        ordreAffichage: participationData.ordreAffichage || 999
      });
    } catch (error) {
      console.error('Erreur chargement participation:', error);
      toast.error('Erreur lors du chargement des données de la participation');
      navigate('/admin/production/crew');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
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
    
    if (!formData.idContenu) {
      newErrors.id_contenu = 'Le contenu est requis';
    }
    
    if (!formData.idPersonne) {
      newErrors.id_personne = 'La personne est requise';
    }
    
    if (!formData.idPoste) {
      newErrors.id_poste = 'Le poste est requis';
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
        idPersonne: Number(formData.idPersonne),
        idPoste: Number(formData.idPoste),
        detailFonction: formData.detailFonction,
        ordreAffichage: Number(formData.ordreAffichage)
      };

      await apiRequest(`/api/participations/${idContenu}/${idPersonne}/${idPoste}`, {
        method: 'PUT',
        data: payload
      });

      toast.success('Participation mise à jour avec succès !');
      navigate('/admin/production/crew');
    } catch (error) {
      console.error('Erreur mise à jour participation:', error);
      toast.error('Erreur lors de la mise à jour de la participation');
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
        <h1 className="text-2xl font-bold mb-2">Modifier la participation</h1>
        <p className="text-sm text-gray-600 mb-4">Mettez à jour l'association personne-contenu-poste</p>
      </ThemedCard>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <ThemedCard 
          moduleName="production" 
          title="Détails de la participation" 
          subtitle="Informations sur l'association personne-contenu"
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
              label="Personne *"
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
              label="Poste *"
              type="select"
              value={formData.idPoste}
              onChange={(value) => handleChange('idPoste', value)}
              placeholder="Sélectionnez un poste"
              options={postes.map(p => ({ value: String(p.id), label: p.nom }))}
              icon={Briefcase}
              error={errors.id_poste}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Ordre d'affichage"
              type="number"
              value={String(formData.ordreAffichage)}
              onChange={(value) => handleChange('ordreAffichage', value ? Number(value) : 999)}
              placeholder="999"
              icon={Briefcase}
              useAdvancedFocus={true}
              useModernBorder={true}
            />
          </div>

          <div className="mt-6">
            <ThemedField
              moduleName="production"
              label="Détail de la fonction"
              type="textarea"
              value={formData.detailFonction}
              onChange={(value) => handleChange('detailFonction', value)}
              placeholder="Détaillez la fonction ou rôle spécifique de la personne..."
              icon={Briefcase}
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
            onClick={() => navigate('/admin/production/crew')}
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