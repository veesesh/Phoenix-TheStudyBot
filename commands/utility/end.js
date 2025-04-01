const { SlashCommandBuilder } = require("discord.js");
const StudySession = require("../../models/StudySession.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("end")
    .setDescription("Ends and logs the session"),
  async execute(interaction) {
    const userId = interaction.user.id;

    const session = await StudySession.findOne({
      userId,
      status: "ongoing",
    });

    if (!session) {
      return await interaction.reply(
        "❌ You don’t have an active study session."
      );
    }

    const endTime = new Date();
    const duration = (endTime - session.startTime) / 1000;

    session.endTime = endTime;
    session.duration = duration; // Store the total time in seconds
    session.status = "completed";

    const something = await session.save();
    console.log(something);
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    const formattedTime = `${hours}h ${minutes}m ${seconds}s`;

    await interaction.reply(formattedTime);
  },
};
