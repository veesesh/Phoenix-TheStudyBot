const { SlashCommandBuilder } = require("discord.js");
const StudySession = require("../../models/StudySession.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears your stats"),
  async execute(interaction) {
    const userId = interaction.user.id;

    const session = await StudySession.findOne({
      userId,
      status: { $in: ["ongoing", "paused", "ended"] },
    });

    if (!session) {
      return interaction.reply("There is no session(s) to clear");
    }

    session.XP = 0;
    session.Level = 0;
    session.log = {};
    session.status = "ended";
    //session.totalDuration = 0;
    //session.pausedDuration = 0;
    //session.duration = 0;
    session.startTime = null;
    session.endTime = null;
    session.originalStartTime = null;
    session.record_time = null;

    await session.save();
    await interaction.reply(`cleared`);
  },
};
