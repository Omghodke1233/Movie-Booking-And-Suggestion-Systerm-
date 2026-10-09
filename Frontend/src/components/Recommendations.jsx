import React, { useState, useEffect } from 'react';
import { Sparkles, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Recommendations({ user }) {
  const [recommendations, setRecommendations] = useState([]);
  const userId = user?.id || user?._id || user?.email || 'guest';

  useEffect(() => {
    fetch(`http://localhost:5000/api/recommendations/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecommendations(data);
        }
      })
      .catch(err => console.error('Error fetching recommendations:', err));
  }, [userId]);

  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-4 my-8">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
        <h2 className="text-xl font-black text-white tracking-tight">Recommended For You</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {recommendations.map(movie => (
          <div key={movie.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col group">
            <div className="relative aspect-[2/3] overflow-hidden">
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg flex items-center space-x-1 text-xs font-bold text-yellow-400">
                <Star className="w-3.5 h-3.5 fill-yellow-400" />
                <span>{movie.rating}</span>
              </div>
            </div>

            <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{movie.genre}</span>
                <h3 className="text-base font-black text-white mt-0.5 line-clamp-1">{movie.title}</h3>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-xs">
                <span className="text-gray-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{movie.duration}</span>
                </span>
                <Link 
                  to={`/book/${movie.id}`} 
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl font-bold transition text-[11px]"
                >
                  Book Seats
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}