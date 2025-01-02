// Fragment Shader: pulse.frag

uniform vec3 u_color; // Base color of the object

void main() {
    // Output the base color
    gl_FragColor = vec4(u_color, 1.0); // RGBA color
}
