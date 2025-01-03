varying vec2 vUv;
uniform float timeFactor;

void main() {
    vUv = uv;

    float pulse = abs(sin(timeFactor * 1.0)) * 0.1 + 1.0; 
    vec3 scaledPosition = vec3(position.x * pulse, position.y * pulse, position.z * pulse);

    float rotationAngle = timeFactor * 0.01;
    mat3 rotationMatrix = mat3(
        cos(rotationAngle), 0.0, sin(rotationAngle),
        0.0, 1.0, 0.0,
        -sin(rotationAngle), 0.0, cos(rotationAngle)
    );

    vec3 rotatedPosition = rotationMatrix * scaledPosition;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(rotatedPosition, 1.0);
}
