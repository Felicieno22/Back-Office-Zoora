import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "../types/movie";
import { MovieCard } from "./MovieCard";
import { Button } from "./ui/button";
import { useRef } from "react";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onPlayClick: (movie: Movie) => void;
}

export function MovieRow({ title, movies, onPlayClick }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = direction === "left" ? -800 : 800;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-12 group/row">
      <h2 className="text-white px-4 mb-4">{title}</h2>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-full w-12 rounded-none bg-black/50 hover:bg-black/70 opacity-0 group-hover/row:opacity-100 transition-opacity"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-8 w-8 text-white" />
        </Button>
        
        <div 
          ref={rowRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-28"
          style={{ scrollbarWidth: 'none' }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none w-80">
              <MovieCard movie={movie} onPlayClick={onPlayClick} />
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-full w-12 rounded-none bg-black/50 hover:bg-black/70 opacity-0 group-hover/row:opacity-100 transition-opacity"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-8 w-8 text-white" />
        </Button>
      </div>
    </div>
  );
}
