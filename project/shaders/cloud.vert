attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vUv;

void main() {
  vUv = aVertexPosition.xy + vec2(0.5, 0.5);
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
