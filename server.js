require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Task = require("./models/Task");
const User = require("./models/User");

const app = express();
const PORT = 4000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 TaskBoard API is running!");
});

// --- Task Routes ---
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
});

app.put("/api/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

app.delete("/api/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// --- User Routes ---
app.get("/api/user", async (req, res) => {
  let user = await User.findOne();
  if (!user) {
    user = new User({ name: "John Doe", email: "john@example.com" });
    await user.save();
  }
  res.json(user);
});

app.put("/api/user", async (req, res) => {
  let user = await User.findOne();
  if (!user) user = new User(req.body);
  else {
    user.name = req.body.name;
    user.email = req.body.email;
  }
  await user.save();
  res.json(user);
});

// Start server
app.listen(PORT, () => console.log(`🔊 Backend running on http://localhost:${PORT}`));
