import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieTitle: { type: String, required: true },
  moviePoster: { type: String, required: true },
  selectedSeats: { type: [String], required: true },
  totalAmount: { type: Number, required: true },
  showTime: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);