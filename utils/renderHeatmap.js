const { createCanvas } = require("canvas");
const dayjs = require("dayjs");

function getColor(seconds) {
  const hours = seconds / 3600;

  if (hours === 0) return "#ebedf0";
  if (hours < 1) return "#c6e48b";
  if (hours < 2) return "#7bc96f";
  if (hours < 4) return "#239a3b";
  return "#196127";
}

module.exports = function renderHeatmap(log) {
  const width = 400;
  const height = 150;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const start = dayjs().subtract(29, "day");
  const daySize = 15;
  const padding = 4;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 30; i++) {
    const date = start.add(i, "day").format("YYYY-MM-DD");
    const seconds = log.get(date) || 0;

    const x = (i % 15) * (daySize + padding);
    const y = Math.floor(i / 15) * (daySize + padding);

    ctx.fillStyle = getColor(seconds);
    ctx.fillRect(x, y, daySize, daySize);
  }

  return canvas.toBuffer("image/png");
};
