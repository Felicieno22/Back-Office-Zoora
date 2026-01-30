import { ThemedCard } from '../../components/ui/ThemedCard';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { ThemedIcon } from '../../components/ui/ThemedIcon';
import { Tv, TrendingUp, Star, Clock, Download, PlayCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { exportToPDF } from '../../utils/exportPDF';
import { Serie } from '../../types/base';

interface SeriesDashboardProps {
  isDarkMode: boolean;
  series: Serie[];
}

export function SeriesDashboard({ isDarkMode, series }: SeriesDashboardProps) {
  // Statistics
  const totalSeries = series.length;
  const totalEpisodes = series.reduce((acc, s) => acc + (s.episodes || 0), 0);
  const averageRating = series.reduce((acc, s) => acc + (s.rating || 0), 0) / series.length;
  const ongoingSeries = series.filter(s => s.status === 'En cours').length;

  // Status distribution
  const statusData = series.reduce((acc: any, serie) => {
    acc[serie.status] = (acc[serie.status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = Object.entries(statusData).map(([name, value]) => ({ name, value }));

  // Genre distribution
  const genreData = series.reduce((acc: any, serie) => {
    acc[serie.genre] = (acc[serie.genre] || 0) + 1;
    return acc;
  }, {});

  const genreChartData = Object.entries(genreData)
    .sort(([, a], [, b]) => Number(b) - Number(a))
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  const stats = [
    {
      title: 'Total Séries',
      value: totalSeries,
      icon: Tv,
      color: 'bg-purple-600',
      change: '+8% ce mois'
    },
    {
      title: 'Note Moyenne',
      value: averageRating.toFixed(1),
      icon: Star,
      color: 'bg-yellow-600',
      change: '+0.2 vs. mois dernier'
    },
    {
      title: 'En cours',
      value: ongoingSeries,
      icon: PlayCircle,
      color: 'bg-green-600',
      change: `${ongoingSeries} séries actives`
    },
    {
      title: 'Épisodes Total',
      value: totalEpisodes,
      icon: TrendingUp,
      color: 'bg-blue-600',
      change: 'Tous contenus'
    }
  ];

  return (
    <div className="space-y-6" id="series-dashboard-content">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-purple-600' : 'bg-purple-500'}`}>
            <Tv className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Dashboard Séries
            </h2>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Vue d'ensemble des statistiques de séries
            </p>
          </div>
        </div>
        
        {/* Export ThemedButton */}
        <ThemedButton
          moduleName="series"
          onClick={() => exportToPDF('Dashboard Séries ZOORA', isDarkMode, 'series-dashboard-content')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white no-print"
          useGradient={true}
          useHoverScale={true}
          useAdvancedShadow={true}
        >
          <Download className="w-4 h-4" />
          Exporter PDF
        </ThemedButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <ThemedCard 
            key={index}
            moduleName="series"
            className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
            hoverable={true}
            useAdvancedHover={true}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.title}
                </p>
                <p className={`text-3xl mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
                <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </ThemedCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThemedCard 
          moduleName="series"
          className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
          hoverable={true}
          useAdvancedHover={true}
        >
          <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Séries par Statut
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#fff' : '#000'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ThemedCard>

        <ThemedCard 
          moduleName="series"
          className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
          hoverable={true}
          useAdvancedHover={true}
        >
          <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Séries par Genre (Top 6)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={genreChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="name" 
                stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                angle={-45}
                textAnchor="end"
                height={80}
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
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ThemedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThemedCard 
          moduleName="series"
          className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
          hoverable={true}
          useAdvancedHover={true}
        >
          <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Top 5 Séries les mieux notées
          </h3>
          <div className="space-y-3">
            {series
              .sort((a, b) => (b.rating || 0) - (a.rating || 0))
              .slice(0, 5)
              .map((serie, index) => (
                <div 
                  key={`top-rated-${serie.id || index}`}
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                  }`}
                >
                  <div className={`text-2xl w-8 text-center ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <img 
                    src={serie.thumbnail} 
                    alt={serie.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                      {serie.title}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {serie.seasons} saisons • {serie.episodes} épisodes
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                      {serie.rating?.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </ThemedCard>

        <ThemedCard 
          moduleName="series"
          className={`p-6 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
          hoverable={true}
          useAdvancedHover={true}
        >
          <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Séries les plus longues
          </h3>
          <div className="space-y-3">
            {series
              .sort((a, b) => (b.episodes || 0) - (a.episodes || 0))
              .slice(0, 5)
              .map((serie, index) => (
                <div 
                  key={`longest-${serie.id || index}`}
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                  }`}
                >
                  <div className={`text-2xl w-8 text-center ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <img 
                    src={serie.thumbnail} 
                    alt={serie.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                      {serie.title}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {serie.director}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${
                    isDarkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {serie.episodes} eps
                  </div>
                </div>
              ))}
          </div>
        </ThemedCard>
      </div>
    </div>
  );
}