import { CGFobject, CGFtexture, CGFappearance } from '../lib/CGF.js'
import { MyUnitCubeQuad } from './MyUnitCubeQuad.js';
import { MyCylinder } from './MyCylinder.js';
import { MyHalfCylinder } from './MyHalfCylinder.js';
import { MyHorse } from './MyHorse.js';

export class MyWagon extends CGFobject {
    constructor(scene){
        super(scene);
        this.woodTexture = new CGFtexture(this.scene, "images/textures/wood.jpg")
        this.fabricTexture = new CGFtexture(this.scene, "images/textures/fabric.jpg")

        this.box = new MyUnitCubeQuad(
            this.scene,
            this.woodTexture,
            this.woodTexture,
            this.woodTexture,
            this.woodTexture,
            this.woodTexture,
            this.woodTexture
        );

        this.cylinder = new MyCylinder(this.scene, 16, 1);
        this.roof = new MyHalfCylinder(this.scene, 16, 1);

        this.horseLeft = new MyHorse(this.scene);
        this.horseRight = new MyHorse(this.scene);

        this.darkMaterial = new CGFappearance(this.scene);
        this.darkMaterial.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.darkMaterial.setDiffuse(0.2, 0.2, 0.2, 1.0);
        this.darkMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.darkMaterial.setShininess(5.0)

        this.canvasMaterial = new CGFappearance(this.scene);
        this.canvasMaterial.setAmbient(0.8, 0.8, 0.8, 1.0);
        this.canvasMaterial.setDiffuse(0.9, 0.9, 0.9, 1.0);
        this.canvasMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.canvasMaterial.setShininess(2.0)
        this.canvasMaterial.setTexture(this.fabricTexture);
    }

    displayWheel(rotation = 0) {
        this.darkMaterial.apply();

        this.scene.pushMatrix();
        this.scene.rotate(rotation, 0, 0, 1);

        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.2);
        this.scene.scale(0.8, 0.8, 0.4);
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.25);
        this.scene.scale(0.2, 0.2, 0.5);
        this.cylinder.display();
        this.scene.popMatrix();

        for (let i = 0; i < 4; i++) {
            this.scene.pushMatrix();
            this.scene.rotate((Math.PI / 4) * i, 0, 0, 1);
            this.scene.rotate((-Math.PI / 2), 1, 0, 0);
            this.scene.translate(0, 0, -0.78);
            this.scene.scale(0.04, 0.04, 1.56);
            this.cylinder.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }

    display(wheelRotation = 0, steeringAngle = 0) {
        this.scene.pushMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 1, 0);
        this.scene.scale(1.5, 0.2, 3.0);
        this.box.display();
        this.scene.popMatrix();

        // === SIDE WALLS ===
        // Left Wall
        this.scene.pushMatrix();
        this.scene.translate(-1.45, 1.5, 0);
        this.scene.scale(0.05, 0.3, 3.0);
        this.box.display();
        this.scene.popMatrix();

        // Right Wall
        this.scene.pushMatrix();
        this.scene.translate(1.45, 1.5, 0);
        this.scene.scale(0.05, 0.3, 3.0);
        this.box.display();
        this.scene.popMatrix();

        // === PULLING TONGUE (FRONT BEAM) ===
        this.scene.pushMatrix();
        this.scene.translate(0, 1, 4.5);
        this.scene.scale(0.15, 0.15, 3.0);
        this.box.display();
        this.scene.popMatrix();

        // Crossbar (Doubletree)
        this.scene.pushMatrix();
        this.scene.translate(0, 1.15, 7.5);
        this.scene.scale(1.0, 0.1, 0.1);
        this.box.display();
        this.scene.popMatrix();

        // Right support
        this.scene.pushMatrix();
        this.scene.translate(0.5, 1.15, 3.2);
        this.scene.scale(0.08, 0.32, 0.08);
        this.box.display();
        this.scene.popMatrix();

        // Seat plank
        this.scene.pushMatrix();
        this.scene.translate(0, 1.38, 3.2);
        this.scene.scale(1.2, 0.1, 0.5);
        this.box.display();
        this.scene.popMatrix();

        // Backrest
        this.scene.pushMatrix();
        this.scene.translate(0, 1.72, 2.98);
        this.scene.rotate(-0.25, 1, 0, 0);
        this.scene.scale(1.2, 0.45, 0.08);
        this.box.display();
        this.scene.popMatrix();

        // Inclined foot board
        this.scene.pushMatrix();
        this.scene.translate(0, 1.02, 3.95);
        this.scene.rotate(-0.45, 1, 0, 0);
        this.scene.scale(0.9, 0.05, 0.35);
        this.box.display();
        this.scene.popMatrix();

        // === REAR AXLE & WHEELS ===
        this.scene.pushMatrix()
        this.scene.translate(0, 0.7, -2.0);

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.translate(0, 0, -2.0);
        this.scene.scale(0.1, 0.1, 4.0);
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1.85, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.displayWheel(wheelRotation);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.85, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.displayWheel(-wheelRotation);
        this.scene.popMatrix();

        this.scene.popMatrix();


        // === Front AXLE & WHEELS ===
        this.scene.pushMatrix()
        this.scene.translate(0, 0.7, 2.0);

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.translate(0, 0, -2.0);
        this.scene.scale(0.1, 0.1, 4.0);
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1.85, 0, 0);
        this.scene.rotate(steeringAngle, 0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.displayWheel(wheelRotation);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.85, 0, 0);
        this.scene.rotate(steeringAngle, 0, 1, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.displayWheel(-wheelRotation);
        this.scene.popMatrix();

        this.scene.popMatrix();

        // === CANVAS ROOF ===
        this.scene.pushMatrix();
        this.canvasMaterial.apply();
        this.scene.translate(0, 1.8, -3.0);
        this.scene.scale(1.45, 1.5, 6.0);
        this.roof.display();
        this.scene.popMatrix();

        // === HORSES ===
        this.scene.pushMatrix();
        this.scene.translate(-0.8, 0, 6);
        this.horseLeft.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.8, 0, 6);
        this.horseRight.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }

    update(speed, dt) {
        this.horseLeft.update(speed, dt);
        this.horseRight.update(speed, dt);
    }
}