const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// GET Register Page
router.get("/register", (req, res) => {
  res.render("register");
});

// POST Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ name, email, password: hashedPassword });
    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("Email already exists or error occurred.");
  }
});

// GET Login Page
router.get("/" || "/login", (req, res) => {
  res.render("login");
});

// POST Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.send("User not found.");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.send("Invalid password.");

  req.session.user = user;
  res.redirect("/home");
});

// ✅ Logout Route
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Logout failed");
    }
    res.redirect("/"); // 🔁 Send back to login or homepage
  });
});

module.exports = router;
