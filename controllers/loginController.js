const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate a secure secret key
const secretKey = crypto.randomBytes(32).toString('hex');

const registrationValidationRules = [
  check('fullname').notEmpty().withMessage('Fullname cannot be empty'),
  check('degreeProgram').notEmpty().withMessage('Degree Program cannot be empty'),
  check('email').isEmail().withMessage('Please enter a valid email address'),
  check('password').notEmpty().withMessage('Password cannot be empty'),
];

const loginValidationRules = [
  check('email').isEmail().withMessage('Please enter a valid email address'),
  check('password').notEmpty().withMessage('Password cannot be empty'),
];

const validateRegistration = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    res.redirect('/register');
  } else {
    next();
  }
};

const validateLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    res.redirect('/login');
  } else {
    next();
  }
};

const loginController = {
  renderLoginPage(req, res) {
    const data = {
      pageTitle: 'Login',
      logoPath: '/media/logo.png',
      homeLink: '/home',
      loginLink: '/login',
      aboutUsLink: '/about',
    };
    res.render('login/login', data);
  },

  authenticateUser: [
    ...loginValidationRules,
    validateLogin,
    async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
          req.flash('error', 'Invalid email or password');
          return res.redirect('/login');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          req.flash('error', 'Invalid email or password');
          return res.redirect('/login');
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, secretKey, { expiresIn: '1h' });
        res.cookie('token', token);
        const redirectPath = determineDashboardRedirect(user);
        res.redirect(redirectPath);
      } catch (error) {
        console.error('Authentication error:', error);
        req.flash('error', 'Internal Server Error');
        res.redirect('/login');
      }
    }
  ],

  renderRegistrationPage(req, res) {
    const data = {
      pageTitle: 'Register',
      logoPath: '/media/logo.png',
      homeLink: '/home',
      loginLink: '/login',
      aboutUsLink: '/about',
    };
    res.render('login/register', data);
  },

  createUser: [
    ...registrationValidationRules,
    validateRegistration,
    async (req, res) => {
      try {
        const { email, password, fullname, degreeProgram } = req.body;
        let role;

        if (email.endsWith('@alustudent.com')) {
          role = 'student';
        } else if (email === 'admin@alumentormentee.com') {
          role = 'admin';
        } else {
          req.flash('error', 'Invalid email format');
          res.redirect('/register');
          return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
          email,
          password: hashedPassword,
          role,
          fullname,
          degreeProgram,
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, secretKey, { expiresIn: '1h' });
        res.cookie('token', token);
        const redirectPath = determineDashboardRedirect(newUser);
        res.redirect(redirectPath);
      } catch (error) {
        console.error(error);
        req.flash('error', 'Registration failure');
        res.redirect('/register');
      }
    }
  ],

  renderPasswordResetPage(req, res) {
    const data = {
      pageTitle: 'Password Reset',
      logoPath: '/media/logo.png',
      homeLink: '/home',
      loginLink: '/login',
      aboutUsLink: '/about',
    };
    res.render('password-reset', data);
  },

  async resetPassword(req, res) {
    req.flash('success', 'Password reset successful');
    res.redirect('/login');
  },
};

function determineDashboardRedirect(user) {
  if (user && user.role === 'student') {
    return '/student-dashboard';
  } else if (user && user.role === 'admin') {
    return '/admin-dashboard';
  } else {
    return '/login';
  }
}


module.exports = loginController;
