const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const pallets = require("nice-color-palettes");

const settings = {
  // dimensions: 'A4',
  units: "px",
  dimensions: [2048, 2048]
};

const sketch = () => {
  const palette = random.shuffle(random.pick(pallets));
  const circleColor = "#fee";
  const count = 8;

  const createGrid = (count = 10, margin) => {
    const points = [];
    const radius = 0.03;

    for (let x = 0; x < count - 1; x++) {
      for (let y = 0; y < count - 1; y++) {
        const u = x / (count - 1) + margin / 2;
        const v = y / (count - 1) + margin / 2;
        const corner = random.pick([ 0, 0.5, 1, 1.5, 2]);
        const arcStart = corner * Math.PI;
        const arcEnd = arcStart + corner * Math.PI;

        points.push({
          radius,
          position: [u, v],
          color: circleColor,
          arcStart,
          arcEnd
        });
      }
    }
    return points;
  };

  // random.setSeed('xxs')
  const relativeMargin = 0.12;
  const points = createGrid(count, relativeMargin);

  return ({ context, width, height }) => {
    const margin = width * relativeMargin;
    const spacing = width * 0.027;
    const radius = (width - 2 * margin - (count - 1) * spacing) / (count * 2);
    context.fillStyle = "#449689";
    context.fillStyle = "#2A405D";
    
    context.fillRect(0, 0, width, height);

    const rotations = [
      0,
      0.5 * Math.PI,
      1 * Math.PI,
      1.5 * Math.PI,
      2 * Math.PI
    ];

    points.forEach((data, idx) => {
      const {
        color,
        position: [u, v],
        arcStart, arcEnd,
      } = data;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      // idx === 0 && console.log(x, y);

      context.beginPath();
      context.arc(x, y, radius, arcStart, arcEnd, false);
      context.fillStyle = color;
      context.lineTo(x, y);
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
