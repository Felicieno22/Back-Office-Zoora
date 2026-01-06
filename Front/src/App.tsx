import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { NewSidebar } from './components/NewSidebar';
import { AdminHeader } from './components/AdminHeader';
import { HomeView } from './pages/home/HomeView';
import { DashboardView } from './pages/dashboard/DashboardView';
import { FilmsCreate } from './pages/films/FilmsCreate';
import { FilmsList } from './pages/films/FilmsList';
import { FilmsDashboard } from './pages/films/FilmsDashboard';
import { SeriesCreate } from './pages/series/SeriesCreate';
import { SeriesList } from './pages/series/SeriesList';
import { SeriesDashboard } from './pages/series/SeriesDashboard';
import { ValidationList } from './pages/validation/ValidationList';
import { UsersView } from './components/UsersView';
import { CrewView } from './components/CrewView';
import { EquipmentView } from './components/EquipmentView';
import { SettingsView } from './components/SettingsView';
import { AnalyticsView } from './components/AnalyticsView';
import { movies as initialMovies } from './data/movies';
import { series as initialSeries } from './data/series';
import { Movie } from './types/movie';
import { Serie } from './data/series';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState('home');
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [series, setSeries] = useState<Serie[]>(initialSeries);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Movie handlers
  const handleAddMovie = (movieData: Omit<Movie, 'id'>) => {
    const newMovie: Movie = {
      ...movieData,
      id: (movies.length + 1).toString(),
    };
    setMovies([...movies, newMovie]);
  };

  const handleEditMovie = (id: string, movieData: Partial<Movie>) => {
    setMovies(movies.map(movie => 
      movie.id === id ? { ...movie, ...movieData } : movie
    ));
  };

  const handleDeleteMovie = (id: string) => {
    setMovies(movies.filter(movie => movie.id !== id));
  };

  // Serie handlers
  const handleAddSerie = (serieData: Omit<Serie, 'id'>) => {
    const newSerie: Serie = {
      ...serieData,
      id: (series.length + 1).toString(),
    };
    setSeries([...series, newSerie]);
  };

  const handleDeleteSerie = (id: string) => {
    setSeries(series.filter(serie => serie.id !== id));
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isAuthenticated) {
    return (
      <>
        {authView === 'login' ? (
          <Login onSwitchToRegister={() => setAuthView('register')} />
        ) : (
          <Register onSwitchToLogin={() => setAuthView('login')} />
        )}
        <Toaster />
      </>
    );
  }

  return (
    <div className={isDarkMode ? 'min-h-screen bg-black' : 'min-h-screen bg-gray-50'}>
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
        {/* Home */}
        {activeTab === 'home' && (
          <HomeView 
            isDarkMode={isDarkMode} 
            onNavigate={setActiveTab}
            moviesCount={movies.length}
            seriesCount={series.length}
          />
        )}
        
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <DashboardView isDarkMode={isDarkMode} movies={movies} series={series} />
        )}
        
        {/* Films */}
        {activeTab === 'films-create' && (
          <FilmsCreate isDarkMode={isDarkMode} onAddMovie={handleAddMovie} />
        )}
        {activeTab === 'films-list' && (
          <FilmsList isDarkMode={isDarkMode} movies={movies} onDeleteMovie={handleDeleteMovie} />
        )}
        {activeTab === 'films-dashboard' && (
          <FilmsDashboard isDarkMode={isDarkMode} movies={movies} />
        )}

        {/* Series */}
        {activeTab === 'series-create' && (
          <SeriesCreate isDarkMode={isDarkMode} onAddSerie={handleAddSerie} />
        )}
        {activeTab === 'series-list' && (
          <SeriesList isDarkMode={isDarkMode} series={series} onDeleteSerie={handleDeleteSerie} />
        )}
        {activeTab === 'series-dashboard' && (
          <SeriesDashboard isDarkMode={isDarkMode} series={series} />
        )}

        {/* Validation */}
        {activeTab === 'validation-list' && (
          <ValidationList isDarkMode={isDarkMode} />
        )}

        {/* Other sections */}
        {activeTab === 'users' && <UsersView isDarkMode={isDarkMode} />}
        {activeTab === 'crew' && <CrewView isDarkMode={isDarkMode} />}
        {activeTab === 'equipment' && <EquipmentView isDarkMode={isDarkMode} />}
        {activeTab === 'analytics' && <AnalyticsView isDarkMode={isDarkMode} />}
        {activeTab === 'settings' && <SettingsView isDarkMode={isDarkMode} />}
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