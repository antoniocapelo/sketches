const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  context: 'webgl',
  dimensions: [600, 600],
  animate: true,
  // fps: 24,
  // // Set loop duration to 3
  // duration: 3,
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
  #define PI 3.1415926538

  float variation(vec2 v1, vec2 v2, float strength, float speed, float radius) {
    return sin(dot(normalize(v1), normalize(v2)) * strength + time * speed) / 40. / radius / 10.;
  }

  vec3 paintCircle (vec2 uv, vec2 center, float rad, vec3 circleColor) {
        vec2 diff = center-uv;
        diff.x *= aspect;
        float len = length(diff);
        float strength = rad * 10.;
        float speed = 2.0;

        len += variation(diff, vec2(0.1, 1.0), strength, speed, rad);
        len -= variation(diff, vec2(-1.0, 0.3), strength, speed, rad);
        
        vec3 bgColor = hsl2rgb(240./360.0, 0.09, 0.20);
        float circle = smoothstep(rad, rad + 0.0075, len);

        return vec3(mix(circleColor, bgColor, circle));
    }

  void main () {
    vec2 center = vec2(0.5);

    // float dist = length(center);

    // float alpha = smoothstep(0.25, 0.2475, dist);
    float alpha = 1.;

    float n = noise(vec3(center-vUv * 2.0, time * PI * 0.25));

    vec3 color1 = hsl2rgb(12./360.0, 1., 0.59 - cos(n) * 0.2);
    vec3 color2 = hsl2rgb(240./360.0, 0.09, 0.20);
    // vec3 color2 = hsl2rgb(240./360.0, 0.02, 0.520);

    vec3 newColor = paintCircle(vUv, center, 0.20, mix(color1, color2, cos(time * PI + n*1.4)));

    gl_FragColor = vec4(newColor, alpha);
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
