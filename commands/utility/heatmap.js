const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const StudySession = require("../../models/StudySession.js");
const renderHeatmap = require("../../utils/renderHeatmap.js");
const dayjs = require("dayjs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("heatmap")
    .setDescription("Shows your study heatmap (daily activity)"),

  async execute(interaction) {
    const userId = interaction.user.id;

    const user = await StudySession.findOne({ userId });
    if (!user || !user.log) {
      return interaction.reply("No study data found.");
    }

    const heatmapBuffer = renderHeatmap(user.log);

    const attachment = new AttachmentBuilder(heatmapBuffer, {
      name: "study-heatmap.png",
    });

    await interaction.reply({
      content: "📊 Here’s your GitHub-style study heatmap (last 30 days):",
      files: [attachment],
    });
  },
};
