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
    const totalTime = (now - session.startTime) / 1000; // fine until there is no pause

    console.log({
      now: now,
      x: session.startTime,
      totalTime: totalTime,
      v: session,
    });

    /* if (session.pausedDuration) {
      totalTime = totalTime - session.pausedDuration;
    }
     if (session.status === "paused" && session.startTime) {
      totalTime -= (now - session.startTime) / 1000;
    } */
    const h = Math.floor(totalTime / 3600);
    const m = Math.floor((totalTime % 3600) / 60);
    const s = Math.floor(totalTime % 60);
    await interaction.reply(`Time studied so far: **${h}h ${m}m ${s}s*`);
  },
};
