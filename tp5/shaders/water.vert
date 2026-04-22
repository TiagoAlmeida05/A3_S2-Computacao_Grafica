attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform sampler2D uSampler2;
uniform float normScale;
uniform float timeFactor;

varying vec2 vTextureCoord;

void main() {
	vec2 uvOffset = vec2(timeFactor * 0.008, sin(timeFactor * 0.08) * 0.02);
	vec2 animatedUV = aTextureCoord + uvOffset;
	vec2 mapCoord = vec2(0.0, 0.1) + animatedUV;
	float height = texture2D(uSampler2, mapCoord).b;
	vec3 displacedPosition = aVertexPosition + aVertexNormal * (height * normScale * 0.0025);

	gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);

	vTextureCoord = animatedUV;
}
