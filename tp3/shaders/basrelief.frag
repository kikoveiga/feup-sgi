#version 300 es

precision mediump float;

uniform sampler2D colorMap;

in vec2 vUv;

out vec4 fragColor;

void main() {
    vec4 color = texture(colorMap, vUv);
    fragColor = color;
}
