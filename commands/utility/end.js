const { SlashCommandBuilder } = require("discord.js");
const StudySession = require("../../models/StudySession.js");
const dayjs = require("dayjs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("end")
    .setDescription("End and log your study session"),

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
    let totalDuration = (now - session.originalStartTime) / 1000;

    if (session.status === "paused" && session.startTime) {
      session.pausedDuration += (now - session.startTime) / 1000;
    }

    totalDuration -= session.pausedDuration || 0;

    const dateKey = dayjs().format("YYYY-MM-DD");

    // Update the existing session as ended
    session.status = "ended";
    session.endTime = now;
    session.totalDuration = totalDuration;
    session.record_time = now;

    await session.save();

    // Increment the user's log
    await StudySession.updateOne(
      { userId },
      { $inc: { [`log.${dateKey}`]: totalDuration } }
    );

    const h = Math.floor(totalDuration / 3600);
    const m = Math.floor((totalDuration % 3600) / 60);
    const s = Math.floor(totalDuration % 60);

    await interaction.reply(
      `⏹️ Session ended! Total time: **${h}h ${m}m ${s}s**`
    );
  },
};
