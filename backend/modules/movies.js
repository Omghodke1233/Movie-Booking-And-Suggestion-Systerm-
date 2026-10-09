const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: String, required: true },
  duration: { type: String, required: true },
  poster: { type: String, required: true },
  description: { type: String, required: true },
  year: { type: Number },          // Added release year
  ageRating: { type: String }      // Added age rating (e.g., "PG-13", "R", "18+")
});

module.exports = mongoose.model('Movie', MovieSchema);