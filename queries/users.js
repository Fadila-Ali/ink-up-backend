const db = require("../db/dbConfig");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET;


const registerUser = async (req, res) => {
    try {
      const { firstname, lastname, email, profile_img, username, password_hash } = req.body;
      console.log('Request Body: ', req.body);
  
      // Check if the email or username is already registered
      const existingUser = await db.oneOrNone(
        'SELECT * FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );
  
      if (existingUser) {
        return res.status(400).json({ error: 'Email or username is already registered' });
      }
  
      const saltRounds = 10;
      console.log('Password before hashing:', password_hash);      
      const hashedPassword = await bcrypt.hash(password_hash, saltRounds);
      console.log('Hashed password:', hashedPassword);

  
      const newUser = await db.one(
        'INSERT INTO users (firstname, lastname, email, profile_img, username, password_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, firstname, lastname, email, profile_img, username',
        [firstname, lastname, email, profile_img, username, hashedPassword]
      );
  
      const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1d' }); 
      res.status(201).json({ user: newUser, token });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal server error, Error registering user' });
    }
  };


  const login = async (req, res) => {
    try {
      const { username, password_hash } = req.body;
      console.log('Login request:', req.body);
  
      const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
      console.log('User:', user);
  
      if (!user || !(await bcrypt.compare(password_hash, user.password_hash))) {
        console.log('Invalid username or password');
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      console.log('Login successful:', user, token);
      res.status(200).json({ user, token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  


    // Function to get all users
    const getAllUsers = async (req, res) => {
        try {
        const users = await db.any('SELECT * FROM users');
        res.status(200).json(users);
        } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Internal server error' });
        }
    };


    // Function to get user details by ID
    const getUserById = async (req, res) => {
        try {
        const userId = req.params.id;
        const user = await db.one('SELECT * FROM users WHERE id = $1', userId);
        res.status(200).json(user);
        } catch (error) {
        console.error('Error getting user details:', error);
        res.status(500).json({ error: 'Internal server error' });
        }
    };


    // Function to update user details
    const updateUser = async (req, res) => {
        try {
        const userId = req.params.id;
        const { firstname, lastname, email, profile_img, username } = req.body;
    
        // Check if the user exists
        const existingUser = await db.oneOrNone('SELECT * FROM users WHERE id = $1', userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }
    
        // Update user details
        const updatedUser = await db.one(
            'UPDATE users SET firstname = $1, lastname = $2, email = $3, profile_img = $4, username = $5 WHERE id = $6 RETURNING *',
            [firstname, lastname, email, profile_img, username, userId]
        );
    
        res.status(200).json(updatedUser);
        } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
        }
    };


    // Function to delete a user
    const deleteUser = async (req, res) => {
        try {
        const userId = req.params.id;
    
        // Check if the user exists
        const existingUser = await db.oneOrNone('SELECT * FROM users WHERE id = $1', userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }
    
        // Delete the user
        await db.none('DELETE FROM users WHERE id = $1', userId);
    
        res.status(204).json(); // No content for successful deletion
        } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
        }
    };
  
  
  
  module.exports = { registerUser, login, getAllUsers, getUserById, updateUser, deleteUser };
  