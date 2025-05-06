const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const StudySession = require("../../models/StudySession.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("compare")
    .setDescription(
      "Displays a leaderboard comparing all users' total study time and levels"
    ),
  async execute(interaction) {
    try {
      const allUsers = await StudySession.find({});

      if (!allUsers.length) {
        return interaction.reply("No user data found");
      }

      const leaderboardData = allUsers.map((user) => {
        const log = user.log;
        const totalSeconds = Array.from(log.values()).reduce(
          (s, m) => s + m,
          0
        );

        /* const totalMinutes =
          log instanceof Map
            ? Array.from(log.values()).reduce(
                (sum, minutes) => sum + minutes,
                0
              )
            : Object.values(log || {}).reduce(
                (sum, minutes) => sum + minutes,
                0
              );
              */

        //const totalHours = parseFloat((totalSeconds / 3600).toFixed(1));
        // const totalMinutes = parseFloat((totalSeconds / 60).toFixed(1));
        console.log({
          x: log,
          y: totalSeconds,
        });
        return {
          userName: user.userName,
          totalSeconds,
          //totalMinutes,
          //totalHours,
          level: user.Level,
          xp: user.XP,
        };
      });

      leaderboardData.sort((a, b) => {
        if (b.level !== a.level) return b.level - a.level;
        return b.totalSeconds - a.totalSeconds;
      });

      const leaderboardText = leaderboardData
        .map((user, index) => {
          const h = Math.floor(user.totalSeconds / 3600);
          const m = Math.floor((user.totalSeconds % 3600) / 60);
          const s = Math.floor(user.totalSeconds % 60);

          return `**${index + 1}.** ${
            user.userName
          } — ${h}h ${m}m ${s}s • Level ${user.level}`;
        })
        .join("\n");

      const embed = new EmbedBuilder()
        .setTitle("📊 Study Leaderboard")
        .setDescription(leaderboardText)
        .setColor(0x00ae86)
        .setFooter({ text: "Ranked by level and study hours" });

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      await interaction.reply(
        "An error occurred while generating the leaderboard."
      );
    }
  },
};
