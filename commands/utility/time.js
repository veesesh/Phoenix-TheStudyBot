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

    let totalseconds;
    if (session.status === "paused") {
      totalseconds = session.totalDuration || 0;
      // no change in total duration
    } else if (session.status === "ongoing") {
      const now = new Date();

      console.log({
        z: session.startTime,
        x: (now - session.startTime) / 1000,
        y: session.totalDuration,
      });
      const totalTime = (now - session.startTime) / 1000;
      totalseconds = (session.totalDuration || 0) + totalTime;
      console.log({
        z: session.startTime,
        x: totalTime,
        y: session.totalDuration,
      });
    }

    const h = Math.floor(totalseconds / 3600);
    const m = Math.floor((totalseconds % 3600) / 60);
    const s = Math.floor(totalseconds % 60);
    await interaction.reply(`Time studied so far: **${h}h ${m}m ${s}s**`);
  },
};
