const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/register', upload.single('photo'), async (req, res) => {
  try {
    const { name, email, password, confirmPassword, mobile } = req.body;
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name, email, mobile, password: hashedPassword,
      photo: req.file ? req.file.path : ''
    });
    await user.save();
    res.json({ message: "Account Created" });
  } catch (err) {
    res.status(400).json({ error: "Email already exists or other error" });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    message: "Login successful",
    user: {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      photo: user.photo,
    }
  });
});

module.exports = router;
