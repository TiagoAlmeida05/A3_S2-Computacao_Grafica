import {CGFobject} from '../lib/CGF.js';

/**
 * MyPrism
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of prism sides (inscribed in a unit-radius cylinder)
 * @param stacks - number of divisions along Z
 */
export class MyPrism extends CGFobject {
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
        let vertexIndex = 0;
        for (let i = 0; i < this.slices; i++) {
            const ang = i * alphaAng;
            const nextAng = (i + 1) * alphaAng;

            const x0 = Math.cos(ang);
            const y0 = Math.sin(ang);
            const x1 = Math.cos(nextAng);
            const y1 = Math.sin(nextAng);

            const ux = x1 - x0;
            const uy = y1 - y0;
            const uz = 0;

            const vx = 0;
            const vy = 0;
            const vz = 1;

            let nx = uy * vz - uz * vy;
            let ny = uz * vx - ux * vz;
            let nz = ux * vy - uy * vx;

            const nSize = Math.sqrt(nx * nx + ny * ny + nz * nz);
            nx /= nSize;
            ny /= nSize;
            nz /= nSize;

            for (let j = 0; j < this.stacks; j++) {
                const z0 = j * stackSize;
                const z1 = (j + 1) * stackSize;

                this.vertices.push(x0, y0, z0);
                this.vertices.push(x1, y1, z0);
                this.vertices.push(x0, y0, z1);
                this.vertices.push(x1, y1, z1);

                this.normals.push(nx, ny, nz);
                this.normals.push(nx, ny, nz);
                this.normals.push(nx, ny, nz);
                this.normals.push(nx, ny, nz);

                this.indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2);
                this.indices.push(vertexIndex + 2, vertexIndex + 1, vertexIndex);
                this.indices.push(vertexIndex + 2, vertexIndex + 1, vertexIndex + 3);
                this.indices.push(vertexIndex + 3, vertexIndex + 1, vertexIndex + 2);

                vertexIndex += 4;
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

