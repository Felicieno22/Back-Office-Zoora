import React from 'react';
import { TrendingUp, Eye, Clock, Star, Users, DollarSign, Film, Activity, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { PageContainer, SectionCard } from './shared/SharedLayout';
import { PageHeader } from './shared/PageHeader';

interface AnalyticsViewProps {
  isDarkMode: boolean;
}

const topMovies = [
  { id: 1, title: "Neon Shadows", views: 125450, rating: 4.8, duration: "2h 15m", genre: "Sci-Fi", trend: "+15%" },
  { id: 2, title: "The Last Horizon", views: 98230, rating: 4.6, duration: "2h 30m", genre: "Action", trend: "+12%" },
  { id: 3, title: "Whispers in the Dark", views: 87650, rating: 4.9, duration: "1h 45m", genre: "Horror", trend: "+8%" },
  { id: 4, title: "Summer in Paris", views: 76540, rating: 4.5, duration: "2h 05m", genre: "Romance", trend: "+6%" },
  { id: 5, title: "Code Red", views: 65890, rating: 4.7, duration: "2h 20m", genre: "Action", trend: "+10%" },
  { id: 6, title: "Eternal Flame", views: 54320, rating: 4.4, duration: "1h 55m", genre: "Drama", trend: "+5%" },
  { id: 7, title: "Ghost Protocol", views: 48750, rating: 4.6, duration: "2h 10m", genre: "Thriller", trend: "+7%" },
  { id: 8, title: "Midnight Blues", views: 42100, rating: 4.3, duration: "1h 50m", genre: "Drama", trend: "+4%" },
];

const genreStats = [
  { genre: "Action", views: 456789, percentage: 28, movies: 45, avgRating: 4.6 },
  { genre: "Sci-Fi", views: 398234, percentage: 24, movies: 32, avgRating: 4.7 },
  { genre: "Horror", views: 312456, percentage: 19, movies: 28, avgRating: 4.5 },
  { genre: "Romance", views: 234567, percentage: 14, movies: 38, avgRating: 4.4 },
  { genre: "Comédie", views: 198345, percentage: 12, movies: 41, avgRating: 4.3 },
  { genre: "Drame", views: 156789, percentage: 10, movies: 35, avgRating: 4.5 },
];

const monthlyRevenue = [
  { month: "Jan", revenue: 42500, users: 8900 },
  { month: "Fév", revenue: 45200, users: 9400 },
  { month: "Mar", revenue: 48900, users: 10200 },
  { month: "Avr", revenue: 43800, users: 9800 },
  { month: "Mai", revenue: 51200, users: 11500 },
  { month: "Juin", revenue: 54800, users: 12300 },
];

const viewingPeaks = [
  { time: "08h-12h", views: 15234, percentage: 12 },
  { time: "12h-16h", views: 28456, percentage: 22 },
  { time: "16h-20h", views: 45678, percentage: 35 },
  { time: "20h-00h", views: 38901, percentage: 30 },
  { time: "00h-08h", views: 5432, percentage: 4 },
];

export function AnalyticsView({ isDarkMode }: AnalyticsViewProps) {
  const maxRevenue = Math.max(...monthlyRevenue.map(d => d.revenue));
  const maxViews = Math.max(...viewingPeaks.map(d => d.views));

  return (
    <PageContainer>
      <PageHeader
        title="Analyses Détaillées"
        subtitle="Statistiques complètes de la plateforme ZOORA"
        icon={BarChart2}
        isDarkMode={isDarkMode}
      />

      {/* Statistiques en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Vues Aujourd'hui</p>
                <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} mt-2`}>28,456</h3>
                <p className="text-sm mt-2 text-green-500">+18.2% vs hier</p>
              </div>
              <div className="bg-red-600/10 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Durée Moyenne</p>
                <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} mt-2`}>1h 42m</h3>
                <p className="text-sm mt-2 text-green-500">+5.4% ce mois</p>
              </div>
              <div className="bg-red-600/10 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Note Moyenne</p>
                <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} mt-2`}>4.6/5</h3>
                <p className="text-sm mt-2 text-green-500">+0.3 ce mois</p>
              </div>
              <div className="bg-red-600/10 p-3 rounded-lg">
                <Star className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Utilisateurs Actifs</p>
                <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} mt-2`}>3,845</h3>
                <p className="text-sm mt-2 text-red-500">-2.1% vs hier</p>
              </div>
              <div className="bg-red-600/10 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Films les plus vus */}
      <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <TrendingUp className="h-5 w-5 text-red-600" />
            Top 8 des Films les Plus Vus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className={isDarkMode ? 'border-gray-800' : 'border-gray-200'}>
                <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>#</TableHead>
                <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Titre</TableHead>
                <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Genre</TableHead>
                <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Vues</TableHead>
                <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Note</TableHead>
                <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Durée</TableHead>
                <TableHead className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Tendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topMovies.map((movie, index) => (
                <TableRow key={movie.id} className={isDarkMode ? 'border-gray-800' : 'border-gray-200'}>
                  <TableCell className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded ${index < 3 ? 'bg-red-600 text-white' : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                      }`}>
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-white' : 'text-gray-900'}>{movie.title}</TableCell>
                  <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    <Badge variant="outline" className={isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-400 text-gray-700'}>
                      {movie.genre}
                    </Badge>
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {movie.views.toLocaleString()}
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      {movie.rating}
                    </div>
                  </TableCell>
                  <TableCell className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{movie.duration}</TableCell>
                  <TableCell>
                    <span className="text-green-500">{movie.trend}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statistiques par Genre */}
        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Film className="h-5 w-5 text-red-600" />
              Performances par Genre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {genreStats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{stat.genre}</span>
                      <Badge variant="outline" className={`${isDarkMode ? 'border-gray-600 text-gray-400' : 'border-gray-400 text-gray-600'} text-xs`}>
                        {stat.movies} films
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {stat.views.toLocaleString()} vues
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{stat.avgRating}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`w-full h-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                    <div
                      className="h-full bg-red-600 rounded-full transition-all"
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Heures de Pointe */}
        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Clock className="h-5 w-5 text-red-600" />
              Heures de Visionnage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-end justify-around gap-2 p-4">
              {viewingPeaks.map((peak, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {(peak.views / 1000).toFixed(1)}K
                  </div>
                  <div
                    className="w-full bg-red-600 rounded-t transition-all hover:bg-red-500 relative group"
                    style={{ height: `${(peak.views / maxViews) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {peak.percentage}%
                    </div>
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{peak.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenus Mensuels */}
      <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <DollarSign className="h-5 w-5 text-red-600" />
            Revenus et Croissance des Utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-end justify-around gap-4 p-4">
            {monthlyRevenue.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex flex-col items-center gap-1 text-xs">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    ${(item.revenue / 1000).toFixed(1)}K
                  </span>
                  <span className="text-blue-500">{(item.users / 1000).toFixed(1)}K</span>
                </div>
                <div className="w-full flex flex-col gap-1">
                  <div
                    className="w-full bg-red-600 rounded-t transition-all hover:bg-red-500"
                    style={{ height: `${(item.revenue / maxRevenue) * 150}px` }}
                  />
                  <div
                    className="w-full bg-blue-900 rounded-t transition-all hover:bg-blue-800"
                    style={{ height: `${(item.users / 12300) * 100}px` }}
                  />
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.month}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Revenus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-900 rounded"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Utilisateurs</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métriques supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Taux de Rétention</p>
                <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} mt-2`}>78.5%</h3>
                <p className="text-sm mt-2 text-green-500">+2.3% ce mois</p>
              </div>
              <div className="bg-red-600/10 p-3 rounded-lg">
                <Users className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Temps Moyen/Session</p>
                <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} mt-2`}>2h 18m</h3>
                <p className="text-sm mt-2 text-green-500">+12% ce mois</p>
              </div>
              <div className="bg-red-600/10 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Nouveaux Abonnés</p>
                <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} mt-2`}>+1,248</h3>
                <p className="text-sm mt-2 text-green-500">+28% ce mois</p>
              </div>
              <div className="bg-red-600/10 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
