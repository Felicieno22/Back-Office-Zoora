import React, { useState, useEffect } from 'react';
import { ThemedCard } from '../../../components/ui/ThemedCard';
import { ThemedField } from '../../../components/ui/ThemedField';
import { ThemedButton } from '../../../components/ui/ThemedButton';
import { ThemedIcon } from '../../../components/ui/ThemedIcon';
import { FileText, AlignLeft, Calendar, Image, Activity, Globe, Upload, Save, ArrowLeft } from 'lucide-react';
import { Saison, ContentStatus } from '../../../types/base';
import { apiRequest } from '../../../utils/api';

interface SaisonsCreateProps {
  isDarkMode?: boolean;
}

export function SaisonsCreate({ isDarkMode = true }: SaisonsCreateProps) {
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
  const [series, setSeries] = useState<Array<{id_serie: number, titre: string}>>([]);

  // Charger les séries disponibles
  useEffect(() => {
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
    loadSeries();
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id_serie || formData.id_serie === 0) {
      alert('Veuillez sélectionner une série');
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiRequest('/api/seasons', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      alert('Saison créée avec succès !');
      // Retour à la liste
      window.dispatchEvent(new CustomEvent('tabChange', { detail: 'saisons-list' }));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de la saison');
    } finally {
      setLoading(false);
    }
  };

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
            useGradient={true}
            useHoverScale={true}
            useAdvancedShadow={true}
          >
            Retour
          </ThemedButton>
          
          <div>
            <h1 className="text-3xl font-bold">
              Créer une Saison
            </h1>
            <p className="mt-2">
              Ajouter une nouvelle saison à une série existante
            </p>
          </div>
        </div>

        {/* Form Card */}
        <ThemedCard 
          moduleName="series" 
          title="Informations de la Saison"
          subtitle="Remplissez les détails de la nouvelle saison"
          className="mb-6"
          hoverable={true}
          useAdvancedHover={true}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champs du formulaire configurés sous forme de tableau */}
            {[
              {
                label: "Série *",
                field: "id_serie",
                type: "select" as const,
                value: formData.id_serie.toString(),
                onChange: (value: string) => handleChange('id_serie', parseInt(value) || 0),
                options: series.map(serie => ({ value: serie.id_serie.toString(), label: serie.titre })),
                placeholder: "Sélectionnez une série",
                required: true,
                icon: Globe
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
                useAdvancedFocus={true}
                useModernBorder={true}
              />
            ))}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <ThemedButton 
                moduleName="series"
                variant="primary"
                type="submit" 
                disabled={loading}
                icon={loading ? undefined : <Save size={16} />}
                loading={loading}
                useGradient={true}
                useHoverScale={true}
                useAdvancedShadow={true}
              >
                {loading ? 'Création...' : 'Créer la Saison'}
              </ThemedButton>
              
              <ThemedButton 
                moduleName="series"
                variant="secondary"
                type="button" 
                onClick={() => {
                  setFormData({
                    id_serie: 0,
                    numero_saison: 1,
                    titre: '',
                    synopsis: '',
                    miniature: '',
                    date_sortie: '',
                    statut: 'en_attente'
                  });
                }}
                useGradient={true}
                useHoverScale={true}
                useAdvancedShadow={true}
              >
                Réinitialiser
              </ThemedButton> 
              <ThemedButton 
                moduleName="series"
                variant="secondary"
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('tabChange', { detail: 'saisons-list' }))}
                title="Annuler"
                useGradient={true}
                useHoverScale={true}
                useAdvancedShadow={true}
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