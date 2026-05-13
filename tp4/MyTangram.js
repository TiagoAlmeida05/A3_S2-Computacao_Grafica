<<<<<<< HEAD
import {CGFobject, CGFappearance, CGFtexture} from '../lib/CGF.js';
=======
import {CGFobject, CGFappearance} from '../lib/CGF.js';
>>>>>>> main
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

<<<<<<< HEAD
=======
        // Make sure materials exist before we try to apply them
        this.initMaterials();

>>>>>>> main
        this.diamond = new MyDiamond(scene);
        this.triangle = new MyTriangle(scene);
        this.parallelogram = new MyParallelogram(scene);
        this.triangleSmall = new MyTriangleSmall(scene);
<<<<<<< HEAD
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
=======
        this.triangleSmall1 = new MyTriangleSmall(scene, [
            0, 0,
            0.25, 0.25,
            0, 0.5
        ]);
        this.triangleBig = new MyTriangleBig(scene,[
            1, 1,
            1, 0,
            0.5, 0.5
        ]);
        this.triangleBig1 = new MyTriangleBig(scene);

    }

    
    display() {

>>>>>>> main
        this.scene.pushMatrix();
        this.scene.translate(-0.1, 3, 0);
        this.diamondMaterial.apply();
        this.diamond.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2.5, -1, 0);
        this.scene.rotate(Math.PI/4, 0, 0, 1);
<<<<<<< HEAD
=======
        this.triangleMaterial.apply();
>>>>>>> main
        this.triangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1, -1, 0);
<<<<<<< HEAD
        this.scene.rotate(Math.PI, 1, 0, 0);
=======
        this.scene.rotate(Math.PI, 1, 0, 0);        
        this.parallelogramMaterial.apply();
>>>>>>> main
        this.parallelogram.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.5, -2, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
<<<<<<< HEAD
=======
        this.triangleSmallMaterial.apply();
>>>>>>> main
        this.triangleSmall.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-4.5, -1, 0);
<<<<<<< HEAD
=======
        this.triangleSmall1Material.apply();
>>>>>>> main
        this.triangleSmall1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1, -1, 0);
<<<<<<< HEAD
=======
        this.triangleBigMaterial.apply();
>>>>>>> main
        this.triangleBig.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 2, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
<<<<<<< HEAD
        this.triangleBig1.display();
        this.scene.popMatrix();
    }
=======
        this.triangleBig1Material.apply();
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

        // Diamond Material
        this.diamondMaterial = new CGFappearance(this.scene);
        this.diamondMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.diamondMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.diamondMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.diamondMaterial.setShininess(10.0);
        this.diamondMaterial.loadTexture('images/tangram.png');
        this.diamondMaterial.setTextureWrap('REPEAT', 'REPEAT');

        // Triangle Material
        this.triangleMaterial = new CGFappearance(this.scene);
        this.triangleMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.triangleMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.triangleMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.triangleMaterial.setShininess(10.0);
        this.triangleMaterial.loadTexture('images/tangram.png');
        this.triangleMaterial.setTextureWrap('REPEAT', 'REPEAT');

        // Parallelogram Material
        this.parallelogramMaterial = new CGFappearance(this.scene);
        this.parallelogramMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.parallelogramMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.parallelogramMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.parallelogramMaterial.setShininess(10.0);
        this.parallelogramMaterial.loadTexture('images/tangram.png');
        this.parallelogramMaterial.setTextureWrap('REPEAT', 'REPEAT');  

        // Triangle Small Material
        this.triangleSmallMaterial = new CGFappearance(this.scene);
        this.triangleSmallMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.triangleSmallMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.triangleSmallMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.triangleSmallMaterial.setShininess(10.0);
        this.triangleSmallMaterial.loadTexture('images/tangram.png');
        this.triangleSmallMaterial.setTextureWrap('REPEAT', 'REPEAT');
        
        // Triangle Small 1 Material    
        this.triangleSmall1Material = new CGFappearance(this.scene);
        this.triangleSmall1Material.setAmbient(0.1, 0.1, 0.1, 1);
        this.triangleSmall1Material.setDiffuse(0.9, 0.9, 0.9, 1);
        this.triangleSmall1Material.setSpecular(0.1, 0.1, 0.1, 1);
        this.triangleSmall1Material.setShininess(10.0);
        this.triangleSmall1Material.loadTexture('images/tangram.png');
        this.triangleSmall1Material.setTextureWrap('REPEAT', 'REPEAT');
        
        // Triangle Big Material
        this.triangleBigMaterial = new CGFappearance(this.scene);
        this.triangleBigMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.triangleBigMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.triangleBigMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.triangleBigMaterial.setShininess(10.0);
        this.triangleBigMaterial.loadTexture('images/tangram.png');
        this.triangleBigMaterial.setTextureWrap('REPEAT', 'REPEAT');
        
        // Triangle Big 1 Material
        this.triangleBig1Material = new CGFappearance(this.scene);
        this.triangleBig1Material.setAmbient(0.1, 0.1, 0.1, 1);
        this.triangleBig1Material.setDiffuse(0.9, 0.9, 0.9, 1);
        this.triangleBig1Material.setSpecular(0.1, 0.1, 0.1, 1);
        this.triangleBig1Material.setShininess(10.0);
        this.triangleBig1Material.loadTexture('images/tangram.png');
        this.triangleBig1Material.setTextureWrap('REPEAT', 'REPEAT');
    }
>>>>>>> main
}

