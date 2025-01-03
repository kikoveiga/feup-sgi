#version 300 es

precision mediump float;

in vec3 position;
in vec3 normal;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

uniform sampler2D depthMap;

uniform float scaleFactor;

out vec2 vUv;

void main() {
    vUv = uv;

    float depthValue = texture(depthMap, uv).r;

    vec3 normalView = normalize((normalMatrix * vec4(normal, 0.0)).xyz);

    vec3 displacedPosition = position + normalView * depthValue * scaleFactor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
