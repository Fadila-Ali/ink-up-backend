const express = require("express");
const notes = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");
const {
    getAllUserNotes,
    getUserNote,
    createUserNote,
    deleteUserNote,
    updateUserNote,
  } = require("../queries/notes");

// Apply the authMiddleware to all routes in the notes router to provide user info
notes.use(authMiddleware);

// Get all notes of the authenticated user
notes.get("/", async (req, res) => {
    try {
        const allNotes = await getAllUserNotes(req.user.id); // Access user ID from req.user
        res.status(200).json(allNotes);
    } catch (error) {
        console.error("Error retrieving user notes:", error);
        res.status(500).json({ error: "Failed to retrieve user notes" });
    }
});

// Get one note
notes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const note = await getUserNote(id, req.user.id);
    res.json(note);
  } catch (error) {
    console.error("Error retrieving user note:", error);
    res.status(500).json({ error: "Failed to retrieve user note" });
  }
});

// Create a note
notes.post("/", async (req, res) => {
  try {
    const note = await createUserNote(req.body, req.user.id);
    res.status(201).json(note);
  } catch (error) {
    console.error("Error creating user note:", error);
    res.status(400).json({ error: "Failed to create user note" });
  }
});

// Delete a note
notes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const note = await deleteUserNote(id, req.user.id);
    res.json(note);
  } catch (error) {
    console.error("Error deleting user note:", error);
    res.status(500).json({ error: "Failed to delete user note" });
  }
});

// Update a note
notes.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const note = await updateUserNote(id, req.body, req.user.id);
    res.json(note);
  } catch (error) {
    console.error("Error updating user note:", error);
    res.status(500).json({ error: "Failed to update user note" });
  }
});

module.exports = notes;
