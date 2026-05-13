import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangleSmall
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangleSmall extends CGFobject {
<<<<<<< HEAD
    constructor(scene) {
        super(scene);
=======
    constructor(scene, texCoords = null) {
        super(scene);
        this.texCoords = texCoords || [
            0.25, 0.75,
            0.75, 0.75,
            0.5, 0.5
        ];
>>>>>>> main
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
<<<<<<< HEAD
            -1, 0, 0,
=======
            -1, 0, 0, 
>>>>>>> main
            1, 0, 0,
            0, 1, 0
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
        //will be read in groups of three to draw TriangleSmalls
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
<<<<<<< HEAD
=======
        this.initNormalVizBuffers();
>>>>>>> main
    }
}

