import {CGFobject, CGFappearance} from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js"; 
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";
import { MyTriangleBig } from "./MyTriangleBig.js";
/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();

        // Make sure materials exist before we try to apply them
        this.initMaterials();

        this.diamond = new MyDiamond(scene);
        this.triangle = new MyTriangle(scene);
        this.parallelogram = new MyParallelogram(scene);
        this.triangleSmall = new MyTriangleSmall(scene);
        this.triangleSmall1 = new MyTriangleSmall(scene);
        this.triangleBig = new MyTriangleBig(scene);
        this.triangleBig1 = new MyTriangleBig(scene);
    }
    
    display() {
        this.scene.pushMatrix();
        this.scene.translate(-0.1, 3, 0);
        this.scene.customMaterial.apply();
        this.diamond.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2.5, -1, 0);
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.materialPi.apply();
        this.triangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1, -1, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);        
        this.materialY.apply();
        this.parallelogram.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.5, -2, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.materialPu.apply();
        this.triangleSmall.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-4.5, -1, 0);
        this.materialR.apply();
        this.triangleSmall1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1, -1, 0);
        this.materialB.apply();
        this.triangleBig.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 2, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.materialO.apply();
        this.triangleBig1.display();
        this.scene.popMatrix();
    }

    enableNormalViz() {
        this.diamond.enableNormalViz();
        this.triangle.enableNormalViz();
        this.parallelogram.enableNormalViz();
        this.triangleSmall.enableNormalViz();
        this.triangleSmall1.enableNormalViz();
        this.triangleBig.enableNormalViz();
        this.triangleBig1.enableNormalViz();
    }

    disableNormalViz() {
        this.diamond.disableNormalViz();
        this.triangle.disableNormalViz();
        this.parallelogram.disableNormalViz();
        this.triangleSmall.disableNormalViz();
        this.triangleSmall1.disableNormalViz();
        this.triangleBig.disableNormalViz();
        this.triangleBig1.disableNormalViz();
    }

    initMaterials() {
        //Red Specular Material
        this.materialR = new CGFappearance(this.scene);
        this.materialR.setAmbient(0, 0, 0, 1.0);
        this.materialR.setDiffuse(0, 0, 0, 1.0);
        this.materialR.setSpecular(1, 0, 0, 1.0);
        this.materialR.setShininess(10.0);

        // Blue Specular Material
        this.materialB = new CGFappearance(this.scene);
        this.materialB.setAmbient(0, 0, 0, 1.0);
        this.materialB.setDiffuse(0, 0, 0.2, 1.0);
        this.materialB.setSpecular(0, 0, 1, 1.0);
        this.materialB.setShininess(200.0);

        //Green Specular Material
        this.materialG = new CGFappearance(this.scene);
        this.materialG.setAmbient(0, 0, 0, 1.0);
        this.materialG.setDiffuse(0, 0, 0, 1.0);
        this.materialG.setSpecular(0, 1, 0, 1.0);
        this.materialG.setShininess(10.0);

        //Orange Specular Material
        this.materialO = new CGFappearance(this.scene);
        this.materialO.setAmbient(0, 0, 0, 1.0);
        this.materialO.setDiffuse(0, 0, 0, 1.0);
        this.materialO.setSpecular(1, 0.5, 0, 1.0);
        this.materialO.setShininess(10.0);

        // Pink Specular Material (light pink)
        this.materialPi = new CGFappearance(this.scene);
        this.materialPi.setAmbient(0, 0, 0, 1.0);
        this.materialPi.setDiffuse(0.1, 0, 0.1, 1.0);
        this.materialPi.setSpecular(1, 0.2, 0.6, 1.0);
        this.materialPi.setShininess(10.0);

        //Yellow Specular Material
        this.materialY = new CGFappearance(this.scene);
        this.materialY.setAmbient(0, 0, 0, 1.0);
        this.materialY.setDiffuse(0, 0, 0, 1.0);
        this.materialY.setSpecular(1, 1, 0, 1.0);
        this.materialY.setShininess(10.0);

        //Purple Specular Material
        this.materialPu = new CGFappearance(this.scene);
        this.materialPu.setAmbient(0, 0, 0, 1.0);
        this.materialPu.setDiffuse(0.1, 0, 0.1, 1.0);
        this.materialPu.setSpecular(0.6, 0, 0.6, 1.0);
        this.materialPu.setShininess(100.0);
    }
}

