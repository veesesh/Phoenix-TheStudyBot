const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cancel")
    .setDescription("Cancels the session."),
  async execute(interaction) {
    await interaction.reply("cancelled!");
  },
};
