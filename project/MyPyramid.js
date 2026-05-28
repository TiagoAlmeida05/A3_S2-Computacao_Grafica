import { CGFobject } from "../lib/CGF.js";

export class MyPyramid extends CGFobject {
    /**
     * @param {CGFscene} scene - The WebGL scene context
     * @param {number} slices - Number of sides around the base
     * @param {number} stacks - Number of layers from base to tip
     */
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
        this.texCoords = [];

        const angleStep = (2 * Math.PI) / this.slices;

        for (let q = 0; q <= this.stacks; q++) {
            const height = q / this.stacks;          
            const radius = 1.0 - (q / this.stacks);  

            for (let i = 0; i <= this.slices; i++) {
                const angle = i * angleStep;
                const cosA = Math.cos(angle);
                const sinA = Math.sin(angle);

                const x = cosA * radius;
                const z = sinA * radius;
                const y = height;
                this.vertices.push(x, y, z);

                const slopeNormalY = radius; 
                this.normals.push(cosA, slopeNormalY, sinA);

                this.texCoords.push(i / this.slices, 1.0 - height);
            }
        }

        for (let q = 0; q < this.stacks; q++) {
            const currentStackOffset = q * (this.slices + 1);
            const nextStackOffset = (q + 1) * (this.slices + 1);

            for (let i = 0; i < this.slices; i++) {
                const currentVertex = currentStackOffset + i;
                const nextVertex = currentVertex + 1;
                const currentStackTopVertex = nextStackOffset + i;
                const nextStackTopVertex = currentStackTopVertex + 1;

                this.indices.push(currentVertex, nextVertex, currentStackTopVertex);
                this.indices.push(nextVertex, nextStackTopVertex, currentStackTopVertex);
            }
        }

        const baseCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, -1, 0); 
        this.texCoords.push(0.5, 0.5);

        const baseOffset = 0;
        for (let i = 0; i < this.slices; i++) {
            const currentVertex = baseOffset + i;
            const nextVertex = currentVertex + 1;

            this.indices.push(baseCenterIndex, nextVertex, currentVertex);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}