attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float uTime;

varying vec3 vNormal;

void main() {
    vNormal = (uNMatrix * vec4(aVertexNormal, 1.0)).xyz;

    vec3 offset = vec3(0.0, sin(uTime * 4.0) * 0.3, 0.0);
    
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}