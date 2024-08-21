const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI =
  'mongodb+srv://siddarthakm:Bunnynani1@trips.43aae.mongodb.net/?retryWrites=true&w=majority&appName=trips';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const tripSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  tripName: String,
  tripDate: String,
  coverImage: String,
  tripImages: [String],
  description: String,
});

const User = mongoose.model('User', userSchema);
const Trip = mongoose.model('Trip', tripSchema);

// User Sign-Up
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.status(201).json({ message: 'User created successfully' });
});

// User Sign-In
app.post('/api/signin', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid password' });
  }
  const token = jwt.sign({ userId: user._id }, 'SECRET_KEY');
  res.status(200).json({ token });
});

// Middleware to authenticate the user
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, 'SECRET_KEY');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// API route to add a new trip
app.post('/api/trips', authenticate, async (req, res) => {
  const { tripName, tripDate, coverImage, tripImages, description } = req.body;
  const newTrip = new Trip({
    userId: req.userId,
    tripName,
    tripDate,
    coverImage,
    tripImages,
    description,
  });
  await newTrip.save();
  res.status(201).json(newTrip);
});

// API route to get all trips for the logged-in user
app.get('/api/trips', authenticate, async (req, res) => {
  const trips = await Trip.find({ userId: req.userId });
  res.json(trips);
});

// API route to delete a trip
app.delete('/api/trips/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTrip = await Trip.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });
    if (!deletedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting trip' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
