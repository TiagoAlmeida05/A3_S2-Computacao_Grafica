attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float uTime;
uniform vec2 uWindDirection;
uniform float uWindStrength;
uniform float uWindEnabled;
uniform float uBladeHeight;

varying vec3 vNormal;
varying float vBend;

void main() {
  vec3 position = aVertexPosition;

  float heightFactor = clamp(position.y / max(uBladeHeight, 0.0001), 0.0, 1.0);
  float anchoredBend = heightFactor * heightFactor;
  float gust = 0.55 + 0.45 * sin(uTime * 4.0 + aVertexPosition.y * 8.0);
  vec2 direction = length(uWindDirection) > 0.0001 ? normalize(uWindDirection) : vec2(1.0, 0.0);
  vec2 wind = direction * uWindStrength * uWindEnabled * anchoredBend * gust;

  position.x += wind.x;
  position.z += wind.y;

  gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);

  vNormal = normalize((uNMatrix * vec4(aVertexNormal, 0.0)).xyz);
  vBend = anchoredBend;
}
