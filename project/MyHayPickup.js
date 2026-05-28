import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyHayBale } from "./MyHayBale.js";
import { MyPyramid } from "./MyPyramid.js"; // Or substitute with any cone/pyramid object you have

export class MyHayPickup extends CGFobject {
    constructor(scene, x, z, y) {
        super(scene);
        this.x = x;
        this.z = z;
        this.y = y;
        this.isPickedUp = false;
        
        this.bale = new MyHayBale(scene);
        this.arrow = new MyPyramid(scene, 4, 1); // Standard 4-sided pyramid pointing down

        // Custom vibrant material to make the floating objective indicator pop out
        this.arrowMaterial = new CGFappearance(scene);
        this.arrowMaterial.setAmbient(0.1, 0.8, 0.1, 1.0);
        this.arrowMaterial.setDiffuse(0.2, 1.0, 0.2, 1.0);
        this.arrowMaterial.setSpecular(0.8, 1.0, 0.8, 1.0);
        this.arrowMaterial.setShininess(20.0);
    }

    display(currTime) {
        if (this.isPickedUp) return;

        const timeSec = currTime * 0.001;
        // Calculate smooth mathematical bobbing & rotation animations
        const bobbingOffset = Math.sin(timeSec * 3.5) * 0.25;
        const rotationAngle = timeSec * 1.5;

        this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, this.z);

        // --- Render the Base Hay Bale Geometric Object ---
        this.scene.pushMatrix();
        // Rest bale flat horizontally onto the floor canvas coordinate grid
        this.scene.rotate(Math.PI / 2, 0, 1, 0); 
        this.scene.scale(0.8, 0.8, 1.2);
        this.bale.display();
        this.scene.popMatrix();

        // --- Render Pointing Overhead Indicator Arrow ---
        this.arrowMaterial.apply();
        this.scene.pushMatrix();
        // Hover arrow comfortably sitting directly above the target item mesh
        this.scene.translate(0, 1.8 + bobbingOffset, 0);
        this.scene.rotate(rotationAngle, 0, 1, 0);
        this.scene.rotate(Math.PI, 1, 0, 0); // Flip upside down to act as down-pointer arrow
        this.scene.scale(0.4, 0.7, 0.4);
        this.arrow.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}