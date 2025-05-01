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
      //pausedDuration: 1,
      totalDuration: 1,
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
    console.log({ x: timeSpent, y: session.totalDuration });

    session.totalDuration += timeSpent;
    console.log(session.totalDuration);

    //session.pausedDuration += timeSpent;
    // console.log(session);
    /*console.log({
      x: now,
      y: session.startTime,
      z: timeSpent,
      a: session.pausedDuration,
    });*/

    session.startTime = null; //starttime is the time it was resumed last time
    session.status = "paused";
    session.record_time = new Date().getTime();
    session.endTime = null;
    session.record_time = now;

    //session.originalStartTime = session.originalStartTime;

    await session.save();
    const hours = Math.floor(session.totalDuration / 3600);
    const minutes = Math.floor((session.totalDuration % 3600) / 60);
    const seconds = Math.floor(session.totalDuration % 60);

    await interaction.reply(
      `⏸️ Study session paused! You studied for **${hours}h ${minutes}m ${seconds}s** so far.`
    );
  },
};
