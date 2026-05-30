precision highp float;

varying vec3 vNormal;

void main() {
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    
    float intensity = max(dot(normalize(vNormal), lightDir), 0.0);
    
    vec3 color = vec3(0.2, 1.0, 0.2) * (0.4 + 0.6 * intensity);
    
    gl_FragColor = vec4(color, 1.0);
}