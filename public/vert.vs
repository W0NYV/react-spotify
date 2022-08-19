#version 300 es
precision mediump float;

in vec3 aVertexPosition;

uniform mat4 mvpMatrix;

out float vTexIndex;

void main(void) {
    vTexIndex = float(gl_VertexID);
    gl_Position = mvpMatrix * vec4(aVertexPosition, 1.0);
    gl_PointSize = 150.0;
}