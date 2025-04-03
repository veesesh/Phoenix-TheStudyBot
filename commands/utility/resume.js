const { SlashCommandBuilder } = require("discord.js");
const StudySession = require("../../models/StudySession.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes from pause"),

  async execute(interaction) {
    const userId = interaction.user.id;
    const query = {
      userId,
      status: "paused",
    };
    const options = {
      startTime: 1,
      sort: { record_time: -1 },
    };
    const session = await StudySession.findOne(query, options);
    if (!session) {
      return await interaction.reply("❌ You don’t have an paused session.");
    }

    session.startTime = new Date();
    session.status = "ongoing";

    await session.save();

    await interaction.reply(
      "▶️ Your study session has resumed! Keep going! 💪"
    );
  },
};
