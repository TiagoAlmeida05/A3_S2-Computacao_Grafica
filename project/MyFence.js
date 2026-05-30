import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyCylinder } from "./MyCylinder.js";

export class MyFence extends CGFobject {
  constructor(scene) {
    super(scene);
    
    this.fenceCylinder = new MyCylinder(scene, 5, 1);

    this.fenceMaterial = new CGFappearance(scene);
    this.fenceMaterial.setAmbient(0.28, 0.18, 0.12, 1.0);
    this.fenceMaterial.setDiffuse(0.42, 0.28, 0.18, 1.0);
    this.fenceMaterial.setSpecular(0.01, 0.01, 0.01, 1.0);
  }

  displayLine(x1, z1, x2, z2, barnBaseY) {
    this.fenceMaterial.apply();

    const dx = x2 - x1;
    const dz = z2 - z1;
    const distance = Math.hypot(dx, dz);

    const targetSpacing = 0.85; 
    const numSegments = Math.max(1, Math.round(distance / targetSpacing));
    const stepX = dx / numSegments;
    const stepZ = dz / numSegments;

    let postsCoordinates = [];

    for (let i = 0; i <= numSegments; i++) {
      const localX = x1 + i * stepX;
      const localZ = z1 + i * stepZ;

      const worldX = 0.0 + localX;
      const worldZ = -4.0 + localZ; 
      const worldY = this.scene.getGroundY(worldX, worldZ, 0.0);
      const localY = worldY - barnBaseY;

      postsCoordinates.push({ x: localX, y: localY, z: localZ });

      this.scene.pushMatrix();
      this.scene.translate(localX, localY, localZ);
      this.scene.rotate(-Math.PI / 2, 1, 0, 0);
      this.scene.scale(0.05, 0.05, 0.75); 
      this.fenceCylinder.display();
      this.scene.popMatrix();
    }

    for (let i = 0; i < postsCoordinates.length - 1; i++) {
      const p1 = postsCoordinates[i];
      const p2 = postsCoordinates[i + 1];

      const segX = p2.x - p1.x;
      const segY = p2.y - p1.y;
      const segZ = p2.z - p1.z;
      const horizontalDist = Math.hypot(segX, segZ);

      const angleYaw = Math.atan2(segX, segZ);
      const anglePitch = Math.atan2(segY, horizontalDist); 

      const railHeights = [0.22, 0.52];
      for (const h of railHeights) {
        this.scene.pushMatrix();
        this.scene.translate(p1.x, p1.y + h, p1.z);
        this.scene.rotate(angleYaw, 0, 1, 0);
        this.scene.rotate(anglePitch, 1, 0, 0); 
        this.scene.scale(0.015, 0.035, horizontalDist);
        this.fenceCylinder.display();
        this.scene.popMatrix();
      }
    }
  }
}