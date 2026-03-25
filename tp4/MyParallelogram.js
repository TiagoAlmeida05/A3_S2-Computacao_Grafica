import {CGFobject} from '../lib/CGF.js';
/**
 * MyParallelogram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyParallelogram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            0, 0, 0,	//0
            2, 0, 0,	//1
            3, 1, 0,    //2
            1, 1, 0     //3
        ];

        //Clockwise reference of vertices (for opposite side)
        this.indices = [
            0, 3, 1,
            1, 3, 2
        ];

        this.normals = [
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw Parallelograms
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
        this.initNormalVizBuffers();
    }
}

