/**
 * Created by toko on 13.05.17.
 */

/**
 *
 * Define a wire frame cube with methods for drawing it.
 *
 * @param gl
 * @returns object with draw method
 * @constructor
 */
function Cube(gl) {
    function defineVertices(gl) {
        // define the vertices of the cube
        let vertices = [
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, 0.5, -0.5,
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5
        ];
        let buffer  = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        buffer.bufferLength = vertices.length;
        return buffer;
    }


    function defineIndices(gl) {
        // define the edges for the cube, there are 12 triangles for a cube
        let vertexIndices = [
            // Bottom faces
            0, 2, 1,
            1, 2, 3,
            // Top faces
            4, 5, 6,
            5, 7, 6,
            // Side face 1
            0, 1, 5,
            0, 5, 4,
            // Side face 2 (opposite of 1)
            2, 7, 3,
            2, 6, 7,
            // Side face 3
            1, 3, 7,
            1, 7, 5,
            // Side face 4 (opposite of 3)
            0, 6, 2,
            0, 4, 6
        ];
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
        buffer.bufferLength = vertexIndices.length;
        return buffer;
    }

    function defineColors(gl) {
        // define the colors of the vertices
        let colors = [
            0, 0, 0, 1,
            0, 0, 1, 1,
            0, 1, 0, 1,
            0, 1, 1, 1,
            1, 0, 0, 1,
            1, 0, 1, 1,
            1, 1, 0, 1,
            1, 1, 1, 1,
        ];
        let buffer  = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        buffer.bufferLength = colors.length;
        return buffer;
    }

    return {
        bufferVertices: defineVertices(gl),
        bufferIndices: defineIndices(gl),
        bufferColors: defineColors(gl),

        draw: function(gl, webglContext, transformationMatrix) {
            // Set vertex buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(webglContext.aVertexPositionId, 3, gl.FLOAT, false, 12, 0);
            gl.enableVertexAttribArray(webglContext.aVertexPositionId);

            // Set indices buffer
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferIndices);

            // Set color
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferColors);
            gl.vertexAttribPointer(webglContext.aVertexColorId, 4, gl.FLOAT, false, 16, 0);
            gl.enableVertexAttribArray(webglContext.aVertexColorId);

            //gl.vertexAttrib4fv(webglContext.aVertexColorId, [0, 255, 0, 1]);

            // Set transformation matrix
            gl.uniformMatrix4fv(webglContext.uModelTransformMatId, false, transformationMatrix);

            // Draw
            gl.drawElements(gl.TRIANGLES, this.bufferIndices.bufferLength, gl.UNSIGNED_SHORT, 0);
        }
    }
}



