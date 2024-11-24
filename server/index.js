const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Origin']
}));

app.use(express.json());


const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const User = mongoose.model('User', userSchema);


const eventSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'User'
  },
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String,
    trim: true 
  },
  startTime: { 
    type: Date, 
    required: true 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  reminder: { 
    type: Boolean, 
    default: false 
  },
  reminderTime: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Event = mongoose.model('Event', eventSchema);


const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token.' });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: 'Authentication error.' });
  }
};


app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error creating user.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in.' });
  }
});


app.get('/api/events', authenticateToken, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.userId })
      .sort({ startTime: 1 });
    res.json(events);
  } catch (error) {
    console.error('Fetch events error:', error);
    res.status(500).json({ error: 'Error fetching events.' });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { title, description, startTime, endTime, reminder, reminderTime } = req.body;

    
    if (!title || !startTime || !endTime) {
      return res.status(400).json({ error: 'Title, start time, and end time are required.' });
    }

    if (new Date(startTime) > new Date(endTime)) {
      return res.status(400).json({ error: 'End time must be after start time.' });
    }

    const event = new Event({
      userId: req.user.userId,
      title,
      description,
      startTime,
      endTime,
      reminder,
      reminderTime
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Error creating event.' });
  }
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, startTime, endTime, reminder, reminderTime } = req.body;
    if (!title || !startTime || !endTime) {
      return res.status(400).json({ error: 'Title, start time, and end time are required.' });
    }
    if (new Date(startTime) > new Date(endTime)) {
      return res.status(400).json({ error: 'End time must be after start time.' });
    }
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, description, startTime, endTime, reminder, reminderTime },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Error updating event.' });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    res.json({ message: 'Event deleted successfully.' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Error deleting event.' });
  }
});
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log('Server running on port', process.env.PORT || 4000);
    });
  })
  .catch(err => console.error('Could not connect to MongoDB:', err));