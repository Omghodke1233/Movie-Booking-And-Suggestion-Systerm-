import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import Recommendations from '../components/Recommendations';
import { Sparkles, Play } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Home({ user }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetch('http://localhost:5000/api/movies')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMovies(data);
        } else if (data && Array.isArray(data.movies)) {
          setMovies(data.movies);
        } else {
          setMovies([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch movies:", err);
        setMovies([]);
        setLoading(false);
      });
  }, []);

  const filteredMovies = Array.isArray(movies) 
    ? movies.filter(movie => {
        const titleMatch = movie?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
        const genreMatch = movie?.genre?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
        return titleMatch || genreMatch;
      })
    : [];

  if (loading) {
    return <div className="text-center py-32 text-gray-500 animate-pulse font-medium">Loading Dpcoe Cinema experience...</div>;
  }

  const featuredMovie = movies[0] || {};

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
      
      {/* Featured Banner Hero (Hidden while searching) */}
      {!searchQuery && featuredMovie.title && (
        <div className="relative rounded-3xl overflow-hidden border border-gray-800 bg-gray-900 h-[420px] shadow-2xl flex items-center">
          <div className="absolute inset-0">
            <img src={featuredMovie.poster} alt="Hero" className="w-full h-full object-cover filter blur-sm opacity-30 scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-xl p-8 md:p-12 space-y-4">
            <div className="inline-flex items-center space-x-1.5 bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold text-red-500">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NOW SHOWING BLOCKBUSTER</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">{featuredMovie.title}</h1>
            <p className="text-gray-300 text-xs md:text-sm line-clamp-3 leading-relaxed">{featuredMovie.description}</p>
            <div className="pt-2 flex items-center space-x-4">
              <Link 
                to={`/book/${featuredMovie.id || featuredMovie._id}`} 
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl text-sm font-bold flex items-center space-x-2 transition shadow-lg text-white"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Book Now</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations (Hidden while searching) */}
      {!searchQuery && <Recommendations user={user} />}

      {/* Movies Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              {searchQuery ? `Search Results (${filteredMovies.length})` : 'Explore All Movies'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {searchQuery ? `Showing matches for "${searchQuery}"` : 'Handpicked releases playing this week'}
            </p>
          </div>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/50 border border-gray-800 rounded-2xl text-gray-400 text-sm space-y-2">
            <p className="font-bold text-white">No movies found matching "{searchQuery}"</p>
            <p className="text-xs">Try searching for a different title or genre keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id || movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}