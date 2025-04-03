const { SlashCommandBuilder } = require("discord.js");
const StudySession = require("../../models/StudySession.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("end")
    .setDescription("Ends and logs the session"),
  async execute(interaction) {
    const userId = interaction.user.id;

    const now = new Date();

    const query = {
      userId,
      status: "ongoing",
    };
    const options = {
      startTime: 1,
      endTime: 1,
      originalStartTime: 1,
      pausedDuration: 1,
      totalDuration: 1,
      sort: { record_time: -1 },
      // projection: { startTime: 1 },
    };

    const session = await StudySession.findOne(query, options);

    //console.log(session);
    if (!session) {
      return await interaction.reply(
        "❌ You don’t have an active study session."
      );
    }

    if (session.startTime && session.status === "paused") {
      session.pausedDuration =
        (session.pausedDuration || 0) + (now - session.startTime) / 1000;
    }

    console.log((now - session.startTime) / 1000);
    //console.log(session.pausedDuration);

    let totalDuration = (now - session.originalStartTime) / 1000;
    totalDuration -= session.pausedDuration || 0;
    // console.log(totalDuration);

    session.endTime = now;
    session.totalDuration = totalDuration;
    session.status = "ended";
    (session.record_time = new Date().getTime()),
      console.log({
        s: session.startTime,
        a: now,
        b: (now - session.startTime) / 1000,
        c: session.pausedDuration,
        d: totalDuration,
      });
    // console.log(session.record_time);

    await session.save();

    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    const seconds = Math.floor(totalDuration % 60);

    await interaction.reply(
      `⏹️ Study session ended! Total time: **${hours}h ${minutes}m ${seconds}s**`
    );
  },
};
