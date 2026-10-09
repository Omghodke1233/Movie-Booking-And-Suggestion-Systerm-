import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function MovieCard({ movie }) {
  return (
    <div className="bg-bmsCard rounded-xl overflow-hidden shadow-lg hover:scale-105 transition duration-300 flex flex-col border border-gray-800">
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md flex items-center space-x-1 text-xs font-bold text-yellow-400">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{movie.rating}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-lg font-bold truncate">{movie.title}</h3>
          <p className="text-xs text-gray-400 mt-1">{movie.genre}</p>
        </div>
        <Link 
          to={`/book/${movie.id}`} 
          className="mt-4 block w-full text-center bg-bmsRed hover:bg-red-700 py-2 rounded-lg text-sm font-bold transition"
        >
          Book Ticket
        </Link>
      </div>
    </div>
  );
}