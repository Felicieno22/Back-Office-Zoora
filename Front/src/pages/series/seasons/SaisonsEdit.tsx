import React, { useState, useEffect } from 'react';
import { ThemedCard } from '../../../components/ui/ThemedCard';
import { ThemedField } from '../../../components/ui/ThemedField';
import { ThemedButton } from '../../../components/ui/ThemedButton';
import { ThemedIcon } from '../../../components/ui/ThemedIcon';
import { FileText, AlignLeft, Calendar, Image, Activity, Globe, Save, ArrowLeft } from 'lucide-react';
import { Saison, ContentStatus } from '../../../types/base';
import { apiRequest } from '../../../utils/api';

interface SaisonsEditProps {
  isDarkMode?: boolean;
  saisonId?: number;
}

export function SaisonsEdit({ isDarkMode = true, saisonId }: SaisonsEditProps) {
  const [formData, setFormData] = useState({
    id_serie: 0,
    numero_saison: 1,
    titre: '',
    synopsis: '',
    miniature: '',
    date_sortie: '',
    statut: 'en_attente' as ContentStatus
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [series, setSeries] = useState<Array<{id_serie: number, titre: string}>>([]);

  // Charger les données de la saison
  useEffect(() => {
    if (saisonId) {
      loadSaisonData();
    }
    loadSeries();
  }, [saisonId]);

  const loadSaisonData = async () => {
    try {
      setLoadingData(true);
      const saison = await apiRequest(`/saisons/${saisonId}`);
      setFormData({
        id_serie: saison.id_serie,
        numero_saison: saison.numero_saison,
        titre: saison.titre || '',
        synopsis: saison.synopsis || '',
        miniature: saison.miniature || '',
        date_sortie: saison.date_sortie || '',
        statut: saison.statut
      });
    } catch (error) {
      console.error('Erreur lors du chargement de la saison:', error);
      alert('Erreur lors du chargement de la saison');
    } finally {
      setLoadingData(false);
    }
  };

  const loadSeries = async () => {
    try {
      const data = await apiRequest('/api/series');
      if (Array.isArray(data)) {
        setSeries(data.map((s: any) => ({ 
          id_serie: s.id_serie, 
          titre: s.titre 
        })));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des séries:', error);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!saisonId) {
      alert('ID de saison invalide');
      return;
    }

    setLoading(true);
    
    try {
      await apiRequest(`/saisons/${saisonId}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      
      alert('Saison mise à jour avec succès !');
      window.dispatchEvent(new CustomEvent('tabChange', { detail: 'saisons-list' }));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour de la saison');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="p-8 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <ThemedButton
            moduleName="series"
            variant="secondary"
            onClick={() => window.dispatchEvent(new CustomEvent('tabChange', { detail: 'saisons-list' }))}
            icon={<ArrowLeft size={16} />}
            title="Retour"
          >
            Retour
          </ThemedButton>
          
          <div>
            <h1 className="text-3xl font-bold">
              Modifier la Saison
            </h1>
            <p className="mt-2">
              Éditer les informations de la saison #{saisonId}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <ThemedCard 
          moduleName="series" 
          title="Informations de la Saison"
          subtitle="Modifiez les détails de la saison"
          className="mb-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champs du formulaire configurés sous forme de tableau */}
            {[
              {
                label: "Série *",
                field: "id_serie",
                type: "select" as const,
                value: formData.id_serie.toString(),
                onChange: (value: string) => handleChange('id_serie', parseInt(value)),
                options: series.map(serie => ({ value: serie.id_serie.toString(), label: serie.titre })),
                placeholder: "Sélectionnez une série",
                required: true,
                icon: Globe,
                disabled: true
              },
              {
                label: "Numéro de Saison *",
                field: "numero_saison",
                type: "number" as const,
                value: formData.numero_saison.toString(),
                onChange: (value: string) => handleChange('numero_saison', parseInt(value) || 1),
                required: true,
                icon: Calendar
              },
              {
                label: "Titre de la Saison",
                field: "titre",
                type: "text" as const,
                value: formData.titre,
                onChange: (value: string) => handleChange('titre', value),
                placeholder: "Ex: Saison 1 - Nouveaux Départs",
                icon: FileText
              },
              {
                label: "Synopsis",
                field: "synopsis",
                type: "textarea" as const,
                value: formData.synopsis,
                onChange: (value: string) => handleChange('synopsis', value),
                placeholder: "Résumé de la saison...",
                icon: AlignLeft
              },
              {
                label: "URL de la Miniature",
                field: "miniature",
                type: "url" as const,
                value: formData.miniature,
                onChange: (value: string) => handleChange('miniature', value),
                placeholder: "https://example.com/image.jpg",
                icon: Image
              },
              {
                label: "Date de Sortie",
                field: "date_sortie",
                type: "date" as const,
                value: formData.date_sortie,
                onChange: (value: string) => handleChange('date_sortie', value),
                icon: Calendar
              },
              {
                label: "Statut",
                field: "statut",
                type: "select" as const,
                value: formData.statut,
                onChange: (value: string) => handleChange('statut', value as ContentStatus),
                options: [
                  { value: "en_attente", label: "En Attente" },
                  { value: "approuve", label: "Approuvé" },
                  { value: "rejete", label: "Rejeté" }
                ],
                icon: Activity
              }
            ].map((fieldConfig, index) => (
              <ThemedField
                key={index}
                moduleName="series"
                label={fieldConfig.label}
                type={fieldConfig.type}
                value={fieldConfig.value}
                onChange={fieldConfig.onChange}
                placeholder={fieldConfig.placeholder}
                required={fieldConfig.required}
                icon={fieldConfig.icon}
                options={fieldConfig.options}
                disabled={fieldConfig.disabled}
              />
            ))}
            <p className="text-sm mt-1.5">
              La série ne peut pas être modifiée après création
            </p>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <ThemedButton 
                moduleName="series"
                variant="primary"
                type="submit" 
                disabled={loading}
                icon={loading ? undefined : <Save size={16} />}
                loading={loading}
              >
                {loading ? 'Enregistrement...' : 'Enregistrer les Modifications'}
              </ThemedButton>
              
              <ThemedButton 
                moduleName="series"
                variant="secondary"
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('tabChange', { detail: 'saisons-list' }))}
                title="Annuler"
              >
                Annuler
              </ThemedButton>
            </div>
          </form>
        </ThemedCard>
      </div>
    </div>
  );
}