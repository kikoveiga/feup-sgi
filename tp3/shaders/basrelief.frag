#version 300 es

precision mediump float;

// The RGB texture for coloring
uniform sampler2D colorMap;

// Incoming UV from the vertex shader
in vec2 vUv;

// Output color
out vec4 fragColor;

void main() {
    // Sample the color texture (the “original” RGB image)
    vec4 color = texture(colorMap, vUv);

    // Final fragment color
    fragColor = color;
}
