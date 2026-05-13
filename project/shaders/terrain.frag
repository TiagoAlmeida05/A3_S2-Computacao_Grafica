#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying float vHeight;
varying vec3 vNormal;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float uBlendLow;
uniform float uBlendHigh;
uniform float uSeeHeightmap;
uniform vec3 uLightDir;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(uLightDir);
  float lambert = max(dot(normal, lightDir), 0.0);
  float lightFactor = 0.3 + 0.7 * lambert;

  if (uSeeHeightmap > 0.5) {
    vec3 low = vec3(0.0, 0.2, 0.7);
    vec3 mid = vec3(0.1, 0.7, 0.3);
    vec3 high = vec3(1.0);
    vec3 ramp = mix(low, mid, smoothstep(0.0, 0.6, vHeight));
    ramp = mix(ramp, high, smoothstep(0.6, 1.0, vHeight));
    gl_FragColor = vec4(ramp * lightFactor, 1.0);
  } else {
    vec4 grass = texture2D(uSampler, vTextureCoord);
    vec4 dirt = texture2D(uSampler2, vTextureCoord);
    float blend = smoothstep(uBlendLow, uBlendHigh, vHeight);
    vec4 base = mix(dirt, grass, blend);
    gl_FragColor = vec4(base.rgb * lightFactor, base.a);
  }
}
