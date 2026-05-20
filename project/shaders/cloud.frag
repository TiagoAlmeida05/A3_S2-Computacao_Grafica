#ifdef GL_ES
precision highp float;
#endif

uniform float uTime;
uniform float uOpacity;
uniform float uPuffOpacity;
uniform float uPuffSeed;
uniform vec3 uSunDirection;
uniform vec3 uCloudColor;
uniform vec3 uShadowColor;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;

  for (int i = 0; i < 5; i++) {
    value += noise(p) * amp;
    p *= 2.05;
    amp *= 0.55;
  }

  return value;
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;

  float t = uTime * 0.005;
  float seedShift = uPuffSeed * 0.17;

  float largeNoise = fbm(uv * 2.0 + vec2(seedShift, seedShift * 1.3) + vec2(t, 0.0));
  float midNoise = fbm(uv * 4.8 + vec2(seedShift * 2.3, -seedShift) - vec2(t * 0.4, t * 0.2));
  float fineNoise = fbm(uv * 9.5 + vec2(seedShift * 4.1, seedShift * 1.9));

  vec2 skew = vec2(1.0 + largeNoise * 0.22, 0.8 + midNoise * 0.2);
  vec2 warp = vec2(midNoise * 0.16, largeNoise * -0.08);
  vec2 cloudUv = (uv + warp) * skew;
  float dist = length(cloudUv);

  float edgeNoise = largeNoise * 0.25 + midNoise * 0.2 + fineNoise * 0.08;
  float noisyDist = dist - edgeNoise * 0.32;
  float body = 1.0 - smoothstep(0.46, 0.82, noisyDist);

  float brokenEdge = smoothstep(0.2, 0.7, midNoise + fineNoise * 0.35);
  float edgeRegion = smoothstep(0.35, 0.9, noisyDist);
  body *= mix(1.0, brokenEdge, edgeRegion * 0.85);

  float bottomFlatten = smoothstep(-0.6, -0.15, uv.y);
  body *= bottomFlatten;

  float density = fbm(uv * 3.6 + vec2(seedShift, -seedShift * 1.2));
  float detail = fbm(uv * 7.4 + vec2(-seedShift * 0.6, seedShift * 1.5));

  float alpha = body;
  alpha *= mix(0.78, 1.12, density);
  alpha *= mix(0.9, 1.05, detail);
  alpha = clamp(alpha, 0.0, 1.0);

  alpha *= uOpacity * uPuffOpacity;

  if (alpha < 0.04) {
    discard;
  }

  float vertical = clamp(uv.y * 0.5 + 0.5, 0.0, 1.0);
  float sunAmount = clamp(uSunDirection.y * 0.5 + 0.5, 0.0, 1.0);

  float topLight = smoothstep(0.1, 0.95, vertical);
  float bottomShade = smoothstep(0.75, 0.1, vertical);
  float selfShadow = clamp((1.0 - density) * 0.35 + bottomShade * 0.5, 0.0, 0.85);

  float light = 0.5 + topLight * 0.42 + sunAmount * 0.18 - selfShadow;
  light = clamp(light, 0.0, 1.0);

  vec3 color = mix(uShadowColor, uCloudColor, light);

  float rim = smoothstep(0.35, 0.85, noisyDist) * smoothstep(0.2, 0.95, vertical);
  color += uCloudColor * rim * 0.12 * sunAmount;
  color = mix(color, uCloudColor * 1.06, topLight * 0.2);

  gl_FragColor = vec4(color, alpha);
}