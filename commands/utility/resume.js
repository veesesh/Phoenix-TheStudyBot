const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes from pause"),
  async execute(interaction) {
    await interaction.reply("Resumed!");
  },
};
