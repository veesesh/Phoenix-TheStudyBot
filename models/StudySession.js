const mongoose = require("mongoose");
const { MONGO_URI } = require("../config.json");

mongoose.connect(MONGO_URI);

const studySessionSchema = new mongoose.Schema({
  userId: String, // Discord User ID
  userName: String,
  startTime: Date,
  originalStartTime: Date,
  endTime: Date, // (null if ongoing)
  totalDuration: Number, // (calculated when session ends)
  status: String, // "ongoing", "paused", or "completed"
  pausedDuration: Number, // default to 0
  duration: Number,
  record_time: Number,
  XP: {
    type: Number,
    default: 0,
  },
  Level: {
    type: Number,
    default: 0,
  },
  log: {
    type: Map,
    of: Number, // date string ("2025-04-17") -> duration in seconds
    default: {},
  },
});

const StudySession = mongoose.model("StudySession", studySessionSchema);
module.exports = StudySession;
