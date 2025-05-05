const { SlashCommandBuilder } = require("discord.js");
const StudySession = require("../../models/StudySession.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Gives you description of Experience Points and Levels"),
  async execute(interaction) {
    const userId = interaction.user.id;

    const session = await StudySession.findOne({
      userId,
      status: { $in: ["ended"] },
    });

    if (!session) {
      return interaction.reply(
        "There is no Ended Sessions yet, 1st End the session then Use this command"
      );
    }
    const xp = session.XP || 0;
    const level = session.Level || 0;

    await interaction.reply(
      `📘 **Your Study Stats**:\n🔸 Level: **${level}**\n🔹 XP: **${xp}** X`
    );
  },
};
