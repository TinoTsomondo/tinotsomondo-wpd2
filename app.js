const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const app = express();
const mentorController = require('./controllers/mentorController');
const adminMenteeController = require('./controllers/adminMenteeController');
const indexController = require('./controllers/indexController');
const loginController = require('./controllers/loginController');
const menteeDashController = require('./controllers/menteeDashController');
const adminEventController = require('./controllers/adminEventController');
const Resume = require('./models/resume');  // Updated path
const User = require('./models/user');      // Updated path
const Event = require('./models/adminEvents');  // Updated path
const Mentor = require('./models/adminMentor'); // Updated path
const upload = require('./middlewares/upload'); // Updated path
const Mentee = require('./models/adminMentee');  // Updated path

// Set the view engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Flash messages middleware
app.use(flash());

// Set the 'views' directory for rendering templates
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
mongoose.connect('mongodb+srv://ttsomondo:12345@cluster0.bjleuz6.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Set the destination folder for file uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to avoid conflicts
  },
});

// Index Controller Routes
app.get('/', indexController.renderHomePage);
app.get('/about', indexController.renderaboutUs);
app.get('/', indexController.renderHomePage);

// Mentor Controller Routes
app.get('/mentors', mentorController.listMentors);
app.get('/adminDash/mentor/add-mentor', mentorController.addMentorForm);
app.post('/adminDash/mentor/add-mentor', mentorController.createMentor);
app.get('/adminDash/mentor/edit-mentor/:id', mentorController.editMentorForm);
app.post('/adminDash/mentor/edit-mentor/:id', mentorController.updateMentor);
app.get('/adminDash/mentor/delete-mentor/:id', mentorController.deleteMentor);
app.get('/adminDash/mentor/view-mentor/:id', mentorController.viewMentor);
app.get('/adminDash/mentor/homeMentor', mentorController.listMentors);

// Mentee Controller Routes
app.get('/mentees', adminMenteeController.listMentees);
app.get('/adminDash/mentee/add-mentee', adminMenteeController.addMenteeForm);
app.post('/adminDash/mentee/add-mentee', adminMenteeController.createMentee);
app.get('/adminDash/mentee/edit-mentee/:id', adminMenteeController.editMenteeForm);
app.post('/adminDash/mentee/edit-mentee/:id', adminMenteeController.updateMentee);
app.get('/adminDash/mentee/delete-mentee/:id', adminMenteeController.deleteMentee);
app.get('/adminDash/mentee/view-mentee/:id', adminMenteeController.viewMentee);
app.get('/adminDash/mentee/homeMentee', adminMenteeController.listMentees);

// Event Controller Routes
app.get('/adminDash/event/add-event-form', adminEventController.addEventForm);
app.post('/adminDash/event/add-event', upload.single('image'), adminEventController.createEvent);
app.get('/adminDash/event/list-events', adminEventController.listEvents);
app.get('/events', adminEventController.listEvents);
app.get('/adminDash/event/delete-event/:id', adminEventController.deleteEvent);
app.get('/adminDash/event/edit-event/:id', adminEventController.editEvent);

// Login Controller Routes
app.get('/login', loginController.renderLoginPage);
app.post('/login', loginController.authenticateUser);
console.log('Before registration routes');
app.get('/register', loginController.renderRegistrationPage);
app.post('/register', loginController.createUser);
console.log('After registration routes');

// Logout Route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});

// Password Reset Routes
app.get('/reset-password', loginController.renderPasswordResetPage);
app.post('/reset-password', loginController.resetPassword);

// Mentee Dashboard Route
app.get('/student-dashboard', menteeDashController.renderMenteeDashboard);

// Admin Dashboard Route
app.get('/admin-dashboard', async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.render('adminDash/index', { mentors });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add this route definition for "/adminDash/mentee/homeMentee"
app.get('/adminDash/mentee/homeMentee', async (req, res) => {
  try {
    const mentees = await Mentee.find();
    res.render('adminDash/mentee/homeMentee', { mentees });
  } catch (error) {
    console.error('Error fetching mentees:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Resume Center Route
app.get('/resume-center', (req, res) => {
  res.render('menteeDash/resumeCenter');
});

// Add Resume Route
app.get('/add-resume', (req, res) => {
  console.log('Accessed /add-resume route');
  res.render('menteeDash/addResume');
});

// Handle form submission for adding resume
app.post('/add-resume', upload.single('resume'), (req, res) => {
  // Create a new resume document
  const newResume = new Resume({
    filePath: req.file.path,
  });

  // Save the resume to the database
  newResume.save((err) => {
    if (err) {
      console.error('Error saving resume:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Redirect or render success page
      res.redirect('/resume-center');
    }
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
