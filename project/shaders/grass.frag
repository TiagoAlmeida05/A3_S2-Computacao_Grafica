#ifdef GL_ES
precision highp float;
#endif

uniform vec3 uGrassColor;
uniform vec3 uLightDir;

varying vec3 vNormal;
varying float vBend;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(uLightDir);
  float lambert = max(dot(normal, lightDir), 0.0);
  float lightFactor = 0.35 + 0.65 * lambert;
  vec3 tipColor = uGrassColor * 1.12;
  vec3 rootColor = uGrassColor * 0.75;
  vec3 color = mix(rootColor, tipColor, vBend);

  gl_FragColor = vec4(color * lightFactor, 1.0);
}
