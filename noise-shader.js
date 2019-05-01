const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  context: 'webgl',
  dimensions: [2048, 2048],
  animate: true
};

// Your glsl code
const frag = glsl(/* glsl */ `
  precision highp float;

  uniform float time;
  uniform float aspect;
  varying vec2 vUv;

  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');

  float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\
  }

  void main () {
    vec2 center = vUv - 0.5;
    center.x *= aspect;

    float dist = length(center);

    float alpha = smoothstep(0.25, 0.2475, dist);

    float n = noise(vec3(center * 2.0, 0.6 * sin(time)));

    vec3 color = hsl2rgb(122./360.0 - n * 0.2, 0.23, 0.75 + n * 0.23);

    float amount = 0.15;

    float diff = (rand(center) - 0.5) * amount;
    color.r += diff;
    color.g += diff;
    color.b += diff;
            
    gl_FragColor = vec4(color, alpha);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    clearColor: 'white',
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time,
      aspect: ({ width, height }) => width / height
    }
  });
};

canvasSketch(sketch, settings);
