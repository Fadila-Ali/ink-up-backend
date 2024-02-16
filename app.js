const cors = require("cors");
const express = require("express");
const pgp = require('pg-promise')();
const authenticate = require('./middleware/authMiddleware');
const { registerUser, login, getAllUsers, getUserById, updateUser, deleteUser } = require('./queries/users');
const { createNote, getAllUserNotes, getUserNote, updateUserNote, deleteUserNote } = require('./queries/notes');

//! CONFIGURATION
const app = express();
const PORT = process.env.PORT || 8080;
const pgHost = process.env.PG_HOST;
const pgPort = process.env.PG_PORT;
const pgDatabase = process.env.PG_DATABASE;
const pgUser = process.env.PG_USER;
const pgPassword = process.env.PG_PASSWORD;

//! DATABASE CONNECTION
const db = pgp(`postgres://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}`);


// Define allowed origins for CORS
const allowedOrigins = ['http://localhost:3000'];
// CORS middleware configuration
const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  };


//! MIDDLEWARE
app.use(express.json());
app.use(cors(corsOptions)); // Use CORS middleware with configured options




db.connect()
  .then(obj => {
    console.log('Connected to the database');
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process on database connection error
  });


//! ROUTES FOR USERS
app.post("/register", registerUser); 
app.post('/login', login);
app.get('/users', getAllUsers);
app.get('/users/:id', getUserById);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);

//! ROUTES FOR NOTES
app.post("/notes", authenticate, createNote);
app.get("/notes", authenticate, getAllUserNotes);
app.get("/notes/:id", authenticate, getUserNote);
app.put("/notes/:id", authenticate, updateUserNote);
app.delete("/notes/:id", authenticate, deleteUserNote);




app.get("/", (req, res) => {
  res.send("Welcome to the InkUp!");
});

app.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

module.exports = app;