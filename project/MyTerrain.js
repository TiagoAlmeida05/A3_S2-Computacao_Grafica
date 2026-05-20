import { CGFobject } from "../lib/CGF.js";

export class MyTerrain extends CGFobject {
  constructor(
    scene,
    size = 200,
    nDivs = 100,
    maxHeight = 2.0,
    texRepeat = 8,
    smoothIterations = 1,
    noiseScale = 0.035,
    octaves = 4,
    persistence = 0.5,
    lacunarity = 2.0,
    seed = 1337
  ) {
    super(scene);
    this.size = size;
    this.nDivs = nDivs;
    this.heightAmplitude = maxHeight;
    this.texRepeat = texRepeat;
    this.smoothIterations = smoothIterations;
    this.noiseScale = noiseScale;
    this.octaves = octaves;
    this.persistence = persistence;
    this.lacunarity = lacunarity;
    this.seed = seed;

    this.generated = false;
    this.minGeneratedHeight = 0;
    this.maxGeneratedHeight = 0;

    this.heights = new Array((this.nDivs + 1) * (this.nDivs + 1)).fill(0);

    this.initBuffers();
    this.generateProceduralHeights(true);
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    const halfSize = this.size / 2;
    const step = this.size / this.nDivs;
    const texStep = this.texRepeat / this.nDivs;

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

  generateProceduralHeights(force = false) {
    if (this.generated && !force) return;
    this.generated = true;

    const halfSize = this.size / 2;
    const step = this.size / this.nDivs;
    let minHeight = Infinity;
    let maxHeight = -Infinity;

    const lowScale = this.noiseScale * 0.55;
    const detailScale = this.noiseScale * 1.7;
    const flattenInner = this.size * 0.12;
    const flattenOuter = this.size * 0.32;

    for (let row = 0; row <= this.nDivs; row++) {
      const z = halfSize - row * step;

      for (let column = 0; column <= this.nDivs; column++) {
        const x = -halfSize + column * step;
        const hills = this.fbm(x * lowScale, z * lowScale);
        const detail = this.fbm(x * detailScale, z * detailScale);
        const centeredHills = (hills - 0.5) * 2.0;
        const centeredDetail = (detail - 0.5) * 2.0;

        let height = centeredHills * this.heightAmplitude * 0.7;
        height += centeredDetail * this.heightAmplitude * 0.25;

        const dist = Math.hypot(x, z);
        const flattenT = Math.max(0, Math.min(1, (dist - flattenInner) / (flattenOuter - flattenInner)));
        const flatten = 0.7 + 0.3 * flattenT;
        height *= flatten;

        this.setHeight(column, row, height);
        minHeight = Math.min(minHeight, height);
        maxHeight = Math.max(maxHeight, height);
      }
    }

    if (this.smoothIterations > 0) {
      this.smoothHeights(this.smoothIterations);
    }

    minHeight = Infinity;
    maxHeight = -Infinity;
    for (const height of this.heights) {
      minHeight = Math.min(minHeight, height);
      maxHeight = Math.max(maxHeight, height);
    }

    this.updateVerticesFromHeights();
    this.recalculateNormals();
    this.initGLBuffers();

    this.minGeneratedHeight = minHeight;
    this.maxGeneratedHeight = maxHeight;

  }

  random2D(ix, iz) {
    const x = ix + this.seed * 0.123;
    const z = iz + this.seed * 0.456;
    const value = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
    return value - Math.floor(value);
  }

  smoothNoise2D(x, z) {
    const x0 = Math.floor(x);
    const z0 = Math.floor(z);
    const x1 = x0 + 1;
    const z1 = z0 + 1;

    const sx = x - x0;
    const sz = z - z0;
    const u = sx * sx * (3 - 2 * sx);
    const v = sz * sz * (3 - 2 * sz);

    const n00 = this.random2D(x0, z0);
    const n10 = this.random2D(x1, z0);
    const n01 = this.random2D(x0, z1);
    const n11 = this.random2D(x1, z1);

    const nx0 = n00 * (1 - u) + n10 * u;
    const nx1 = n01 * (1 - u) + n11 * u;

    return nx0 * (1 - v) + nx1 * v;
  }

  fbm(x, z) {
    let value = 0;
    let amplitude = 1.0;
    let frequency = 1.0;
    let maxValue = 0;

    for (let i = 0; i < this.octaves; i++) {
      value += this.smoothNoise2D(x * frequency, z * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= this.persistence;
      frequency *= this.lacunarity;
    }

    return value / Math.max(maxValue, 0.0001);
  }

  smoothHeights(iterations) {
    const size = this.nDivs + 1;

    for (let i = 0; i < iterations; i++) {
      const smoothed = new Array(this.heights.length).fill(0);

      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          let total = 0;
          let count = 0;

          for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
              const rr = row + r;
              const cc = col + c;
              if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
              total += this.getHeight(cc, rr);
              count++;
            }
          }

          smoothed[row * size + col] = total / count;
        }
      }

