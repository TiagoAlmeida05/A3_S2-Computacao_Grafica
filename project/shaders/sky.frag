#ifdef GL_ES
precision highp float;
#endif

uniform float uTime;
uniform vec3 uSunDirection;

varying vec3 vDirection;

void main() {
  vec3 dir = normalize(vDirection);
  vec3 sunDir = normalize(uSunDirection);

  float h = clamp(dir.y, 0.0, 1.0);
  vec3 horizon = vec3(0.72, 0.86, 0.98);
  vec3 zenith = vec3(0.12, 0.38, 0.75);
  vec3 sky = mix(horizon, zenith, pow(h, 0.65));

  float haze = exp(-h * 6.0);
  vec3 hazeColor = vec3(0.85, 0.9, 0.98);
  sky = mix(sky, hazeColor, haze * 0.35);

  float sunDot = max(dot(dir, sunDir), 0.0);
  float sunDisk = smoothstep(0.9995, 1.0, sunDot);
  float sunGlow = pow(sunDot, 64.0) * 0.75 + pow(sunDot, 12.0) * 0.2;
  vec3 sunColor = vec3(1.0, 0.88, 0.62);
  sky += sunColor * sunGlow;
  sky = mix(sky, sunColor, sunDisk);

  gl_FragColor = vec4(clamp(sky, 0.0, 1.0), 1.0);
}
