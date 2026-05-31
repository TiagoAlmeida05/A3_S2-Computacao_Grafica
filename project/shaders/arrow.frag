precision highp float;

varying vec3 vNormal;
uniform vec3 uColor; 

void main() {
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    
    float intensity = max(dot(normalize(vNormal), lightDir), 0.0);
    
    vec3 finalColor = uColor * (0.4 + 0.6 * intensity);
    
    gl_FragColor = vec4(finalColor, 1.0);
}