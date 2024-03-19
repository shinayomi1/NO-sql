// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/social_network_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Mongoose models
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  // Add any other fields as needed
});

const ThoughtSchema = new mongoose.Schema({
  text: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Add any other fields as needed
});

const ReactionSchema = new mongoose.Schema({
  type: String,
  thought: { type: mongoose.Schema.Types.ObjectId, ref: 'Thought' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Add any other fields as needed
});

const User = mongoose.model('User', UserSchema);
const Thought = mongoose.model('Thought', ThoughtSchema);
const Reaction = mongoose.model('Reaction', ReactionSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().populate('user');
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
});

// Define other routes for updating, deleting users, thoughts, reactions, etc.

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
