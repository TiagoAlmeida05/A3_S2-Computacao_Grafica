import { CGFobject, CGFappearance } from "../lib/CGF.js";

export class MyDropZone extends CGFobject {
  constructor(scene, centerX, centerZ, radius = 2.2, slices = 32, rings = 5) {
    super(scene);
    this.centerX = centerX;
    this.centerZ = centerZ;
    this.radius = radius;
    this.slices = slices;
    this.rings = rings;

    this.darkGreenZoneMat = new CGFappearance(scene);
    this.darkGreenZoneMat.setAmbient(0.02, 0.22, 0.02, 0.5); 
    this.darkGreenZoneMat.setDiffuse(0.05, 0.38, 0.05, 0.6); 
    this.darkGreenZoneMat.setSpecular(0.01, 0.01, 0.01, 1.0);

    this.initBuffers();
  }

  display() {
    const materials = this.scene.barnMaterials;
    const isWagonInDropZone = this.scene.isWagonInDropZone || false;

    let currentMat = isWagonInDropZone ? (materials ? materials.zoneActive : null) : (materials ? materials.zoneNormal : null);

    if (this.scene.activeKeys && (this.scene.activeKeys[' '] || this.scene.activeKeys['Space'])) {
      currentMat = this.darkGreenZoneMat; 
    }

    if (currentMat) currentMat.apply();
    super.display(); 
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    const barnBaseY = this.scene.getGroundY(0, 0);

    const centerWorldX = 0.0 + this.centerX;
    const centerWorldZ = -4.0 + this.centerZ;
    const centerWorldY = this.scene.getGroundY(centerWorldX, centerWorldZ, 0.035);
    const centerLocalY = centerWorldY - barnBaseY;

    this.vertices.push(this.centerX, centerLocalY, this.centerZ);
    this.normals.push(0, 1, 0);
    this.texCoords.push(0.5, 0.5);

    for (let r = 1; r <= this.rings; r++) {
      const currentRadius = (r / this.rings) * this.radius;

      for (let i = 0; i < this.slices; i++) {
        const angle = (i * 2 * Math.PI) / this.slices;
        const localX = this.centerX + Math.cos(angle) * currentRadius;
        const localZ = this.centerZ + Math.sin(angle) * currentRadius;

        const worldX = 0.0 + localX;
        const worldZ = -4.0 + localZ;
        const worldY = this.scene.getGroundY(worldX, worldZ, 0.035);
        const localY = worldY - barnBaseY;

        this.vertices.push(localX, localY, localZ);
        this.normals.push(0, 1, 0);
        this.texCoords.push(
          0.5 + Math.cos(angle) * 0.5 * (r / this.rings),
          0.5 + Math.sin(angle) * 0.5 * (r / this.rings)
        );
      }
    }

    for (let i = 0; i < this.slices; i++) {
      const current = 1 + i;
      const next = 1 + ((i + 1) % this.slices);
      this.indices.push(0, current, next);
    }

    for (let r = 0; r < this.rings - 1; r++) {
      const startCurrentRing = 1 + r * this.slices;
      const startNextRing = 1 + (r + 1) * this.slices;

      for (let i = 0; i < this.slices; i++) {
        const cVert = startCurrentRing + i;
        const cNext = startCurrentRing + ((i + 1) % this.slices);
        const nVert = startNextRing + i;
        const nNext = startNextRing + ((i + 1) % this.slices);

        this.indices.push(cVert, nVert, cNext);
        this.indices.push(cNext, nVert, nNext);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}