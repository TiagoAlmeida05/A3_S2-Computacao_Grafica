import {CGFobject, CGFappearance, CGFtexture} from '../lib/CGF.js';
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

        this.diamond = new MyDiamond(scene);
        this.triangle = new MyTriangle(scene);
        this.parallelogram = new MyParallelogram(scene);
        this.triangleSmall = new MyTriangleSmall(scene);
        this.triangleSmall1 = new MyTriangleSmall(scene);
        this.triangleBig = new MyTriangleBig(scene);
        this.triangleBig1 = new MyTriangleBig(scene);

        this.texture = new CGFtexture(this.scene, 'images/tangram.png');

        // Material for the diamond
        this.diamondMaterial = new CGFappearance(this.scene);
        this.diamondMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.diamondMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.diamondMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.diamondMaterial.setShininess(10.0);
        this.diamondMaterial.setTexture(this.texture);
        this.diamondMaterial.setTextureWrap('REPEAT', 'REPEAT');

    }
    
    display() {
        this.scene.pushMatrix();
        this.scene.translate(-0.1, 3, 0);
        this.diamondMaterial.apply();
        this.diamond.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2.5, -1, 0);
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.triangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1, -1, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.parallelogram.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.5, -2, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.triangleSmall.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-4.5, -1, 0);
        this.triangleSmall1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1, -1, 0);
        this.triangleBig.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 2, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.triangleBig1.display();
        this.scene.popMatrix();
    }
}

