#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uSampler1; 
varying vec2 vUv;

void main() {

    vec4 color = texture2D(uSampler1, vUv);
    gl_FragColor = color;
}