      this.heights = smoothed;
    }
  }

  updateVerticesFromHeights() {
    for (let row = 0; row <= this.nDivs; row++) {
      for (let col = 0; col <= this.nDivs; col++) {
        const index = row * (this.nDivs + 1) + col;
        this.vertices[index * 3 + 1] = this.heights[index];
      }
    }
  }

  recalculateNormals() {
    const size = this.nDivs + 1;
    const step = this.size / this.nDivs;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const hL = this.getHeight(col - 1, row);
        const hR = this.getHeight(col + 1, row);
        const hD = this.getHeight(col, row + 1);
        const hU = this.getHeight(col, row - 1);

        const nx = hL - hR;
        const ny = 2 * step;
        const nz = hD - hU;

        const length = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        const normalIndex = (row * size + col) * 3;

        this.normals[normalIndex] = nx / length;
        this.normals[normalIndex + 1] = ny / length;
        this.normals[normalIndex + 2] = nz / length;
      }
    }
  }

  setHeight(col, row, height) {
    const index = row * (this.nDivs + 1) + col;
    this.heights[index] = height;
  }

  getHeight(col, row) {
    const size = this.nDivs + 1;
    const c = Math.max(0, Math.min(size - 1, col));
    const r = Math.max(0, Math.min(size - 1, row));
    return this.heights[r * size + c];
  }

  getHeightAt(x, z) {
    const halfSize = this.size / 2;
    const u = (x + halfSize) / this.size;
    const v = (halfSize - z) / this.size;

    const clampedU = Math.max(0, Math.min(1, u));
    const clampedV = Math.max(0, Math.min(1, v));

    const gridX = clampedU * this.nDivs;
    const gridZ = clampedV * this.nDivs;
    const x0 = Math.floor(gridX);
    const z0 = Math.floor(gridZ);
    const x1 = Math.min(x0 + 1, this.nDivs);
    const z1 = Math.min(z0 + 1, this.nDivs);

    const sx = gridX - x0;
    const sz = gridZ - z0;

    const h00 = this.getHeight(x0, z0);
    const h10 = this.getHeight(x1, z0);
    const h01 = this.getHeight(x0, z1);
    const h11 = this.getHeight(x1, z1);

    const hx0 = h00 * (1 - sx) + h10 * sx;
    const hx1 = h01 * (1 - sx) + h11 * sx;

    return hx0 * (1 - sz) + hx1 * sz;
  }

  getMinHeight() {
    return this.minGeneratedHeight;
  }

  getMaxHeight() {
    return this.maxGeneratedHeight;
  }

  getLowPoints(threshold, step = 4) {
    const points = [];
    const halfSize = this.size / 2;
    const gridStep = this.size / this.nDivs;

    for (let row = 0; row <= this.nDivs; row += step) {
      const z = halfSize - row * gridStep;
      for (let col = 0; col <= this.nDivs; col += step) {
        const x = -halfSize + col * gridStep;
        const height = this.getHeight(col, row);
        if (height <= threshold) {
          points.push({ x, z, height });
        }
      }
    }

    return points;
  }
}
