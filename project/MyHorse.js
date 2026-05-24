import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { CGFobjModel } from './CGFobjModel.js'; 

export class MyHorse extends CGFobject {
    constructor(scene) {
        super(scene);
        
        // 1. Point to your NEW file
        this.horseMesh = new CGFobjModel(this.scene, "models/horse.obj");

        this.horseMaterial = new CGFappearance(this.scene);
        this.horseMaterial.setAmbient(0.3, 0.15, 0.05, 1.0);
        this.horseMaterial.setDiffuse(0.4, 0.2, 0.08, 1.0);
        this.horseMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.horseMaterial.setShininess(10.0);

        this.walkCycle = 0; 
    }

    update(speed, dt) {
        this.walkCycle += speed * dt * 0.3; 
    }

    display() {
        this.scene.pushMatrix();
        
        this.scene.gl.disable(this.scene.gl.CULL_FACE);
        this.horseMaterial.apply();

        let bobbing = Math.abs(Math.sin(this.walkCycle)) * 0.07;
        let rocking = Math.cos(this.walkCycle) * 0.2;
        this.scene.translate(0, bobbing, 0);
        this.scene.rotate(rocking, 1, 0, 0);

        this.scene.translate(0, 1.2, 0);
        this.scene.scale(0.012, 0.012, 0.012);
        this.scene.rotate(-Math.PI/2-0.3, 0, 1, 0); 

        this.horseMesh.display();
        this.scene.gl.enable(this.scene.gl.CULL_FACE);

        this.scene.popMatrix();
    }
}