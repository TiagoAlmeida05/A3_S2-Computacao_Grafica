import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangleSmall
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangleSmall extends CGFobject {
    constructor(scene, texCoords = null) {
        super(scene);
        this.texCoords = texCoords || [
            0.25, 0.75,
            0.75, 0.75,
            0.5, 0.5
        ];
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            -1, 0, 0, 
            1, 0, 0,
            0, 1, 0
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw TriangleSmalls
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
        this.initNormalVizBuffers();
    }
}

