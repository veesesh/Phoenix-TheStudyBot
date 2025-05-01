const { SlashCommandBuilder } = require("discord.js");
const StudySession = require("../../models/StudySession.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("time")
    .setDescription("see how many hours have passed in the study session"),
  async execute(interaction) {
    const userId = interaction.user.id;
    const session = await StudySession.findOne({
      userId,
      status: { $in: ["ongoing", "paused"] },
    });
    if (!session) {
      return interaction.reply("❌ No active session found.");
    }

    const now = new Date();
    const totalTime = (now - session.startTime) / 1000;
    session.totalDuration = +totalTime;

    const h = Math.floor(session.totalDuration / 3600);
    const m = Math.floor((session.totalDuration % 3600) / 60);
    const s = Math.floor(session.totalDuration % 60);
    await interaction.reply(`Time studied so far: **${h}h ${m}m ${s}s*`);
  },
};
