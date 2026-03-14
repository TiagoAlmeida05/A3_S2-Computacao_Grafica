import {CGFobject} from '../lib/CGF.js';
/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            // Front face (z = 0.5)
            -0.5, -0.5, 0.5,  // 0
            0.5, -0.5, 0.5,   // 1
            0.5, 0.5, 0.5,    // 2
            -0.5, 0.5, 0.5,   // 3

            // Back face (z = -0.5)
            0.5, -0.5, -0.5,  // 4
            -0.5, -0.5, -0.5, // 5
            -0.5, 0.5, -0.5,  // 6
            0.5, 0.5, -0.5,   // 7

            // Right face (x = 0.5)
            0.5, -0.5, -0.5,  // 8
            0.5, -0.5, 0.5,   // 9
            0.5, 0.5, 0.5,    // 10
            0.5, 0.5, -0.5,   // 11

            // Left face (x = -0.5)
            -0.5, -0.5, 0.5,  // 12
            -0.5, -0.5, -0.5, // 13
            -0.5, 0.5, -0.5,  // 14
            -0.5, 0.5, 0.5,   // 15

            // Top face (y = 0.5)
            -0.5, 0.5, 0.5,   // 16
            0.5, 0.5, 0.5,    // 17
            0.5, 0.5, -0.5,   // 18
            -0.5, 0.5, -0.5,  // 19

            // Bottom face (y = -0.5)
            -0.5, -0.5, -0.5, // 20
            0.5, -0.5, -0.5,  // 21
            0.5, -0.5, 0.5,   // 22
            -0.5, -0.5, 0.5   // 23
        ];

        this.indices = [
            // Front face
            0, 1, 2,
            0, 2, 3,
            2, 1, 0,
            3, 2, 0,

            // Back face
            5, 4, 7,
            5, 7, 6,
            4, 5, 6,
            4, 6, 7,

            // Right face
            9, 8, 11,
            9, 11, 10,
            8, 9, 10,
            8, 10, 11,

            // Left face
            13, 12, 15,
            13, 15, 14,
            12, 13, 14,
            12, 14, 15,

            // Top face
            17, 16, 19,
            17, 19, 18,
            16, 17, 18,
            16, 18, 19,

            // Bottom face
            21, 20, 23,
            21, 23, 22,
            20, 21, 22,
            20, 22, 23
        ];

        this.normals = [    
            // Front face
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            // Back face
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            // Right face
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            // Left face
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,

            // Top face
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,

            // Bottom face
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
        this.initNormalVizBuffers();
    }
}

