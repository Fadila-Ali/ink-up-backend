DROP DATABASE IF EXISTS inkup;
CREATE DATABASE inkup;

\c inkup;

DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS users;
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    email TEXT UNIQUE NOT NULL,
    profile_img TEXT,
    username VARCHAR(30) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS user_sessions;
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_token TEXT UNIQUE NOT NULL,
    expiration_timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS notes;
CREATE TABLE notes(
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    note_content TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);