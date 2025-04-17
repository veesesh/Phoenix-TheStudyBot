const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const StudySession = require("../../models/StudySession.js");
const dayjs = require("dayjs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("heatmap")
    .setDescription("Shows your study heatmap (daily activity)"),

  async execute(interaction) {
    const userId = interaction.user.id;

    const result = await StudySession.aggregate([
      {
        $match: {
          userId,
          status: "ended",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $toDate: "$record_time" },
            },
          },
          totalDuration: { $sum: "$totalDuration" },
        },
      },
    ]);

    const dailyMap = {};
    for (const item of result) {
      dailyMap[item._id] = item.totalDuration;
    }

    const labels = [];
    const values = [];
    for (let i = 29; i >= 0; i--) {
      const date = dayjs().subtract(i, "day").format("YYYY-MM-DD");
      labels.push(date);
      values.push((dailyMap[date] || 0) / 3600); // keep as float (hours)
    }

    const canvas = new ChartJSNodeCanvas({ width: 800, height: 400 });

    const buffer = await canvas.renderToBuffer({
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Study Time (hours)",
            data: values,
            backgroundColor: "rgba(75,192,192,0.6)",
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 0.1,
              callback: function (value) {
                return value + "h";
              },
            },
          },
          x: {
            ticks: {
              maxTicksLimit: 15,
              autoSkip: true,
            },
          },
        },
      },
    });

    const attachment = new AttachmentBuilder(buffer, {
      name: "study-heatmap.png",
    });

    await interaction.reply({
      content: "📊 Here’s your study heatmap (last 30 days):",
      files: [attachment],
    });
  },
};
