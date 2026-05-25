import { CGFappearance, CGFobject } from '../lib/CGF.js';
import { MyQuad } from "./MyQuad.js";

export class MyUnitCubeQuad extends CGFobject {
    constructor(scene, top, front, right, back, left, bottom) {
        super(scene);
        
        this.quad = new MyQuad(this.scene);

        // Guardar as instâncias de CGFtexture passadas como parâmetro
        this.textures = {
            top: top,
            front: front,
            right: right,
            back: back,
            left: left,
            bottom: bottom
        };

        // Material único para aplicar as texturas
        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(0.1, 0.1, 0.1, 1);
        this.material.setDiffuse(0.9, 0.9, 0.9, 1);
        this.material.setSpecular(0.1, 0.1, 0.1, 1);
        this.material.setShininess(10.0);
    }

    display() {
        // Função auxiliar para evitar repetição de código do filtro
        const applyNearestFilter = () => {
            this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        };

        // Topo (+Y)
        this.scene.pushMatrix();
        this.scene.translate(0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.material.setTexture(this.textures.top);
        this.material.apply();
        applyNearestFilter();
        this.quad.display();
        this.scene.popMatrix();
        
        // Frente (+Z)
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 1);
        this.material.setTexture(this.textures.front);
        this.material.apply();
        applyNearestFilter();
        this.quad.display();
        this.scene.popMatrix();

        // Direita (+X)
        this.scene.pushMatrix();
        this.scene.translate(1, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.material.setTexture(this.textures.right);
        this.material.apply();
        applyNearestFilter();
        this.quad.display();
        this.scene.popMatrix();

        // Trás (-Z)
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -1);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.material.setTexture(this.textures.back);
        this.material.apply();
        applyNearestFilter();
        this.quad.display();
        this.scene.popMatrix();
        
        // Esquerda (-X)
        this.scene.pushMatrix();
        this.scene.translate(-1, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.material.setTexture(this.textures.left);
        this.material.apply();
        applyNearestFilter();
        this.quad.display();
        this.scene.popMatrix();

        // Fundo (-Y)
        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.material.setTexture(this.textures.bottom);
        this.material.apply();
        applyNearestFilter();
        this.quad.display();
        this.scene.popMatrix();
    }
}
