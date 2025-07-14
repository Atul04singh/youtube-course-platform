const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  serial: Number,
  title: String,
  videoId: String,
  url: String,
});

const courseSchema = new mongoose.Schema({
  title: String,
  playlistId: String,
  playlistUrl: String,
  videos: {
    type: [videoSchema],
    default: [],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  instructor: String,
  image: String, // e.g., /logo1.png
  duration: String,
  schedule: String,
  videoHours: String,
  certificate: Boolean,
  curriculum: [
    {
      module: String,
      topics: [String],
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);
