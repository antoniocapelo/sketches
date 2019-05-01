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

function generateNoise(opacity = 0.2, size = 1, ctx, width, height) {
  let i, j,
  number;
  for ( x = 0; x < width / size; x++) {
     for ( y = 0; y < height / size; y++) {
       i = x * size;
       j = y * size;
        number = Math.floor( Math.random() * 60 );

        ctx.fillStyle = "rgba(" + number + "," + number + "," + number + "," + opacity + ")";
        ctx.fillRect(i, j, size, size);
     }
  }
}

const sketch = async () => {
  const mainColor = '#AAD0B0';
  const largeTitleColor = 'white';
  const lineColor = '#EEEEEE';
  const titleColor = 'white';

  const subtitleFontUrl = 'https://fonts.gstatic.com/s/tangerine/v10/Iurd6Y5j_oScZZow4VO5srNZi5FNym499g.woff2';
  const subtitleFont = new window.FontFace(
    'Tangerine-bold',
    `url(${subtitleFontUrl})`
  );
  const antonFontUrl = 'https://fonts.gstatic.com/s/anton/v10/1Ptgg87LROyAm3Kz-C8CSKlv.woff2';
  const antonFont = new window.FontFace(
    'Anton-regular',
    `url(${antonFontUrl})`
  );
  const fjallaFontUrl = 'https://fonts.gstatic.com/s/fjallaone/v6/Yq6R-LCAWCX3-6Ky7FAFrOF6kjouQb4.woff2';
  const fjallaFont = new window.FontFace(
    'Fjalla One',
    `url(${fjallaFontUrl})`
  );

  await subtitleFont.load();
  await antonFont.load();
  await fjallaFont.load();
  document.fonts.add(subtitleFont);
  document.fonts.add(antonFont);
  document.fonts.add(fjallaFont);


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

      context.font = `bold ${width * 0.09}px "Fjalla One"`;
      context.fillStyle = largeTitleColor;
      context.textAlign = 'center'
      context.fillText('Stereo Tipo', width / 2, height / 2);

      context.font = `${width * 0.08}px "Tangerine-bold"`;
      context.fillStyle = titleColor
      context.textAlign = 'center'
      context.fillText('Lemongrass', width / 2, height / 2 + margin*3/4);

      generateNoise(.09, 5, context, width, height); // default opacity is .2

  };
};

canvasSketch(sketch, settings);
