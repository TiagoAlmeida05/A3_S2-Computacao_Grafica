import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyHayBale } from "./MyHayBale.js";
import { MyPyramid } from "./MyPyramid.js";

export class MyHayPickup extends CGFobject {
    constructor(scene, x, z, y) {
        super(scene);
        this.x = x;
        this.z = z;
        this.y = y;
        this.isPickedUp = false;
        
        this.bale = new MyHayBale(scene);
        this.arrow = new MyPyramid(scene, 4, 1); 

        this.arrowMaterial = new CGFappearance(scene);
        this.arrowMaterial.setAmbient(0.1, 0.8, 0.1, 1.0);
        this.arrowMaterial.setDiffuse(0.2, 1.0, 0.2, 1.0);
        this.arrowMaterial.setSpecular(0.8, 1.0, 0.8, 1.0);
        this.arrowMaterial.setShininess(20.0);
    }

    display(currTime, isNearWagon) {
    if (this.isPickedUp) return;

    const timeSec = currTime * 0.001;
    // Notice: We deleted the bobbingOffset calculation here!
    const rotationAngle = timeSec * 2.0;

    this.scene.pushMatrix();
    this.scene.translate(this.x, this.y, this.z);

    if (isNearWagon) {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 1, 0); 
        this.scene.scale(0.8, 0.8, 1.2);
        this.bale.display();
        this.scene.popMatrix();
    }

    this.scene.setActiveShader(this.scene.arrowShader);
    this.scene.arrowShader.setUniformsValues({ uTime: timeSec });

    this.scene.pushMatrix();
    this.scene.translate(0, 2.0, 0); 
    this.scene.rotate(rotationAngle, 0, 1, 0);
    this.scene.rotate(Math.PI, 1, 0, 0); 
    this.scene.scale(0.4, 0.7, 0.4);
    this.arrow.display();
    this.scene.popMatrix();

    this.scene.setActiveShader(this.scene.defaultShader); 

    this.scene.popMatrix();
}
}