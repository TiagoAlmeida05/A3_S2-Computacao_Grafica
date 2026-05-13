import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangleBig
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangleBig extends CGFobject {
<<<<<<< HEAD
    constructor(scene) {
        super(scene);
=======
    constructor(scene, texCoords = null) {
        super(scene);
        this.texCoords = texCoords || [
            0, 0,
            1, 0,
            0.5, 0.5
        ];
>>>>>>> main
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            -2, 0, 0,
            2, 0, 0,
            0, 2, 0
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2
        ];

<<<<<<< HEAD
=======
        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];

>>>>>>> main
        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw TriangleBigs
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
<<<<<<< HEAD
=======
        this.initNormalVizBuffers();
>>>>>>> main
    }
}

