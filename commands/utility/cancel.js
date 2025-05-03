const { SlashCommandBuilder } = require("discord.js");
const StudySession = require("../../models/StudySession.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cancel")
    .setDescription("Cancels the session."),
  async execute(interaction) {
    const userId = interaction.user.id;

    const session = await StudySession.findOne({
      userId,
      status: { $in: ["ongoing", "paused"] },
    });
    if (!session) {
      return interaction.reply("❌ No active session found.");
    }

    session.status = "cancelled";
    session.startTime = null;
    session.totalDuration = 0;

    await session.save();

    await interaction.reply(
      "❌ Your study session has been cancelled and discarded."
    );
  },
};
