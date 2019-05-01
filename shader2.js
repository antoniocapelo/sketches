const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  context: 'webgl',
  dimensions: [2048, 2048],
  animate: true
};

const colorVariables = {
  darkGrey: "#2E2E38",
  lightGrey: "#828287",
  white: "#D8D8D8",
  orange: "#FF572E",
}

// Your glsl code
const frag = glsl(/* glsl */`
  precision highp float;

  uniform float time;
  uniform float aspect;
  varying vec2 vUv;

  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');

  void main () {
    // vec3 colorA = sin(time) + vec3(1., 0., 0.);
    // vec3 colorB = vec3(0., 0.5, 0.);

    vec2 center = vUv - 0.5;
    center.x *= aspect;

    float dist = length(center);

    float alpha = smoothstep(0.25, 0.2475, dist);

    float n = noise(vec3(center * 2.0, time * 0.25));

    vec3 color1 = hsl2rgb(12./360.0, 1., 0.59 - cos(1.0 - n) * 0.2);
    vec3 color2 = hsl2rgb(240./360.0, 0.09, 0.20);

    gl_FragColor = vec4(mix(color1, color2, cos(time + n*2.)), alpha);
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
