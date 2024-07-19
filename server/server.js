const express = require("express");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const cors = require("cors"); // Importer le middleware CORS
const { connectDB } = require("./models");
const userRoutes = require("./routes/user");
const protectedRoutes = require("./routes/protected");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure les sessions
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Utiliser le middleware CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Spécifier l'origine de ton front-end
    credentials: true,
  })
);

// Initialise Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/protected", protectedRoutes);

// Connect to PostgreSQL and start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
