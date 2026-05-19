import {CGFobject} from '../lib/CGF.js';

export class MySphere extends CGFobject {
    /**
     * @constructor
     * @param scene - Reference to MyScene object
     * @param radius - Raio da esfera
     * @param slices - Número de divisões em torno do eixo Z (sectores)
     * @param stacks - Número de divisões entre os polos
     * @param inside - Inverte as normais para renderizar de dentro para fora
     * @param half - Gera apenas a metade superior da esfera (dome)
     * @param texScaleS - Repetições horizontais do mapa de textura
     * @param texScaleT - Repetições verticais do mapa de textura
     */
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

        let x, y, z, xy;                              
        let nx, ny, nz, lengthInv = 1.0 / this.radius;    
        let s, t;                                     

        let sectorStep = 2 * Math.PI / this.slices;
        let stackStep = (this.half ? Math.PI / 2 : Math.PI) / this.stacks;
        let sectorAngle, stackAngle;

        // --- Geração de Vértices, Normais e TexCoords ---
        for (let i = 0; i <= this.stacks; ++i) {
            stackAngle = Math.PI / 2 - i * stackStep; 
            
            let xz = this.radius * Math.cos(stackAngle);
            y = this.radius * Math.sin(stackAngle);

            for (let j = 0; j <= this.slices; ++j) {
                sectorAngle = j * sectorStep;         

                // Posição (x, y, z)
                x = xz * Math.cos(sectorAngle);       
                z = xz * Math.sin(sectorAngle);       
                this.vertices.push(x, y, z);

                // Normal (nx, ny, nz)
                nx = x * lengthInv;
                ny = y * lengthInv;
                nz = z * lengthInv;
                if (this.inside) {
                    this.normals.push(-nx, -ny, -nz);
                } else {
                    this.normals.push(nx, ny, nz);
                }

                // Coordenadas de textura (s, t)
                s = (j / this.slices) * this.texScaleS;
                t = (1 - (i / this.stacks)) * this.texScaleT;
                this.texCoords.push(s, t);
            }
        }

        // --- Geração de Índices ---
        // k1--k1+1
        // |  / |
        // k2--k2+1
        const pushTriangle = (a, b, c) => {
            if (this.inside) {
                this.indices.push(a, c, b);
            } else {
                this.indices.push(a, b, c);
            }
        };

        for (let i = 0; i < this.stacks; ++i) {
            let k1 = i * (this.slices + 1);     // início da stack atual
            let k2 = k1 + this.slices + 1;      // início da próxima stack

            for (let j = 0; j < this.slices; ++j, ++k1, ++k2) {
                // 2 triângulos por setor (exceto nos polos, mas esta lógica simplificada funciona)
                if (i !== 0) {
                    pushTriangle(k1, k1 + 1, k2);
                }

                if (i !== (this.stacks - 1) || this.half) {
                    if (this.inside) this.indices.push(k1 + 1, k2, k2 + 1);
                    else this.indices.push(k1 + 1, k2 + 1, k2);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}