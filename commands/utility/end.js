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
    let seconds = session.totalDuration;

    const dateKey = dayjs().format("YYYY-MM-DD");
    console.log(session);
    session.status = "ended";
    // session.startTime = new Date();
    session.endTime = now;
    console.log({
      x: now,
      y: session.startTime,
    });
    console.log(now - session.startTime);
    // session.totalDuration = session.totalDuration + (now - session.startTime);
    seconds += session.startTime ? now - session.startTime : 0;
    session.record_time = now;
    console.log(session);
    console.log(seconds);

    await session.save();

    // Increment the user's log
    await StudySession.updateOne(
      { userId },
      { $inc: { [`log.${dateKey}`]: seconds } }
    );

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    await interaction.reply(
      `⏹️ Session ended! Total time: **${h}h ${m}m ${s}s**`
    );
  },
};
