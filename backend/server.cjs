const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = 'mongodb://omghodke33_db_user:cYFSQ839LOF043XZ@ac-ijtswvf-shard-00-00.ntiixin.mongodb.net:27017,ac-ijtswvf-shard-00-01.ntiixin.mongodb.net:27017,ac-ijtswvf-shard-00-02.ntiixin.mongodb.net:27017/?ssl=true&replicaSet=atlas-14drv8-shard-0&authSource=admin';

mongoose.connect(MONGO_URI, { family: 4 })
  .then(() => {
    console.log('MongoDB Atlas Connected successfully');
    seedMovies();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// --- Schemas & Models ---

const MovieSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: String, required: true },
  duration: { type: String, required: true },
  poster: { type: String, required: true },
  description: { type: String, required: true }
});
const Movie = mongoose.model('Movie', MovieSchema);

const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

const Booking = mongoose.model('Booking', new mongoose.Schema({
  userId: { type: String, required: true },
  movieId: { type: String, required: true },
  movieTitle: { type: String, required: true },
  seats: { type: [String], required: true },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
}));

// --- Auto-Seed Function ---
async function seedMovies() {
  const count = await Movie.countDocuments();
  if (count === 0) {
    const initialMovies = [
      {
        "id": "1",
        "title": "Inception",
        "genre": "Sci-Fi / Action",
        "rating": "4.8",
        "duration": "2h 28m",
        "poster": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
        "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
      },
      {
        "id": "2",
        "title": "Interstellar",
        "genre": "Adventure / Sci-Fi",
        "rating": "4.9",
        "duration": "2h 49m",
        "poster": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=800",
        "description": "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft to find a new planet for humans."
      },
      {
        "id": "3",
        "title": "The Dark Knight",
        "genre": "Action / Crime",
        "rating": "4.9",
        "duration": "2h 32m",
        "poster": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800",
        "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests of his ability."
      },
      {
        "id": "4",
        "title": "Avatar: The Way of Water",
        "genre": "Sci-Fi / Fantasy",
        "rating": "4.5",
        "duration": "3h 12m",
        "poster": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
        "description": "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns, Jake must work to protect their home."
      },
      {
        "id": "5",
        "title": "Spider-Man: Across the Spider-Verse",
        "genre": "Animation / Action",
        "rating": "4.8",
        "duration": "2h 20m",
        "poster": "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=800",
        "description": "Brooklyn's full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence."
      },
      {
        "id": "6",
        "title": "Oppenheimer",
        "genre": "Biography / Drama",
        "rating": "4.7",
        "duration": "3h 00m",
        "poster": "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=800",
        "description": "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II."
      },
      {
        "id": "7",
        "title": "Dune: Part Two",
        "genre": "Sci-Fi / Adventure",
        "rating": "4.8",
        "duration": "2h 46m",
        "poster": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800",
        "description": "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family."
      },
      {
        "id": "8",
        "title": "John Wick: Chapter 4",
        "genre": "Action / Thriller",
        "rating": "4.6",
        "duration": "2h 49m",
        "poster": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800",
        "description": "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances."
      }
    ];
    await Movie.insertMany(initialMovies);
    console.log('Sample movies seeded into MongoDB successfully.');
  }
}

// --- API Routes ---
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error("Login route error:", err);
    res.status(500).json({ message: err.message });
  }
});
// Rule-Based Recommendation Endpoint
app.get('/api/recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userBookings = await Booking.find({ userId });
    
    let recommendedMovies = [];
    
    if (userBookings.length > 0) {
      // Rule 1: Extract genres from user's past bookings
      const bookedMovieIds = userBookings.map(b => b.movieId);
      const bookedMovies = await Movie.find({ id: { $in: bookedMovieIds } });
      
      const genres = [...new Set(bookedMovies.flatMap(m => m.genre.split(' / ')))]
      
      // Find movies matching user's favorite genres, excluding already booked ones
      recommendedMovies = await Movie.find({
        id: { $nin: bookedMovieIds },
        genre: { $regex: new RegExp(genres.join('|'), 'i') }
      }).limit(4);
    }
    
    // Rule 2: Fallback to top-rated blockbusters if history is empty or yields too few results
    if (recommendedMovies.length < 4) {
      const topRated = await Movie.find({ rating: { $gte: '4.8' } }).limit(4);
      const existingIds = new Set(recommendedMovies.map(m => m.id));
      
      for (const m of topRated) {
        if (!existingIds.has(m.id) && recommendedMovies.length < 4) {
          recommendedMovies.push(m);
        }
      }
    }
    
    res.json(recommendedMovies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get all movies from MongoDB
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single movie by ID from MongoDB
app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findOne({ id: req.params.id });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User Signup
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ 
      message: 'User created successfully', 
      user: { id: newUser._id, name: newUser.name, email: newUser.email } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { userId, movieId, movieTitle, seats, totalAmount } = req.body;
    const newBooking = new Booking({ userId, movieId, movieTitle, seats, totalAmount });
    await newBooking.save();
    res.status(201).json({ message: 'Booking successful', booking: newBooking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get User Bookings
app.get('/api/bookings/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
