import { CGFobject } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MyLowPolyRock extends CGFobject {
  constructor(scene, slices = 6, stacks = 4) {
    super(scene);
    
    this.core = new MySphere(scene, 1, slices, stacks, false, false, 1, 1);

    for (let i = 0; i < this.core.vertices.length; i += 3) {
      let x = this.core.vertices[i];
      let y = this.core.vertices[i+1];
      let z = this.core.vertices[i+2];

      let hash = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
      let noise = hash - Math.floor(hash); 
      
      let offset = 0.8 + (noise * 0.4); 

      // Apply the perturbation
      this.core.vertices[i] = x * offset;
      this.core.vertices[i+1] = y * offset;
      this.core.vertices[i+2] = z * offset;
    }

    this.recalculateNormals();

    this.core.initGLBuffers();
  }

  recalculateNormals() {
    for (let i = 0; i < this.core.vertices.length; i += 3) {
      let x = this.core.vertices[i];
      let y = this.core.vertices[i+1];
      let z = this.core.vertices[i+2];

      let length = Math.sqrt(x*x + y*y + z*z);
      
      this.core.normals[i] = x / length;
      this.core.normals[i+1] = y / length;
      this.core.normals[i+2] = z / length;
    }
  }

  display() {
    this.core.display();
  }
}