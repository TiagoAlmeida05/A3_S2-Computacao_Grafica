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
            -1, 1, -2,	//0
            -1, -1, -2,	//1
            1, 1, -2,	//2
            1, -1, -2,	//3
            -1, 1, 0,	//4
            -1, -1, 0,	//5
            1, 1, 0,	//6
            1, -1, 0,	//7
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
            1, 3, 2,
            4, 6, 5,
            5, 6, 7,
            6, 2, 7,
            3, 7, 2,
            4, 0, 6,
            2, 6, 0,
            5, 1, 4,
            0, 4, 1,
            7, 3, 5,
            1, 5, 3
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

