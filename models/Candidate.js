
const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  experience: Number,
  skills: String,
  location: String,
  status: { type: String, default: "Not Connected" },
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Candidate", CandidateSchema);
