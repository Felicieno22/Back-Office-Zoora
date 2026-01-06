import { Play, Plus, ThumbsUp } from "lucide-react";
import { Movie } from "../types/movie";
import { Button } from "./ui/button";
import { useState } from "react";

interface MovieCardProps {
  movie: Movie;
  onPlayClick: (movie: Movie) => void;
}

export function MovieCard({ movie, onPlayClick }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative cursor-pointer transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
        <img 
          src={movie.thumbnail} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        
        {isHovered && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-white/90 hover:bg-white text-black"
              onClick={() => onPlayClick(movie)}
            >
              <Play className="h-6 w-6 fill-current" />
            </Button>
          </div>
        )}
      </div>
      
      {isHovered && (
        <div className="absolute -bottom-24 left-0 right-0 bg-gray-900 rounded-b-lg p-4 shadow-xl z-10">
          <h3 className="text-white mb-2">{movie.title}</h3>
          <div className="flex items-center gap-2 mb-3">
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 rounded-full border-white/40 hover:border-white"
              onClick={() => onPlayClick(movie)}
            >
              <Play className="h-4 w-4 fill-current" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 rounded-full border-white/40 hover:border-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 rounded-full border-white/40 hover:border-white"
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span className="text-green-500">{movie.rating}</span>
            <span>•</span>
            <span>{movie.duration}</span>
          </div>
          <p className="text-white/60 text-sm mt-2 line-clamp-2">
            {movie.description}
          </p>
        </div>
      )}
    </div>
  );
}
