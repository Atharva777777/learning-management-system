const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Demo credentials (should match frontend)
const DEMO_EMAIL = 'student@university.edu';
const DEMO_PASSWORD = 'password123';

app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose.connect('mongodb+srv://atharvaborate3:mp3oEz4pcbNJCRvT@cluster01.w760coh.mongodb.net/LMS-PROJECT?retryWrites=true&w=majority&appName=Cluster01', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String
});
const User = mongoose.model('User', userSchema);

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user in database (plain password for demo only)
    const user = await User.findOne({ email, password });
    if (user) {
      return res.json({
        success: true,
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
          loggedIn: true,
          loginTime: new Date().toISOString()
        }
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Exam schema
const examSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String
});
const Exam = mongoose.model('Exam', examSchema);

// Get all exams
app.get('/exams', async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new exam
app.post('/exams', async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update an exam
app.put('/exams/:id', async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an exam
app.delete('/exams/:id', async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Course schema
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  teacher: String,
  date: String
});
const Course = mongoose.model('Course', courseSchema);

// Get all courses
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new course
app.post('/courses', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a course
app.put('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a course
app.delete('/courses/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('LMS Backend is running');
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

async function loadCourses() {
  showLoading();
  try {
    const res = await fetch('http://localhost:3001/courses');
    coursesData = await res.json();
    hideLoading();
    // ...render courses as before...
  } catch (err) {
    hideLoading();
    showToast('Failed to load courses', 'error');
  }
}