attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
varying vec4 vColor;

uniform mat4 uProjectionMat;
uniform mat4 uModelViewMat;
uniform mat4 uModelTransformMat;

void main() {
    vColor = aVertexColor;
    vec4 vertexPos = vec4(aVertexPosition, 1);
    vec4 transformed = uProjectionMat * uModelViewMat * uModelTransformMat * vertexPos;
    gl_Position = transformed;
}