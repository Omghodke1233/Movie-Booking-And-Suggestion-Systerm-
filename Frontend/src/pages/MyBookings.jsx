import React, { useState, useEffect } from 'react';
import { Ticket, Calendar, Armchair, Film, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.id || user?._id || user?.email;

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/bookings/${userId}`)
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <div className="text-center py-32 text-gray-500 animate-pulse font-medium">Loading your ticket history...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center space-x-3">
          <Ticket className="w-7 h-7 text-bmsRed" />
          <span>My Bookings</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Review your active ticket reservations and past cinema visits</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-bmsCard border border-gray-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <Film className="w-12 h-12 text-gray-600 mx-auto" />
          <h2 className="text-lg font-bold text-white">No Bookings Found</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">You haven't reserved any tickets yet. Explore trending blockbusters and book your seats today!</p>
          <div className="pt-2">
            <Link to="/" className="inline-flex items-center space-x-2 bg-bmsRed hover:bg-bmsRedHover px-6 py-3 rounded-xl text-xs font-bold transition shadow-glow">
              <span>Browse Movies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <div 
              key={booking._id || booking.id} 
              className="bg-bmsCard border border-gray-800 hover:border-gray-700 rounded-2xl p-6 shadow-cardGlow flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-1.5 bg-bmsRed/10 border border-bmsRed/20 px-3 py-1 rounded-full text-[10px] font-bold text-bmsRed uppercase tracking-wider">
                  Confirmed Ticket
                </div>
                <h3 className="text-xl font-black text-white">{booking.movieTitle}</h3>
                
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-gray-300">
                  <div className="flex items-center space-x-1.5">
                    <Armchair className="w-3.5 h-3.5 text-bmsRed" />
                    <span className="font-semibold">Seats: {booking.seats.join(', ')}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-gray-800 pt-4 md:pt-0">
                <span className="text-[10px] uppercase font-semibold text-gray-500">Total Paid</span>
                <span className="text-xl font-black text-gold">₹{booking.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}