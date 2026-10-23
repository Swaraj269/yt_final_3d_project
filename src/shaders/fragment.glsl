precision mediump float;

in vec2 vUv;
uniform sampler2D uTexture;
out vec4 fragmentColor;

void main() {
    vec4 imageColor = texture(uTexture, vUv);

    // Apply a small exposure lift, then encode linear texture samples for display.
    imageColor.rgb = min(imageColor.rgb * 1.08, vec3(1.0));
    fragmentColor = linearToOutputTexel(imageColor);
}
