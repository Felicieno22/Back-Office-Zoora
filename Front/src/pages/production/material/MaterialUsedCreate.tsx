import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Film, Users, Calendar, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '../../../utils/api';
import { ThemedCard } from '../../../components/ui/ThemedCard';
import { ThemedField } from '../../../components/ui/ThemedField';
import { ThemedButton } from '../../../components/ui/ThemedButton';
import { ThemedIcon } from '../../../components/ui/ThemedIcon';
import { PageContainer } from '../../../components/shared/SharedLayout';
import { normalizeToArray } from '../../../utils/normalizeApiResponse';

// ────────────────────────────────────────────────

interface ContenuOption {
  id: number | string;     // id_contenu ou id
  titre?: string;
  nom?: string;            // au cas où
}

interface MaterielOption {
  id: number | string;
  nom: string;
  marque: string;
}

interface PersonneOption {
  id: number | string;
  nom: string;
  prenom?: string;
}

export function MaterialUsedCreate({ isDarkMode }: { isDarkMode: boolean }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idContenu: '',
    idMateriel: '',
    idPersonne: '',
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [contenus, setContenus] = useState<ContenuOption[]>([]);
  const [materiels, setMateriels] = useState<MaterielOption[]>([]);
  const [personnes, setPersonnes] = useState<PersonneOption[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    setLoading(true);
    try {
      const [contenusRaw, materielsRaw, personnesRaw] = await Promise.all([
        apiRequest('/api/contenu',   { method: 'GET' }),
        apiRequest('/api/materiels', { method: 'GET' }),
        apiRequest('/api/personnes', { method: 'GET' }),
      ]);

      // Normalisation + typage fort
      setContenus(normalizeToArray<ContenuOption>(contenusRaw));
      setMateriels(normalizeToArray<MaterielOption>(materielsRaw));
      setPersonnes(normalizeToArray<PersonneOption>(personnesRaw));
    } catch (error: any) {
      console.error('Erreur chargement données:', error);
      toast.error(error.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Nettoyage erreur en temps réel
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

    if (!formData.idContenu)   newErrors.idContenu   = 'Le contenu est requis';
    if (!formData.idMateriel)  newErrors.idMateriel  = 'Le matériel est requis';
    if (!formData.idPersonne)  newErrors.idPersonne  = 'La personne est requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        idContenu: Number(formData.idContenu),
        idMateriel: Number(formData.idMateriel),
        idPersonne: Number(formData.idPersonne),
        dateDebut: formData.dateDebut ? new Date(formData.dateDebut).toISOString() : null,
        dateFin:   formData.dateFin   ? new Date(formData.dateFin).toISOString()   : null,
        notes: formData.notes,
      };

      await apiRequest('/api/materiel-utilise', {
        method: 'POST',
        data: payload,
      });

      toast.success('Utilisation de matériel créée avec succès !');
      navigate('/admin/production/equipment');
    } catch (error: any) {
      console.error('Erreur création:', error);
      toast.error(error.message || 'Erreur lors de la création');
    }
  };

  // ────────────────────────────────────────────────
  // Rendu protégé
  // ────────────────────────────────────────────────

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
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
        <div className="flex items-center gap-4 mb-6">
          <ThemedIcon 
            moduleName="production" 
            icon={Wrench} 
            size="lg" 
            variant="gradient"
            useHover={true}
          />
          <div>
            <h1 className="text-2xl font-bold mb-2">Créer une nouvelle utilisation de matériel</h1>
            <p className="text-sm text-gray-600">
              Enregistrez l'utilisation d'un matériel pour un contenu spécifique
            </p>
          </div>
        </div>
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
              onChange={(v) => handleChange('idContenu', v)}
              placeholder="Sélectionnez un contenu"
              options={(contenus ?? []).map(c => ({
                value: String(c.id ?? ''),
                label: c.titre || c.nom || 'Sans titre',
                key: c.id ? `contenu-${c.id}` : `contenu-${Math.random()}`
              }))}
              icon={Film}
              error={errors.idContenu}
              disabled={contenus.length === 0}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Matériel *"
              type="select"
              value={formData.idMateriel}
              onChange={(v) => handleChange('idMateriel', v)}
              placeholder="Sélectionnez un matériel"
              options={(materiels ?? []).map(m => ({
                value: String(m.id),
                label: `${m.nom || ''} (${m.marque || '?'})`.trim(),
                key: m.id ? `materiel-${m.id}` : `materiel-${Math.random()}`
              }))}
              icon={Wrench}
              error={errors.idMateriel}
              disabled={materiels.length === 0}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Personne responsable *"
              type="select"
              value={formData.idPersonne}
              onChange={(v) => handleChange('idPersonne', v)}
              placeholder="Sélectionnez une personne"
              options={(personnes ?? []).map(p => ({
                value: String(p.id),
                label: `${p.nom || ''} ${p.prenom || ''}`.trim() || 'Sans nom',
                key: p.id ? `personne-${p.id}` : `personne-${Math.random()}`
              }))}
              icon={Users}
              error={errors.idPersonne}
              disabled={personnes.length === 0}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Date de début *"
              type="date"
              value={formData.dateDebut}
              onChange={(v) => handleChange('dateDebut', v)}
              icon={Calendar}
              useAdvancedFocus={true}
              useModernBorder={true}
            />

            <ThemedField
              moduleName="production"
              label="Date de fin"
              type="date"
              value={formData.dateFin}
              onChange={(v) => handleChange('dateFin', v)}
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
              onChange={(v) => handleChange('notes', v)}
              placeholder="Informations complémentaires..."
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
            Créer l'utilisation
          </ThemedButton>
        </div>
      </form>
    </PageContainer>
  );
}