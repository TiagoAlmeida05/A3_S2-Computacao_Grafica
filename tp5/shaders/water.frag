#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float timeFactor;

void main() {
	vec2 baseUV = vTextureCoord + vec2(0.0, timeFactor * 0.005);
	vec4 color = texture2D(uSampler, baseUV);
	gl_FragColor = color;
}
