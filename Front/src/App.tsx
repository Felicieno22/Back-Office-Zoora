import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { VerifyCode } from './pages/auth/VerifyCode';
import { NewSidebar } from './components/NewSidebar';
import { AdminHeader } from './components/AdminHeader';
import { HomeView } from './pages/home/HomeView';
import { DashboardView } from './pages/dashboard/DashboardView';
import { FilmsCreate } from './pages/films/FilmsCreate';
import { FilmsList } from './pages/films/FilmsList';
import { FilmsDashboard } from './pages/films/FilmsDashboard';
import { SeriesCreate } from './pages/series/SeriesCreate';
import { SeriesList } from './pages/series/SeriesList';
import { SeriesEdit } from './pages/series/SeriesEdit';
import { SeriesDetails } from './pages/series/SeriesDetails';
import { SeriesDashboard } from './pages/series/SeriesDashboard';
import { SaisonsList } from './pages/series/seasons/SaisonsList';
import { SaisonsCreate } from './pages/series/seasons/SaisonsCreate';
import { SaisonsEdit } from './pages/series/seasons/SaisonsEdit';
import { EpisodesList } from './pages/series/episodes/EpisodesList';
import { EpisodesCreate } from './pages/series/episodes/EpisodesCreate';
import { EpisodesEdit } from './pages/series/episodes/EpisodesEdit';
import { CarouselList } from './pages/carrousels/CarouselList';
import { ValidationList } from './pages/validation/ValidationList';
import { GenresView } from './components/GenresView';
import { AuditLogsView } from './components/AuditLogsView';
import { UsersView } from './components/UsersView';
import { ParticipationView } from './components/ParticipationView';
import { EquipmentView } from './components/EquipmentView';
import { SoustitreView } from './components/SoustitreView';
import { SettingsView } from './components/SettingsView';
import { AnalyticsView } from './components/AnalyticsView';
import { CrewView } from './components/CrewView';
import { SubtitlingView } from './components/SubtitlingView';
import { PersonneCreate } from './pages/production/personne/PersonneCreate';
import { ParticipationCreate } from './pages/production/personne/ParticipationCreate';
import { ParticipationList } from './pages/production/personne/ParticipationList';
import { MaterialTypeCreate } from './pages/production/material/MaterialTypeCreate';
import { MaterialCreate } from './pages/production/material/MaterialCreate';
import { MaterialUsedCreate } from './pages/production/material/MaterialUsedCreate';
import { MaterialUsedList } from './pages/production/material/MaterialUsedList';
import { SubtitlingCreate } from './pages/production/subtitle/SubtitlingCreate';
import { SubtitlingList } from './pages/production/subtitle/SubtitlingList';
import { PersonneEdit } from './pages/production/personne/PersonneEdit';
import { ParticipationEdit } from './pages/production/personne/ParticipationEdit';
import { MaterielEdit } from './pages/production/material/MaterielEdit';
import { MaterialUsedEdit } from './pages/production/material/MaterialUsedEdit';
import { SubtitlingEdit } from './pages/production/subtitle/SubtitlingEdit';
// Données chargées depuis la base de données via API
import { Movie } from './types/movie';
import { Serie } from './types/base';
import { Toaster } from './components/ui/sonner';
import { apiRequest } from './utils/api';
import React, { useCallback, useMemo, memo } from 'react';

