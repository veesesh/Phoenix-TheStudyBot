const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the session"),
  async execute(interaction) {
    await interaction.reply("Paused!");
  },
};
