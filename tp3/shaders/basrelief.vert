#version 300 es

precision mediump float;

// Attributes (from your geometry/mesh)
in vec3 position;
in vec3 normal;
in vec2 uv;

// Uniforms set by your application
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

// The depth map (LGray image) used for displacement
uniform sampler2D depthMap;

// Factor controlling how much to displace
uniform float scaleFactor;

// Pass UV to fragment shader
out vec2 vUv;

void main() {
    vUv = uv;

    // Sample the grayscale texture at this vertex's UV
    // (texture2D(...) or texture(...) in modern GLSL)
    float depthValue = texture(depthMap, uv).r;

    // Transform the normal into view space for correct direction 
    // (optional but commonly done to keep consistent with lighting).
    vec3 normalView = normalize((normalMatrix * vec4(normal, 0.0)).xyz);

    // Displace the position along the normal by depthValue * scaleFactor
    vec3 displacedPosition = position + normalView * depthValue * scaleFactor;

    // Final position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
