import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyCylinder } from "./MyCylinder.js";

export class MyHayBale extends CGFobject {
  constructor(scene) {
    super(scene);
    
    this.baleCylinder = new MyCylinder(scene, 8, 1);
    
    this.baleCap = new MyBaleCap(scene, 8);
    
    this.baleMaterial = new CGFappearance(scene);
    this.baleMaterial.setAmbient(0.78, 0.62, 0.18, 1.0);
    this.baleMaterial.setDiffuse(0.88, 0.72, 0.22, 1.0);
    this.baleMaterial.setSpecular(0.05, 0.05, 0.02, 1.0);
    this.baleMaterial.setShininess(5.0);
    this.baleMaterial.loadTexture("images/textures/hay_diffuse.jpg");
    this.baleMaterial.setTextureWrap("REPEAT", "REPEAT");

    this.capMaterial = new CGFappearance(scene);
    this.capMaterial.setAmbient(0.72, 0.55, 0.14, 1.0);
    this.capMaterial.setDiffuse(0.82, 0.64, 0.16, 1.0);
    this.capMaterial.setSpecular(0.02, 0.02, 0.01, 1.0);
    this.capMaterial.setShininess(3.0);
    this.capMaterial.loadTexture("images/textures/hay_diffuse.jpg");
    this.capMaterial.setTextureWrap("REPEAT", "REPEAT");


    this.ropeMaterial = new CGFappearance(scene);
    this.ropeMaterial.setAmbient(0.30, 0.18, 0.08, 1.0);
    this.ropeMaterial.setDiffuse(0.42, 0.26, 0.12, 1.0);
    this.ropeMaterial.setSpecular(0.01, 0.01, 0.01, 1.0);
    this.ropeMaterial.setShininess(1.0);
  }

  display() {
    this.scene.pushMatrix();
    
    this.scene.translate(0, 0, -0.5);

    this.baleMaterial.apply();
    this.baleCylinder.display();

    this.capMaterial.apply();
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 1.0); 
    this.baleCap.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, 0, 0.0); 
    this.scene.rotate(Math.PI, 0, 1, 0); 
    this.baleCap.display();
    this.scene.popMatrix();


    this.ropeMaterial.apply();

    this.scene.pushMatrix();
    this.scene.translate(0, 0, 0.25);
    this.scene.scale(1.02, 1.02, 0.03); 
    this.baleCylinder.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, 0, 0.75);
    this.scene.scale(1.02, 1.02, 0.03);
    this.baleCylinder.display();
    this.scene.popMatrix();

    this.scene.popMatrix();
  }
}

class MyBaleCap extends CGFobject {
  constructor(scene, slices) {
    super(scene);
    this.slices = slices;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5, 0.5);

    for (let i = 0; i < this.slices; i++) {
      let angle = (i * 2 * Math.PI) / this.slices;
      let x = Math.cos(angle);
      let y = Math.sin(angle);

      this.vertices.push(x, y, 0);
      this.normals.push(0, 0, 1); 
      this.texCoords.push(0.5 + x * 0.5, 0.5 - y * 0.5);
    }

    for (let i = 1; i <= this.slices; i++) {
      let next = (i === this.slices) ? 1 : i + 1;
      this.indices.push(0, i, next);
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}