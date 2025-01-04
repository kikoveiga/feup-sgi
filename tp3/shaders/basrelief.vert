#ifdef GL_ES
precision mediump float;
#endif

// Do NOT redeclare position, normal, uv, normalMatrix, etc. here.

uniform sampler2D uSampler2;  // The depth texture
uniform float scaleFactor;    

// Varying to pass UV
varying vec2 vUv;

void main() {
    vUv = uv;
    float depthValue = texture2D(uSampler2, uv).r;
    vec3 normalView = normalize(normalMatrix * normal);
    vec3 displacedPosition = position + normalView * depthValue * scaleFactor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
