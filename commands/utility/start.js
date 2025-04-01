const { SlashCommandBuilder } = require("discord.js");
const StudySession = require("../../models/StudySession.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start a new study session"),
  async execute(interaction) {
    const userId = interaction.user.id;

    // Check if user already has an active session
    const activeSession = await StudySession.findOne({
      userId,
      status: "ongoing",
    });
    if (activeSession) {
      return interaction.reply(
        "⚠️ You already have an active study session! Use `/end` to finish it."
      );
    }

    // Create a new study session
    const newSession = new StudySession({
      userId,
      startTime: new Date(),
      status: "ongoing",
    });

    await newSession.save();
    console.log(newSession);

    await interaction.reply(
      "✅ Study session started! Use `/end` when you're done."
    );
  },
};
