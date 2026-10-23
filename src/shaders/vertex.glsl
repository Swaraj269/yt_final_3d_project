precision highp float;
out vec2 vUv;
uniform float uScrollSpeed;

void main(){
    vec3 pos = position;

    float normalizeY = pos.y * 2.0;
    float curveFactor = 1.0 - normalizeY * normalizeY;

    pos.x += uScrollSpeed * curveFactor * 0.2;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    vUv = uv;
}
