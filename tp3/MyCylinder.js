import {CGFobject} from '../lib/CGF.js';

/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of Cylinder sides (inscribed in a unit-radius cylinder)
 * @param stacks - number of divisions along Z
 */
export class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);

        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        const alphaAng = 2 * Math.PI / this.slices;
        const stackSize = 1 / this.stacks;

        for (let j = 0; j <= this.stacks; j++) {
            const z = j * stackSize;
            for (let i = 0; i < this.slices; i++) {
                const ang = i * alphaAng;
                const x = Math.cos(ang);
                const y = Math.sin(ang);

                const nLen = Math.hypot(x, y);
                this.vertices.push(x, y, z);
                this.normals.push(x / nLen, y / nLen, 0);
            }
        }

        for (let j = 0; j < this.stacks; j++) {
            for (let i = 0; i < this.slices; i++) {
                const nextI = (i + 1) % this.slices;
                const v0 = j * this.slices + i;
                const v1 = j * this.slices + nextI;
                const v2 = (j + 1) * this.slices + i;
                const v3 = (j + 1) * this.slices + nextI;

                this.indices.push(v0, v1, v2);
                this.indices.push(v2, v1, v3);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
        this.initNormalVizBuffers();
    }

    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity); // 3..12
        this.stacks = 1 + Math.round(8 * complexity); // 1..9

        this.initBuffers();
        this.initNormalVizBuffers();
    }

    updateSlicesStacks(slices, stacks) {
        this.slices = Math.max(3, Math.round(slices));
        this.stacks = Math.max(1, Math.round(stacks));

        this.initBuffers();
        this.initNormalVizBuffers();
    }
}

