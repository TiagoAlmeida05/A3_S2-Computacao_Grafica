#ifdef GL_ES
precision highp float;
#endif

varying vec4 transformedPosition;

void main() {

    if (transformedPosition.y > 0.5)
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
    else
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
}
