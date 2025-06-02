const { createCanvas } = require("canvas");
const dayjs = require("dayjs");

function getColor(seconds) {
  const hours = seconds / 3600;

  if (hours === 0) return "#161b22";
  if (hours < 1) return "#0e4429";
  if (hours < 2) return "#006d32";
  if (hours < 4) return "#26a641";
  return "#39d353";
}

module.exports = function renderHeatmap(log) {
  const width = 288;
  const height = 157;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const start = dayjs().subtract(119, "day");
  const daySize = 15;
  const padding = 4;
  const leftpadding = 4;
  const toppadding = 4;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 120; i++) {
    const date = start.add(i, "day").format("YYYY-MM-DD");
    const seconds = log.get(date) || 0;

    const x = leftpadding + (i % 15) * (daySize + padding);
    const y = toppadding + Math.floor(i / 15) * (daySize + padding);

    ctx.fillStyle = getColor(seconds);
    ctx.fillRect(x, y, daySize, daySize);
  }

  return canvas.toBuffer("image/png");
};
