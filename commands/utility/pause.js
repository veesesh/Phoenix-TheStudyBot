const { SlashCommandBuilder } = require("discord.js");
const StudySession = require("../../models/StudySession.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the session"),
  async execute(interaction) {
    const userId = interaction.user.id;
    const query = {
      userId,
      status: "ongoing",
    };
    const options = {
      startTime: 1,
      pausedDuration: 1,
      sort: { record_time: -1 },
    };
    const session = await StudySession.findOne(query, options);

    if (!session) {
      return await interaction.reply(
        "❌ You don’t have an active study session."
      );
    }
    const now = new Date();
    const timeSpent = (now - session.startTime) / 1000;

    session.pausedDuration += timeSpent;
    // console.log(session);

    session.startTime = null;
    session.status = "paused";
    session.record_time = new Date().getTime();

    await session.save();
    const hours = Math.floor(timeSpent / 3600);
    const minutes = Math.floor((timeSpent % 3600) / 60);
    const seconds = Math.floor(timeSpent % 60);

    await interaction.reply(
      `⏸️ Study session paused! You studied for **${hours}h ${minutes}m ${seconds}s** so far.`
    );
  },
};