// Memoize views to prevent unnecessary re-renders
const MemoizedHomeView = memo(HomeView);
const MemoizedDashboardView = memo(DashboardView);
const MemoizedFilmsCreate = memo(FilmsCreate);
const MemoizedFilmsList = memo(FilmsList);
const MemoizedFilmsDashboard = memo(FilmsDashboard);
const MemoizedSeriesCreate = memo(SeriesCreate);
const MemoizedSeriesList = memo(SeriesList);
const MemoizedSeriesDashboard = memo(SeriesDashboard);
const MemoizedSaisonsList = memo(SaisonsList);
const MemoizedSaisonsCreate = memo(SaisonsCreate);
const MemoizedSaisonsEdit = memo(SaisonsEdit);
const MemoizedEpisodesList = memo(EpisodesList);
const MemoizedEpisodesCreate = memo(EpisodesCreate);
const MemoizedEpisodesEdit = memo(EpisodesEdit);
const MemoizedCarouselList = memo(CarouselList);
const MemoizedGenresView = memo(GenresView);
const MemoizedValidationList = memo(ValidationList);
const MemoizedAuditLogsView = memo(AuditLogsView);
const MemoizedUsersView = memo(UsersView);
const MemoizedParticipationView = memo(ParticipationView);
const MemoizedEquipmentView = memo(EquipmentView);
const MemoizedSoustitreView = memo(SoustitreView);
const MemoizedAnalyticsView = memo(AnalyticsView);
const MemoizedSettingsView = memo(SettingsView);
const MemoizedCrewView = memo(CrewView);
const MemoizedSubtitlingView = memo(SubtitlingView);
const MemoizedPersonneCreate = memo(PersonneCreate);
const MemoizedParticipationCreate = memo(ParticipationCreate);
const MemoizedParticipationList = memo(ParticipationList);
const MemoizedMaterialTypeCreate = memo(MaterialTypeCreate);
const MemoizedMaterialCreate = memo(MaterialCreate);
const MemoizedMaterialUsedCreate = memo(MaterialUsedCreate);
const MemoizedMaterialUsedList = memo(MaterialUsedList);
const MemoizedSubtitlingCreate = memo(SubtitlingCreate);
const MemoizedSubtitlingList = memo(SubtitlingList);
const MemoizedPersonneEdit = memo(PersonneEdit);
const MemoizedParticipationEdit = memo(ParticipationEdit);
const MemoizedMaterielEdit = memo(MaterielEdit);
const MemoizedMaterialUsedEdit = memo(MaterialUsedEdit);
const MemoizedSubtitlingEdit = memo(SubtitlingEdit);

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register' | 'verify'>('login');
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);

  // Listen for auth view changes
  React.useEffect(() => {
    const handleAuthViewChange = (e: CustomEvent) => {
      setAuthView(e.detail);
    };
    
    window.addEventListener('authViewChange', handleAuthViewChange as EventListener);
    return () => {
      window.removeEventListener('authViewChange', handleAuthViewChange as EventListener);
    };
  }, []);
  
  // Listen for tab changes
  React.useEffect(() => {
    const handleTabChange = (e: CustomEvent) => {
      setActiveTab(e.detail);
    };
    
    window.addEventListener('tabChange', handleTabChange as EventListener);
    return () => {
      window.removeEventListener('tabChange', handleTabChange as EventListener);
    };
  }, []);
  React.useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          // Attempt to fetch series
          const seriesData = await apiRequest('/api/series');
          if (Array.isArray(seriesData)) setSeries(seriesData);

          // Attempt to fetch films
          const filmsRaw = await apiRequest('/api/films').catch(() => []);
          console.log('Films raw data:', filmsRaw); // Diagnostic
          
          if (Array.isArray(filmsRaw)) {
            const mappedMovies = filmsRaw
              .filter((item: any) => item && item.id_film) // Protection
              .map((item: any) => ({
                id: item.id_film.toString(),
                title: item.titre || item.title || '',
                description: item.synopsis || '',
                thumbnail: item.miniature || '',
                duration: item.duree || '',
                year: item.date_sortie ? new Date(item.date_sortie).getFullYear() : new Date().getFullYear(),
                genre: item.genre || 'Action',
                rating: item.classification || 'PG-13',
              }));
            setMovies(mappedMovies);
          }
        } catch (error) {
          console.error('Initial fetch failed:', error);
        }
      };
      fetchData();
    }
  }, [isAuthenticated]);

  const toggleTheme = useCallback(() => setIsDarkMode(prev => !prev), []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);

  const handleAddMovie = useCallback((movie: Movie) => {
    setMovies(prev => [...prev, movie]);
  }, []);

  const handleDeleteMovie = useCallback((id: string) => {
    setMovies(prev => prev.filter((m: Movie) => m.id !== id));
  }, []);

  const handleAddSerie = useCallback((serie: Serie) => {
    setSeries(prev => [...prev, serie]);
  }, []);

  const handleDeleteSerie = useCallback((id: number) => {
    setSeries(prev => prev.filter(s => s.id_serie !== id));
  }, []);

  const handleVerificationSuccess = () => {
    // Refresh the component to show authenticated view
    window.location.reload();
  };

  if (!isAuthenticated) {
    switch (authView) {
      case 'login':
        return <Login onSwitchToRegister={() => setAuthView('register')} />;
      case 'register':
        return <Register onSwitchToLogin={() => setAuthView('login')} />;
      case 'verify':
        return <VerifyCode onSwitchToLogin={() => setAuthView('login')} />;
      default:
        return <Login onSwitchToRegister={() => setAuthView('register')} />;
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-gray-900'}`}>
      <NewSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDarkMode={isDarkMode}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <AdminHeader
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onToggleSidebar={toggleSidebar}
      />

      <main className="lg:ml-64 pt-28 lg:pt-32 p-4 lg:p-8 min-h-screen">
        <Routes>
          {/* Routes pour les séries */}
          <Route path="/series/:id" element={<SeriesDetails isDarkMode={isDarkMode} />} />
          <Route path="/series/:id/edit" element={<SeriesEdit isDarkMode={isDarkMode} />} />
          
          {/* Route par défaut - contenu par onglets */}
          <Route path="/*" element={
            <>
              {/* Home */}
              {activeTab === 'home' && (
                <MemoizedHomeView
                  isDarkMode={isDarkMode}
                  onNavigate={setActiveTab}
                  moviesCount={movies.length}
                  seriesCount={series.length}
                />
              )}

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <MemoizedDashboardView isDarkMode={isDarkMode} movies={movies} series={series} />
        )}

        {/* Films */}
        {activeTab === 'films-create' && (
          <MemoizedFilmsCreate isDarkMode={isDarkMode} />
        )}
        {activeTab === 'films-list' && (
          <MemoizedFilmsList isDarkMode={isDarkMode} />
        )}
        {activeTab === 'films-dashboard' && (
          <MemoizedFilmsDashboard isDarkMode={isDarkMode} movies={movies} />
        )}

        {/* Series */}
        {activeTab === 'series-create' && (
          <MemoizedSeriesCreate isDarkMode={isDarkMode} onAddSerie={handleAddSerie} />
        )}
        {activeTab === 'series-list' && (
          <MemoizedSeriesList isDarkMode={isDarkMode} series={series} onDeleteSerie={handleDeleteSerie} />
        )}
        {activeTab === 'series-dashboard' && (
          <MemoizedSeriesDashboard isDarkMode={isDarkMode} series={series} />
        )}
        
        {/* Saisons */}
        {activeTab === 'saisons-list' && (
          <MemoizedSaisonsList isDarkMode={isDarkMode} />
        )}
        {activeTab === 'saisons-create' && (
          <MemoizedSaisonsCreate isDarkMode={isDarkMode} />
        )}
        {activeTab.startsWith('saisons-edit-') && (
          <MemoizedSaisonsEdit 
            isDarkMode={isDarkMode} 
            saisonId={parseInt(activeTab.split('-')[2])} 
          />
        )}
        
        {/* Episodes */}
        {activeTab === 'episodes-list' && (
          <MemoizedEpisodesList isDarkMode={isDarkMode} />
        )}
        {activeTab === 'episodes-create' && (
          <MemoizedEpisodesCreate isDarkMode={isDarkMode} />
        )}
        {activeTab.startsWith('episodes-edit-') && (
          <MemoizedEpisodesEdit 
            isDarkMode={isDarkMode} 
            episodeId={parseInt(activeTab.split('-')[2])} 
          />
        )}
        
        {/* Carrousels */}
        {activeTab === 'carrousels-list' && (
          <MemoizedCarouselList isDarkMode={isDarkMode} />
        )}

        {/* Genres */}
        {activeTab === 'genres' && (
          <MemoizedGenresView isDarkMode={isDarkMode} />
        )}

        {/* Validation */}
        {activeTab === 'validation-list' && (
          <MemoizedValidationList isDarkMode={isDarkMode} />
        )}

        {/* Audit Logs */}
        {activeTab === 'logs' && (
          <MemoizedAuditLogsView isDarkMode={isDarkMode} />
        )}

        {/* Validations */}
        {activeTab === 'validations' && (
          <MemoizedValidationList isDarkMode={isDarkMode} />
        )}

        {/* Production section */}
        {activeTab === 'crew-create' && <MemoizedPersonneCreate isDarkMode={isDarkMode} />}
        {activeTab === 'personne-edit' && <MemoizedPersonneEdit isDarkMode={isDarkMode} />}
        {activeTab === 'participation-create' && <MemoizedParticipationCreate isDarkMode={isDarkMode} />}
        {activeTab === 'participation-list' && <MemoizedParticipationList isDarkMode={isDarkMode} />}
        {activeTab === 'participation-edit' && <MemoizedParticipationEdit isDarkMode={isDarkMode} />}
        {activeTab === 'material-type-create' && <MemoizedMaterialTypeCreate isDarkMode={isDarkMode} />}
        {activeTab === 'material-create' && <MemoizedMaterialCreate isDarkMode={isDarkMode} />}
        {activeTab === 'materiel-edit' && <MemoizedMaterielEdit isDarkMode={isDarkMode} />}
        {activeTab === 'material-used-create' && <MemoizedMaterialUsedCreate isDarkMode={isDarkMode} />}
        {activeTab === 'material-used-list' && <MemoizedMaterialUsedList isDarkMode={isDarkMode} />}
        {activeTab === 'material-used-edit' && <MemoizedMaterialUsedEdit isDarkMode={isDarkMode} />}
        {activeTab === 'subtitles-create' && <MemoizedSubtitlingCreate isDarkMode={isDarkMode} />}
        {activeTab === 'subtitles-list' && <MemoizedSubtitlingList isDarkMode={isDarkMode} />}
        {activeTab === 'subtitles-edit' && <MemoizedSubtitlingEdit isDarkMode={isDarkMode} />}

        {/* Other sections */}
        {activeTab === 'users' && <MemoizedUsersView isDarkMode={isDarkMode} />}
        {activeTab === 'crew' && <MemoizedCrewView isDarkMode={isDarkMode} />}
        {activeTab === 'equipment' && <MemoizedEquipmentView isDarkMode={isDarkMode} />}
        {activeTab === 'subtitles' && <MemoizedSubtitlingView isDarkMode={isDarkMode} />}
        {activeTab === 'analytics' && <MemoizedAnalyticsView isDarkMode={isDarkMode} />}
        {activeTab === 'settings' && <MemoizedSettingsView isDarkMode={isDarkMode} />}
        {activeTab === 'personne-edit' && <MemoizedParticipationView isDarkMode={isDarkMode} />}
        {activeTab === 'participation-edit' && <MemoizedParticipationView isDarkMode={isDarkMode} />}
        {activeTab === 'materiel-edit' && <MemoizedEquipmentView isDarkMode={isDarkMode} />}
        {activeTab === 'soustitre-modify' && <MemoizedSoustitreView isDarkMode={isDarkMode} />}
        {activeTab === 'type-materiel-list' && <MemoizedEquipmentView isDarkMode={isDarkMode} />}
        {activeTab === 'materiel-utilisation-edit' && <MemoizedEquipmentView isDarkMode={isDarkMode} />}
        {activeTab === 'soustitre-view' && <MemoizedSoustitreView isDarkMode={isDarkMode} />}

            </>
          } />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}