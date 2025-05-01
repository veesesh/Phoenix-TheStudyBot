const { SlashCommandBuilder } = require("discord.js");
const StudySession = require("../../models/StudySession.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start a new study session"),
  async execute(interaction) {
    const userId = interaction.user.id;

    // Check active session
    const query = {
      userId,
      status: { $in: ["ongoing", "paused"] },
    };
    const options = {
      sort: { record_time: -1 },
      projection: { startTime: 1 },
    };
    const activeSession = await StudySession.findOne(query, options);
    if (activeSession) {
      return interaction.reply(
        "⚠️ You already have an active study session! Use `/end` to finish it."
      );
    }
    await StudySession.updateOne(
      { userId },
      {
        $set: {
          userId,
          status: "ongoing",
          originalStartTime: new Date(),
          startTime: new Date(),
          totalDuration: 0,
          endTime: null,
          // pausedDuration: 0,
          record_time: new Date().getTime(),
        },
      },
      {
        upsert: true,
      }
    );

    // new session
    //const newSession = new StudySession({
    //  userId,
    //  startTime: new Date(),
    //  originalStartTime: new Date(),
    //  pausedDuration: 0,
    //  status: "ongoing",
    //  record_time: new Date().getTime(),
    //  totalDuration: 0,
    //});

    // await newSession.save();
    await interaction.reply(
      "✅ Study session started! Use `/end` when you're done."
    );
  },
};
