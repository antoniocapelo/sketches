const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const pallets = require("nice-color-palettes");

const settings = {
  dimensions: 'A4',
  units: 'cm',
  // dimensions: [2048, 2048]
};

const sketch = () => {
  const palette = random.shuffle(random.pick(pallets));

  const createGrid = () => {
    const points = [];
    const count = 50;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count -1);
        const radius = Math.abs(random.noise2D(u, v)) * 0.22;
        points.push({
          radius,
          rotation: Math.abs(random.noise2D(u, v)) * Math.PI,
          position: [u, v],
          color: random.pick(palette),
        });
      }
    }
    return points;
  };

  // random.setSeed('xxs')
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 2;
  
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    points.forEach((data) => {
      const {
        position: [u, v],
        radius,
        rotation,
        color
      } = data;
      const x = lerp(margin,width - margin, u);
      const y = lerp(margin,height - margin, v);
      

      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px "Helvetica"`;
      context.translate(x,y);
      context.rotate(rotation);
      context.fillText(u > 0.4 && u < 0.6 ? '-' : '.', 0, 0);
      context.restore();
    })
  };
};

canvasSketch(sketch, settings);
