#version 300 es
precision mediump float;
precision mediump sampler2DArray;

in float vTexIndex;

uniform sampler2DArray textureArray;

out vec4 fragColor;

void main(void) {

    vec4 smpColor = texture(textureArray, vec3(gl_PointCoord, vTexIndex));

    // fragColor = vec4(1.0, 0.0, 0.4, 1.0);
    fragColor = smpColor;
}