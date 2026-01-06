import { X, Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react";
import { Movie } from "../types/movie";
import { Button } from "./ui/button";
import { useState } from "react";
import { Slider } from "./ui/slider";

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
}

export function VideoPlayer({ movie, onClose }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      <div className="w-full h-full relative group">
        {/* Video placeholder */}
        <div 
          className="w-full h-full bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${movie.thumbnail})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          
          {!isPlaying && (
            <Button
              size="icon"
              className="h-20 w-20 rounded-full bg-white/90 hover:bg-white text-black relative z-10"
              onClick={() => setIsPlaying(true)}
            >
              <Play className="h-10 w-10 fill-current ml-1" />
            </Button>
          )}
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="mb-4">
            <Slider
              value={[progress]}
              onValueChange={(value) => setProgress(value[0])}
              max={100}
              step={1}
              className="cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 fill-current" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={(value) => {
                    setVolume(value[0]);
                    setIsMuted(value[0] === 0);
                  }}
                  max={100}
                  step={1}
                  className="w-24"
                />
              </div>

              <span className="text-white text-sm ml-2">0:00 / {movie.duration}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-white">
                <h3 className="text-sm">{movie.title}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
