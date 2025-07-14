const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// ✅ GET: Admin Login Page
router.get("/admin/login", (req, res) => {
  res.render("admin/login");
});

// ✅ GET: Admin Registration Page
router.get("/admin/register", (req, res) => {
  res.render("admin/register");
});

// ✅ POST: Register a New Admin
router.post("/admin/register", async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.send("❌ Admin already exists with this email.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new User({
    name,
    email,
    password: hashedPassword,
    role: "admin", // ✅ Important
  });

  await admin.save();
  res.redirect("/admin/login");
});

// ✅ POST: Admin Login
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email, role: "admin" });
  if (!admin) return res.send("❌ No admin found with this email.");

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.send("❌ Invalid password.");

  // ✅ Set session and redirect to dashboard
  req.session.user = admin;
  res.redirect("/admin/dashboard");
});

// ✅ Admin Logout
router.get("/admin/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

module.exports = router;
