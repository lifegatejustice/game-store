require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./config/passport');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const errorHandler = require('./middleware/errorHandler');
const jwt = require('jsonwebtoken');


const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',

  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));


app.use(passport.initialize());
app.use(passport.session());

// Middleware to set Authorization header from JWT cookie for API routes
app.use('/api', (req, res, next) => {
  if (req.cookies.jwt) {
    req.headers.authorization = `Bearer ${req.cookies.jwt}`;
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/games', require('./routes/games'));
app.use('/api/characters', require('./routes/characters'));
app.use('/api/developers', require('./routes/developers'));
app.use('/api/reviews', require('./routes/reviews'));

// Swagger
app.use('/api-docs', (req, res, next) => {
  let token = req.cookies.jwt;
  if (token) {
    req.swaggerAuth = `Bearer ${token}`;
  }
  next();
}, swaggerUi.serve, swaggerUi.setup(specs, {
  swaggerOptions: {
    persistAuthorization: true,
    auth: {
      BearerAuth: {
        name: "Authorization",
        schema: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "JWT token"
        },
        value: (req) => req.swaggerAuth,
      }
    },
  },
  customJs: `
    window.onload = function() {
      const ui = window.ui;
      if (ui) {
        ui.getConfigs().requestInterceptor = function(req) {
          if (req.swaggerAuth) {
            req.headers.Authorization = req.swaggerAuth;
          }
          return req;
        };
      }
    };
  `
}));








// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
