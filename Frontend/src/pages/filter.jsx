import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { Filter as FilterIcon, SlidersHorizontal, RotateCcw, Search } from 'lucide-react';

export default function Filter() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [selectedAge, setSelectedAge] = useState('All');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/movies')
      .then(res => res.json())
      .then(data => {
        let movieArray = [];
        if (Array.isArray(data)) {
          movieArray = data;
        } else if (data && Array.isArray(data.movies)) {
          movieArray = data.movies;
        } else if (data && Array.isArray(data.data)) {
          movieArray = data.data;
        }
        setMovies(movieArray);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch movies:", err);
        setMovies([]);
        setLoading(false);
      });
  }, []);

  // Dynamically extract genres (handling both string & array formats)
  const genres = ['All', ...new Set(
    movies.flatMap(m => {
      if (Array.isArray(m.genres)) return m.genres;
      if (m.genre) return [m.genre];
      return [];
    }).filter(Boolean)
  )];

  // Extract years
  const extractedYears = movies.map(m => {
    if (m.year) return m.year;
    if (m.releaseYear) return m.releaseYear;
    if (m.releaseDate) return new Date(m.releaseDate).getFullYear();
    return null;
  }).filter(Boolean);
  
  const uniqueYears = [...new Set(extractedYears)].sort((a, b) => b - a);
  const years = ['All', ...(uniqueYears.length > 0 ? uniqueYears : [2026, 2025, 2024, 2023, 2022, 2021])];

  // Extract age ratings
  const extractedAges = movies.map(m => m.ageRating || m.ratingCategory || m.rated || m.certificate).filter(Boolean);
  const uniqueAges = [...new Set(extractedAges)];
  const ageRatings = ['All', ...(uniqueAges.length > 0 ? uniqueAges : ['G', 'PG', 'PG-13', 'R', 'UA', 'A', '18+'])];

  // Robust Filtering Logic
  const filteredMovies = movies.filter(movie => {
    // 1. Keyword Search
    const matchesKeyword = searchKeyword === '' || 
      movie.title?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      movie.description?.toLowerCase().includes(searchKeyword.toLowerCase());

    // 2. Genre Filter (supports string or array)
    let matchesGenre = selectedGenre === 'All';
    if (!matchesGenre) {
      if (Array.isArray(movie.genres)) {
        matchesGenre = movie.genres.includes(selectedGenre);
      } else if (movie.genre) {
        matchesGenre = movie.genre === selectedGenre;
      }
    }
    
    // 3. Year Filter
    const movieYear = movie.year || movie.releaseYear || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null);
    const matchesYear = selectedYear === 'All' || String(movieYear) === String(selectedYear);

    // 4. Rating Filter (safely parses strings like "8.8/10" or numeric values)
    const rawRating = movie.rating ?? movie.imdbRating ?? 0;
    let numericRating = 0;
    if (typeof rawRating === 'string') {
      numericRating = parseFloat(rawRating.split('/')[0]) || 0;
    } else {
      numericRating = Number(rawRating) || 0;
    }
    const matchesRating = numericRating >= minRating;

    // 5. Age Rating Filter
    const movieAge = movie.ageRating || movie.ratingCategory || movie.rated || movie.certificate;
    const matchesAge = selectedAge === 'All' || movieAge === selectedAge;

    return matchesKeyword && matchesGenre && matchesYear && matchesRating && matchesAge;
  });

  const resetFilters = () => {
    setSelectedGenre('All');
    setSelectedYear('All');
    setMinRating(0);
    setSelectedAge('All');
    setSearchKeyword('');
  };

  if (loading) {
    return <div className="text-center py-32 text-gray-500 animate-pulse font-medium">Loading filter suite...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-red-500 text-xs font-bold tracking-wider uppercase mb-1">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Advanced Discovery</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Filter & Explore Movies</h1>
          <p className="text-xs text-gray-400 mt-1">Find your exact cinematic match using precision parameters.</p>
        </div>
        <button 
          onClick={resetFilters}
          className="self-start md:self-auto flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-gray-300 px-4 py-2 rounded-xl text-xs font-bold border border-gray-800 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Filter Controls Grid */}
      <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Keyword Search */}
        <div className="space-y-1.5 lg:col-span-1">
          <label className="text-xs font-bold text-gray-400">Keyword Search</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search title..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 transition"
            />
          </div>
        </div>

        {/* Genre Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400">Genre</label>
          <select 
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 transition"
          >
            {genres.map((g, idx) => (
              <option key={idx} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400">Release Year</label>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 transition"
          >
            {years.map((y, idx) => (
              <option key={idx} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Age Rating Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400">Age Rating</label>
          <select 
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 transition"
          >
            {ageRatings.map((a, idx) => (
              <option key={idx} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Minimum Rating Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-gray-400">Min Rating</label>
            <span className="text-xs font-black text-red-500">{minRating} / 10</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="10" 
            step="0.5"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="w-full accent-red-600 bg-gray-950 cursor-pointer h-2 rounded-lg"
          />
        </div>

      </div>

      {/* Results Count & Grid */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Matching Movies <span className="text-red-500 font-black">({filteredMovies.length})</span>
          </h2>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/40 border border-gray-800 rounded-3xl space-y-3">
            <FilterIcon className="w-10 h-10 text-gray-600 mx-auto" />
            <p className="font-bold text-white text-base">No movies match your filter criteria</p>
            <p className="text-xs text-gray-400">Try relaxing your parameters or resetting filters.</p>
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