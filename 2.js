const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const geometry = require("canvas-sketch-util/geometry");
const pallets = require("nice-color-palettes");

const settings = {
  // dimensions: 'A4',
  // units: 'cm',
  dimensions: [2048, 2048]
};

const sketch = () => {
  const palette = random.shuffle(random.pick(pallets));
  // const mainColor = '#87AEB1'
  const mainColor = '#AAD0B0';
  const lineColor = '#EEEEEE';
  const titleColor = '#EEEEEE';

  const margin = 2;

  return ({ context, width, height }) => {
    context.fillStyle = mainColor;
    context.fillRect(0, 0, width, height);

    const margin = 200;
    const box = [[margin, margin], [width - margin, height - margin]];
    const lines = geometry.createHatchLines(box, 0, height * 0.023);

    lines.forEach((line, idx) => {
      context.beginPath();
      context.moveTo(margin, line[0][1]);
      context.lineTo(width - margin, line[1][1]);
      context.lineWidth = lerp(0.5, height * 0.0034, 1 - idx / lines.length);
      context.strokeStyle = lineColor
      context.closePath();
      context.stroke();
    });

      context.beginPath();
      context.arc(width/2, height/2, 0.3 * width, 0, Math.PI * 2, false);
      context.fillStyle = mainColor;
      context.fill();

      context.font = `bold ${width * 0.08}px "Arial"`;
      context.fillStyle = 'white'
      context.textAlign = 'center'
      context.fillText('Stereo Tipo', width / 2, height / 2);

      context.font = `${width * 0.06}px "Serif"`;
      context.fillStyle = titleColor
      context.textAlign = 'center'
      context.fillText('Lemongrass', width / 2, height / 2 + margin*3/4);

  };
};

canvasSketch(sketch, settings);
