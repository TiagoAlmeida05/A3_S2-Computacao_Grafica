import { CGFobject } from "../lib/CGF.js";

export class MyTerrain extends CGFobject {
  constructor(
    scene,
    size = 200,
    nDivs = 200,
    maxHeight = 4,
    heightmapUrl = "images/heightmaps/heightmap_attempt_1.png",
    texRepeat = 8,
    smoothIterations = 1
  ) {
    super(scene);
    this.size = size;
    this.nDivs = nDivs;
    this.maxHeight = maxHeight;
    this.heightmapUrl = heightmapUrl;
    this.texRepeat = texRepeat;
    this.smoothIterations = smoothIterations;

    this.heights = new Array((this.nDivs + 1) * (this.nDivs + 1)).fill(0);
    this.heightmapData = null;
    this.heightmapWidth = 0;
    this.heightmapHeight = 0;
    this.heightmapLoaded = false;

    this.initBuffers();
    this.loadHeightmap();
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

  loadHeightmap() {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, image.width, image.height);

      this.heightmapData = imageData.data;
      this.heightmapWidth = image.width;
      this.heightmapHeight = image.height;
      this.heightmapLoaded = true;

      this.applyHeightmap();
    };
    image.src = this.heightmapUrl;
  }

  applyHeightmap() {
    if (!this.heightmapLoaded) return;

    for (let row = 0; row <= this.nDivs; row++) {
      const v = row / this.nDivs;

      for (let column = 0; column <= this.nDivs; column++) {
        const u = column / this.nDivs;
        const height = this.sampleHeight(u, v) * this.maxHeight;
        this.setHeight(column, row, height);
      }
    }

    if (this.smoothIterations > 0) {
      this.smoothHeights(this.smoothIterations);
    }

    this.updateVerticesFromHeights();
    this.recalculateNormals();
    this.initGLBuffers();
  }

  sampleHeight(u, v) {
    const x = u * (this.heightmapWidth - 1);
    const y = v * (this.heightmapHeight - 1);

    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = Math.min(x0 + 1, this.heightmapWidth - 1);
    const y1 = Math.min(y0 + 1, this.heightmapHeight - 1);

    const sx = x - x0;
    const sy = y - y0;

    const h00 = this.getPixelHeight(x0, y0);
    const h10 = this.getPixelHeight(x1, y0);
    const h01 = this.getPixelHeight(x0, y1);
    const h11 = this.getPixelHeight(x1, y1);

    const hx0 = h00 * (1 - sx) + h10 * sx;
    const hx1 = h01 * (1 - sx) + h11 * sx;

    return hx0 * (1 - sy) + hx1 * sy;
  }

  getPixelHeight(x, y) {
    const index = (y * this.heightmapWidth + x) * 4;
    const r = this.heightmapData[index];
    const g = this.heightmapData[index + 1];
    const b = this.heightmapData[index + 2];
    return (r + g + b) / (3 * 255);
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
}
