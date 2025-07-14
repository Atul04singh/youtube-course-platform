const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: String,
  // ✅ Role field added
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  // ✅ Store enrolled course references
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
