varying vec2 vUv;
uniform float timeFactor;

void main() {
    vUv = uv;

    float pulse = abs(sin(timeFactor * 2.0))* 0.7 + 1.0; 
    vec3 scaledPosition = position * pulse;

    float rotationAngle = timeFactor;
    mat3 rotationMatrix = mat3(cos(rotationAngle), 0.0, sin(rotationAngle), 0.0, 1.0, 0.0, -sin(rotationAngle), 0.0, cos(rotationAngle));

    vec3 rotatedPosition = rotationMatrix * scaledPosition;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(rotatedPosition, 1.0);
}