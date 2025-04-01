const mongoose = require("mongoose");
const { MONGO_URI } = require("../config.json");

mongoose.connect(MONGO_URI);

const studySessionSchema = new mongoose.Schema({
  userId: String, // Discord User ID
  startTime: Date, // When the session started
  endTime: Date, // When the session ended (null if ongoing)
  duration: Number, // Total time in minutes (calculated when session ends)
  status: String, // "ongoing", "paused", or "completed"
});

const StudySession = mongoose.model("StudySession", studySessionSchema);
module.exports = StudySession;
