import { ThemedCard } from '../../components/ui/ThemedCard';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { ThemedIcon } from '../../components/ui/ThemedIcon';
import { Film, TrendingUp, Star, Eye, Clock, Download } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToPDF } from '../../utils/exportPDF';
import { Movie } from '../../types/movie';

interface FilmsDashboardProps {
  isDarkMode: boolean;
  movies: Movie[];
}

export function FilmsDashboard({ isDarkMode, movies }: FilmsDashboardProps) {
  // Statistics
  const totalFilms = movies.length;
  const averageRating = movies.reduce((acc, m) => acc + (m.score || 0), 0) / movies.length;
  const thisYearFilms = movies.filter(m => m.releaseYear === new Date().getFullYear()).length;
  const topRatedFilm = movies.reduce((max, m) => (m.score || 0) > (max.score || 0) ? m : max, movies[0]);

  // Genre distribution
  const genreData = movies.reduce((acc: any, movie) => {
    acc[movie.genre] = (acc[movie.genre] || 0) + 1;
    return acc;
  }, {});

  const genreChartData = Object.entries(genreData).map(([name, value]) => ({ name, value }));

  // Films by year
  const yearData = movies.reduce((acc: any, movie) => {
    const year = movie.releaseYear;
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const yearChartData = Object.entries(yearData)
    .sort(([a], [b]) => Number(a) - Number(b))
    .slice(-5)
    .map(([year, count]) => ({ year, count }));

  // Rating distribution
  const ratingDistribution = movies.reduce((acc: any, movie) => {
    const rating = Math.floor(movie.score || 0);
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {});

  const ratingChartData = Object.entries(ratingDistribution)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([rating, count]) => ({ rating: `${rating}★`, count }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  const stats = [
    {
      title: 'Total Films',
      value: totalFilms,
      icon: Film,
      color: 'bg-blue-600',
      change: '+12% ce mois'
    },
    {
      title: 'Note Moyenne',
      value: averageRating.toFixed(1),
      icon: Star,
      color: 'bg-yellow-600',
      change: '+0.3 vs. mois dernier'
    },
    {
      title: 'Films 2025',
      value: thisYearFilms,
      icon: Clock,
      color: 'bg-green-600',
      change: 'Cette année'
    },
    {
      title: 'Top Film',
      value: topRatedFilm?.score?.toFixed(1) || 'N/A',
      icon: TrendingUp,
      color: 'bg-purple-600',
      change: topRatedFilm?.title || ''
    }
  ];

  return (
    <div className="space-y-6" id="films-dashboard-content">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Dashboard Films
            </h2>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Vue d'ensemble des statistiques de films
            </p>
          </div>
        </div>
        
        {/* Export Button */}
        <ThemedButton
          moduleName="films"
          onClick={() => exportToPDF('Dashboard Films ZOORA', isDarkMode, 'films-dashboard-content')}
          className="flex items-center gap-2 no-print"
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
            moduleName="films"
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
          moduleName="films"
          hoverable={true}
          useAdvancedHover={true}
        >
          <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Films par Genre
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genreChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genreChartData.map((entry, index) => (
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
          moduleName="films"
          hoverable={true}
          useAdvancedHover={true}
        >
          <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Films par Année (5 dernières)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="year" 
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
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ThemedCard>

        <ThemedCard 
          moduleName="films"
          className="lg:col-span-2"
          hoverable={true}
          useAdvancedHover={true}
        >
          <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Distribution des Notes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ratingChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="rating" 
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
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ThemedCard>
      </div>

      <ThemedCard 
        moduleName="films"
        hoverable={true}
        useAdvancedHover={true}
      >
        <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Top 5 Films les mieux notés
        </h3>
        <div className="space-y-3">
          {movies
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .slice(0, 5)
            .map((movie, index) => (
              <div 
                key={movie.id}
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
                  src={movie.thumbnail} 
                  alt={movie.title}
                  className="w-12 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {movie.title}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {movie.director} • {movie.releaseYear}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {movie.score?.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </ThemedCard>
    </div>
  );
}