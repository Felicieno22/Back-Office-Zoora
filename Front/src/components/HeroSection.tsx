import { Play, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Movie } from "../types/movie";

interface HeroSectionProps {
  movie: Movie;
  onPlayClick: (movie: Movie) => void;
}

export function HeroSection({ movie, onPlayClick }: HeroSectionProps) {
  return (
    <div className="relative h-[80vh] w-full">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.thumbnail})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <h2 className="text-white mb-4">{movie.title}</h2>
          <p className="text-white/90 mb-6 max-w-lg">
            {movie.description}
          </p>
          <div className="flex items-center gap-4 mb-6 text-white/80">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.duration}</span>
            <span>•</span>
            <span>{movie.rating}</span>
          </div>
          <div className="flex gap-4">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-white/90"
              onClick={() => onPlayClick(movie)}
            >
              <Play className="h-5 w-5 mr-2 fill-current" />
              Play
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-gray-500/30 text-white border-white/40 hover:bg-gray-500/50"
            >
              <Info className="h-5 w-5 mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
