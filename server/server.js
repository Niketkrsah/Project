const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();

// === Middleware ===
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === Multer Setup for File Upload ===
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// === MongoDB Connect ===
mongoose.connect('mongodb://localhost:27017/loginApp', {
  useNewUrlParser: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// === Mongoose Schema ===
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  mobile: String,
  photo: String
});
const User = mongoose.model("User", UserSchema);

// === Routes ===

// ✅ Test route to check mobile access
app.get('/api/test', (req, res) => {
  res.send('✅ Backend is reachable from mobile!');
});

// Register Route
app.post('/register', upload.single('photo'), async (req, res) => {
  const { name, email, password, mobile } = req.body;
  const photo = req.file?.filename || 'default.png';

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ name, email, password, mobile, photo });
    await newUser.save();
    res.status(200).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

// Reset Password Route
app.post("/reset-password", async (req, res) => {
  const { name, email, mobile, newPassword } = req.body;

  try {
    const user = await User.findOne({ name, email, mobile });
    if (!user) return res.status(404).send("User not found");

    user.password = newPassword; // In production, hash this!
    await user.save();

    res.send("Password updated");
  } catch (err) {
    res.status(500).send("Error updating password");
  }
});


// ✅ Start Server (port 5000 and host 0.0.0.0)
app.listen(5000, '0.0.0.0', () => {
  console.log('✅ Server running on http://0.0.0.0:5000');
});
