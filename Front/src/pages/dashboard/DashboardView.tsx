import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Film, Tv, Users, TrendingUp, Eye, Star, Download, FileText } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { exportToPDF } from '../../utils/exportPDF';
import { apiRequest } from '../../utils/api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface DashboardStats {
  totalSeries: number;
  totalSaisons: number;
  totalEpisodes: number;
  episodesReady: number;
  episodesPreparing: number;
  episodesError: number;
  dureeTotaleContenuSecondes: number;
}

interface DashboardViewProps {
  isDarkMode: boolean;
  movies: any[];
  series: any[];
}

export function DashboardView({ isDarkMode, movies, series }: DashboardViewProps) {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Utiliser les données locales pour les statistiques
        const data = {
          totalSeries: series.length,
          totalSaisons: series.reduce((acc, s) => acc + (s.saisons?.length || 0), 0),
          totalEpisodes: series.reduce((acc, s) => acc + (s.saisons?.reduce((acc2, season) => acc2 + (season.episodes?.length || 0), 0) || 0), 0),
          episodesReady: 0,
          episodesPreparing: 0,
          episodesError: 0,
          dureeTotaleContenuSecondes: 0
        };
        setDashboardStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        toast.error('Erreur lors de la récupération des statistiques');
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const blob = await apiRequest('/api/series/dashboard/export/pdf', { method: 'GET' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Dashboard_Zoora_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Dashboard exporté avec succès');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Erreur lors de l\'export PDF');
      // Fallback to client-side export if server-side fails
      exportToPDF('Dashboard ZOORA - Vue d\'ensemble', isDarkMode, 'dashboard-content');
    } finally {
      setIsExporting(false);
    }
  };

  // Mock data for charts
  const viewsData = [
    { name: 'Lun', films: 4000, series: 2400 },
    { name: 'Mar', films: 3000, series: 1398 },
    { name: 'Mer', films: 2000, series: 9800 },
    { name: 'Jeu', films: 2780, series: 3908 },
    { name: 'Ven', films: 1890, series: 4800 },
    { name: 'Sam', films: 2390, series: 3800 },
    { name: 'Dim', films: 3490, series: 4300 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Fév', revenue: 19000 },
    { month: 'Mar', revenue: 15000 },
    { month: 'Avr', revenue: 25000 },
    { month: 'Mai', revenue: 22000 },
    { month: 'Juin', revenue: 30000 },
  ];

  const stats = [
    {
      title: 'Total Films',
      value: movies.length,
      icon: Film,
      color: 'bg-blue-600',
      change: '+12.5%',
      trend: 'up'
    },
    {
      title: 'Total Séries',
      value: dashboardStats?.totalSeries ?? series.length,
      icon: Tv,
      color: 'bg-purple-600',
      change: '+8.2%',
      trend: 'up'
    },
    {
      title: 'Total Épisodes',
      value: dashboardStats?.totalEpisodes ?? '...',
      icon: Star,
      color: 'bg-green-600',
      change: `${dashboardStats?.episodesReady ?? 0} prêts`,
      trend: 'up'
    },
    {
      title: 'Durée Totale',
      value: dashboardStats ? `${Math.round(dashboardStats.dureeTotaleContenuSecondes / 3600)}h` : '...',
      icon: Eye,
      color: 'bg-orange-600',
      change: '+15.3%',
      trend: 'up'
    }
  ];

  const topContent = [
    { title: 'Inception', type: 'Film', views: '125K', rating: 9.2 },
    { title: 'Breaking Bad', type: 'Série', views: '98K', rating: 9.5 },
    { title: 'The Matrix', type: 'Film', views: '87K', rating: 8.9 },
    { title: 'Stranger Things', type: 'Série', views: '76K', rating: 8.7 },
    { title: 'Interstellar', type: 'Film', views: '65K', rating: 9.0 },
  ];

  return (
    <div className="space-y-6" id="dashboard-content">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-3xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Dashboard
          </h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Vue d'ensemble de votre plateforme ZOORA
          </p>
        </div>

        {/* Export Button */}
        <Button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white no-print"
          onClick={handleExportPDF}
          disabled={isExporting}
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Exportation...' : 'Exporter PDF'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.title}
                </p>
                <p className={`text-3xl mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">{stat.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Vues par jour (Cette semaine)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis
                dataKey="name"
                stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#fff' : '#000'
                }}
              />
              <Area
                type="monotone"
                dataKey="films"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="series"
                stackId="1"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Revenus (6 derniers mois)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis
                dataKey="month"
                stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#fff' : '#000'
                }}
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Content */}
      <Card className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Top Contenus Cette Semaine
        </h3>
        <div className="space-y-3">
          {topContent.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                }`}
            >
              <div className={`text-2xl w-10 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                  {item.title}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.type}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {item.views}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {item.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Activité Récente
        </h3>
        <div className="space-y-4">
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {dashboardStats ? "Données synchronisées avec le serveur." : "En attente de connexion avec le serveur..."}
          </p>
          {dashboardStats && (
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
              <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>Dernière mise à jour : {new Date().toLocaleTimeString()}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}