import {CGFobject} from '../lib/CGF.js';

export class MySphere extends CGFobject {
    constructor(scene, radius, slices, stacks, inside = false, half = false, texScaleS = 1, texScaleT = 1) {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;
        this.inside = inside;
        this.half = half;
        this.texScaleS = texScaleS;
        this.texScaleT = texScaleT;
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let x, y, z;
        let nx, ny, nz;
        const lengthInv = 1.0 / this.radius;
        const sectorStep = 2 * Math.PI / this.slices;
        const stackStep = (this.half ? Math.PI / 2 : Math.PI) / this.stacks;

        for (let i = 0; i <= this.stacks; ++i) {
            const stackAngle = Math.PI / 2 - i * stackStep;
            const xz = this.radius * Math.cos(stackAngle);
            y = this.radius * Math.sin(stackAngle);

            for (let j = 0; j <= this.slices; ++j) {
                const sectorAngle = j * sectorStep;
                x = xz * Math.cos(sectorAngle);
                z = xz * Math.sin(sectorAngle);
                this.vertices.push(x, y, z);

                nx = x * lengthInv;
                ny = y * lengthInv;
                nz = z * lengthInv;
                this.normals.push(
                    this.inside ? -nx : nx,
                    this.inside ? -ny : ny,
                    this.inside ? -nz : nz
                );

                this.texCoords.push(
                    (j / this.slices) * this.texScaleS,
                    (1 - i / this.stacks) * this.texScaleT
                );
            }
        }

        const pushTriangle = (a, b, c) => {
            if (this.inside) this.indices.push(a, c, b);
            else this.indices.push(a, b, c);
        };

        for (let i = 0; i < this.stacks; ++i) {
            let k1 = i * (this.slices + 1);
            let k2 = k1 + this.slices + 1;

            for (let j = 0; j < this.slices; ++j, ++k1, ++k2) {
                if (i !== 0) pushTriangle(k1, k1 + 1, k2);
                if (i !== this.stacks - 1) pushTriangle(k1 + 1, k2 + 1, k2);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
