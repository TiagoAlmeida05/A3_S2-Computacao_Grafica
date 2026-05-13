attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float uMaxHeight;

varying vec2 vTextureCoord;
varying float vHeight;
varying vec3 vNormal;

void main() {
  vec4 position = vec4(aVertexPosition, 1.0);
  gl_Position = uPMatrix * uMVMatrix * position;

  vTextureCoord = aTextureCoord;
  vHeight = clamp(position.y / max(uMaxHeight, 0.0001), 0.0, 1.0);
  vNormal = normalize((uNMatrix * vec4(aVertexNormal, 0.0)).xyz);
}
