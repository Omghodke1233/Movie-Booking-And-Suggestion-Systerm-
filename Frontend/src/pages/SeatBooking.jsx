import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Armchair, CheckCircle, ArrowLeft } from 'lucide-react';

export default function SeatBooking({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/movies/${id}`)
      .then(res => res.json())
      .then(data => {
        setMovie(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-32 text-gray-500 animate-pulse font-medium">Loading theater layout...</div>;
  if (!movie) return <div className="text-center py-32 text-red-500 font-bold">Movie not found</div>;

  const rows = [
    { name: 'Royal (Recliners) - ₹350', seats: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'], price: 350 },
    { name: 'Club - ₹200', seats: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6'], price: 200 },
    { name: 'Club - ₹200', seats: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'], price: 200 }
  ];

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      return total + (seat.startsWith('A') ? 350 : 200);
    }, 0);
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;

    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id || user._id || user.email,
          movieId: movie.id,
          movieTitle: movie.title,
          seats: selectedSeats,
          totalAmount: calculateTotal()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Movie</span>
      </button>

      <div className="bg-bmsCard p-6 rounded-2xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-bmsRed tracking-wider uppercase">Book Tickets</span>
          <h1 className="text-2xl font-black text-white mt-0.5">{movie.title}</h1>
          <p className="text-xs text-gray-400 mt-1">{movie.genre} • {movie.duration}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 px-4 py-3 rounded-xl text-right">
          <div className="text-[10px] text-gray-400 font-semibold uppercase">Selected Seats</div>
          <div className="text-sm font-bold text-white">{selectedSeats.length ? selectedSeats.join(', ') : 'None'}</div>
        </div>
      </div>

      {success ? (
        <div className="bg-green-500/10 border border-green-500 text-green-400 p-8 rounded-2xl text-center space-y-3">
          <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
          <h2 className="text-xl font-bold">Booking Confirmed Successfully!</h2>
          <p className="text-xs text-gray-300">Redirecting to your bookings...</p>
        </div>
      ) : (
        <div className="bg-bmsCard p-8 rounded-2xl border border-gray-800 space-y-8 shadow-2xl">
          {/* Screen Layout Graphic */}
          <div className="space-y-2 text-center">
            <div className="w-3/4 mx-auto h-2 bg-gradient-to-r from-transparent via-bmsRed to-transparent rounded-full shadow-glow"></div>
            <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">All eyes this way please — Screen This Way</span>
          </div>

          {/* Seat Grid by Tiers */}
          <div className="space-y-6 pt-4">
            {rows.map((rowGroup, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-xs font-bold text-gray-400 border-b border-gray-800 pb-1">{rowGroup.name}</div>
                <div className="grid grid-cols-6 gap-3 max-w-md">
                  {rowGroup.seats.map(seat => {
                    const isSelected = selectedSeats.includes(seat);
                    return (
                      <button 
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        className={`py-2.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center space-y-1 transition ${
                          isSelected 
                            ? 'bg-bmsRed text-white shadow-glow border border-bmsRed' 
                            : 'bg-gray-900 text-gray-300 hover:border-gray-600 border border-gray-800'
                        }`}
                      >
                        <Armchair className="w-4 h-4" />
                        <span>{seat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Bar */}
          <div className="pt-6 border-t border-gray-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400">Total Amount</div>
              <div className="text-xl font-black text-white">₹{calculateTotal()}</div>
            </div>
            <button 
              disabled={selectedSeats.length === 0}
              onClick={handleBooking}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition shadow-glow ${
                selectedSeats.length > 0 
                  ? 'bg-bmsRed hover:bg-bmsRedHover text-white cursor-pointer' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed shadow-none'
              }`}
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}