const db = require("../db/dbConfig");

// Create a new note for the authenticated user
const createNote = async (req, res) => {
    try {
        const { title, note_content } = req.body;
        const userId = req.user.userId; // Extract user ID from authenticated user
        console.log(`user ID: ${userId}`);
        const newNote = await db.one(
            "INSERT INTO notes (title, note_content, user_id) VALUES ($1, $2, $3) RETURNING *",
            [title, note_content, userId]
        );

        // res.status(201).json({
        //     userId: userId,
        //     title,
        //     note_content
        // });

        res.status(201).json(newNote);
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ error: "Failed to create note" });
    }
};

// Get all notes of the authenticated user
const getAllUserNotes = async (req, res) => {
    try {
        const userId = req.user.userId; // Extract user ID from authenticated user
        const userNotes = await db.any("SELECT * FROM notes WHERE user_id = $1", userId);
        res.status(200).json(userNotes);
    } catch (error) {
        console.error("Error fetching user notes:", error);
        res.status(500).json({ error: "Failed to fetch user notes" });
    }
};

// Get a specific note belonging to the authenticated user
const getUserNote = async (req, res) => {
    try {
        const userId = req.user.userId; // Extract user ID from authenticated user
        const { id } = req.params;
        const userNote = await db.one("SELECT * FROM notes WHERE id = $1 AND user_id = $2", [id, userId]);
        res.status(200).json(userNote);
    } catch (error) {
        console.error("Error fetching user note:", error);
        res.status(500).json({ error: "Failed to fetch user note" });
    }
};

// Update a specific note belonging to the authenticated user
const updateUserNote = async (req, res) => {
    try {
        const userId = req.user.userId; // Extract user ID from authenticated user
        const { id } = req.params;
        const { title, note_content } = req.body;
        const updatedNote = await db.one(
            "UPDATE notes SET title = $1, note_content = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
            [title, note_content, id, userId]
        );
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("Error updating user note:", error);
        res.status(500).json({ error: "Failed to update user note" });
    }
};

// Delete a specific note belonging to the authenticated user
const deleteUserNote = async (req, res) => {
    try {
        const userId = req.user.userId; // Extract user ID from authenticated user
        const { id } = req.params;
        await db.none("DELETE FROM notes WHERE id = $1 AND user_id = $2", [id, userId]);
        res.status(204).json(); // No content for successful deletion
    } catch (error) {
        console.error("Error deleting user note:", error);
        res.status(500).json({ error: "Failed to delete user note" });
    }
};

module.exports = { createNote, getAllUserNotes, getUserNote, updateUserNote, deleteUserNote };
