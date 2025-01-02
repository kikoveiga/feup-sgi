// Vertex Shader: pulse.vert

uniform float u_time; // Current time in seconds
uniform float u_amplitude; // Amplitude of the pulsation
uniform float u_frequency; // Frequency of the pulsation

void main() {
    // Calculate pulsating scale using a sine wave
    float scale = 1.0 + u_amplitude * sin(u_time * u_frequency);

    // Apply scaling to the vertex position
    vec3 pulsatingPosition = position * scale;

    // Standard transformation to clip space
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pulsatingPosition, 1.0);
}
