import { CGFobject } from '../lib/CGF.js';

export class MyPlane extends CGFobject {
    constructor(scene, size = 20, nDivs = 20) {
        super(scene);
        this.size = size;
        this.nDivs = nDivs;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const halfSize = this.size / 2;
        const step = this.size / this.nDivs;
        const texStep = 1 / this.nDivs;

        for (let row = 0; row <= this.nDivs; row++) {
            const z = halfSize - row * step;

            for (let column = 0; column <= this.nDivs; column++) {
                const x = -halfSize + column * step;

                this.vertices.push(x, 0, z);
                this.normals.push(0, 1, 0);
                this.texCoords.push(column * texStep, row * texStep);
            }
        }

        for (let row = 0; row < this.nDivs; row++) {
            for (let column = 0; column < this.nDivs; column++) {
                const topLeft = row * (this.nDivs + 1) + column;
                const bottomLeft = (row + 1) * (this.nDivs + 1) + column;

                this.indices.push(topLeft, topLeft + 1, bottomLeft);
                this.indices.push(topLeft + 1, bottomLeft + 1, bottomLeft);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}