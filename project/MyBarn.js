import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyFence } from "./MyFence.js";
import { MyHayFields } from "./MyHayField.js";
import { MyDropZone } from "./MyDropZone.js";

export class MyBarn extends CGFobject {
  constructor(scene) {
    super(scene);
    
    // 1. Componentes estruturais tridimensionais
    this.barnBody = new MyBarnBody(scene);
    this.barnRoof = new MyBarnRoof(scene);
    this.rectQuad = new MyUnitQuad(scene);
    
    // Componentes modulares externos isolados
    this.fenceComponent = new MyFence(scene);
    
    const depth = 5.0;
    const diagonalZ = 2.5;
    
    this.hayFields = new MyHayFields(scene, diagonalZ);
    this.dropZoneContainer = new MyDropZone(scene, 0, depth / 2 + 3.8, 2.2, 32, 5);

    // Caminho adaptativo de entrada de terra (Frente da porta)
    this.entrancePatch = new MyAdaptivePlane(scene, 0, (depth / 2 + 0.65), 2.2, 1.3, 8, 8);

    // =========================================================================
    // CORREÇÃO: Carregar a textura "dirt_diffuse.jpg" no material de terra!
    // =========================================================================
    this.dirtMaterial = new CGFappearance(scene);
    this.dirtMaterial.setAmbient(0.42, 0.32, 0.22, 1.0);
    this.dirtMaterial.setDiffuse(0.55, 0.44, 0.33, 1.0);
    this.dirtMaterial.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.dirtMaterial.loadTexture("images/textures/dirt_diffuse.jpg"); // Ativa a imagem de terra
    this.dirtMaterial.setTextureWrap("REPEAT", "REPEAT");

    // Material do Telhado Escurecido com Textura
    this.whiteRoofMaterial = new CGFappearance(scene);
    this.whiteRoofMaterial.setAmbient(0.50, 0.50, 0.50, 1.0); 
    this.whiteRoofMaterial.setDiffuse(0.58, 0.58, 0.58, 1.0); 
    this.whiteRoofMaterial.setSpecular(0.05, 0.05, 0.05, 1.0);
    this.whiteRoofMaterial.setShininess(5.0);
    this.whiteRoofMaterial.loadTexture("images/textures/roof_diffuse.jpg"); 
    this.whiteRoofMaterial.setTextureWrap("REPEAT", "REPEAT");
  }

  display(materials, isWagonInDropZone) {
    // Forçar visibilidade total de dupla face em todas as primitivas do celeiro
    this.scene.gl.disable(this.scene.gl.CULL_FACE);

    const width = 4.0; 
    const depth = 5.0;
    const barnBaseY = this.scene.getGroundY(0, 0);

    // 1. Renderização de envolvente (Terra, Feno e Cercas)
    this.dirtMaterial.apply();
    this.entrancePatch.display();
    this.hayFields.display(barnBaseY);

    this.fenceComponent.displayLine(2.2, -1.3, 8.1, -1.3, barnBaseY);
    this.fenceComponent.displayLine(8.1, -1.3, 8.1, 6.2, barnBaseY);
    this.fenceComponent.displayLine(8.1, 6.2, 2.2, 6.2, barnBaseY);

    // 2. CORPO PRINCIPAL DO CELEIRO VERMELHO (Com alicerce embutido)
    if (materials.barnRed) materials.barnRed.apply();
    this.scene.pushMatrix();
    this.barnBody.display();
    this.scene.popMatrix();

    // 3. TELHADO: Com a textura ativa e tonalidade escurecida
    this.whiteRoofMaterial.apply();
    this.scene.pushMatrix();
    this.barnRoof.display();
    this.scene.popMatrix();

    // 4. ADORNOS E JANELAS DA FACHADA FRONTAL (Começam em Y=0 para alinhar com o chão)
    const frontZ = depth / 2 + 0.01;

    // Moldura Branca das Portas
    if (materials.trimWhite) materials.trimWhite.apply();
    this.scene.pushMatrix();
    this.scene.translate(0, 0.65, frontZ);
    this.scene.scale(1.8, 1.3, 1.0);
    this.rectQuad.display();
    this.scene.popMatrix();

    // Porta Esquerda com Cruzeta em "X"
    if (materials.barnRed) materials.barnRed.apply();
    this.scene.pushMatrix();
    this.scene.translate(-0.42, 0.65, frontZ + 0.01);
    this.scene.scale(0.7, 1.15, 1.0);
    this.rectQuad.display();
    this.scene.popMatrix();

    if (materials.trimWhite) materials.trimWhite.apply();
    this.scene.pushMatrix();
    this.scene.translate(-0.42, 0.65, frontZ + 0.02);
    this.scene.rotate(0.55, 0, 0, 1);
    this.scene.scale(0.11, 1.25, 1.0);
    this.rectQuad.display();
    this.scene.popMatrix();
    this.scene.pushMatrix();
    this.scene.translate(-0.42, 0.65, frontZ + 0.02);
    this.scene.rotate(-0.55, 0, 0, 1);
    this.scene.scale(0.11, 1.25, 1.0);
    this.rectQuad.display();
    this.scene.popMatrix();

    // Porta Direito com Cruzeta em "X"
    if (materials.barnRed) materials.barnRed.apply();
    this.scene.pushMatrix();
    this.scene.translate(0.42, 0.65, frontZ + 0.01);
    this.scene.scale(0.7, 1.15, 1.0);
    this.rectQuad.display();
    this.scene.popMatrix();

    if (materials.trimWhite) materials.trimWhite.apply();
    this.scene.pushMatrix();
    this.scene.translate(0.42, 0.65, frontZ + 0.02);
    this.scene.rotate(0.55, 0, 0, 1);
    this.scene.scale(0.11, 1.25, 1.0);
    this.rectQuad.display();
    this.scene.popMatrix();
    this.scene.pushMatrix();
    this.scene.translate(0.42, 0.65, frontZ + 0.02);
    this.scene.rotate(-0.55, 0, 0, 1);
    this.scene.scale(0.11, 1.25, 1.0);
    this.rectQuad.display();
    this.scene.popMatrix();

    // Janela do Sótão Superior
    this.scene.pushMatrix();
    this.scene.translate(0, 2.7, frontZ); 
    this.scene.scale(0.7, 0.7, 1.0);
    this.rectQuad.display();
    this.scene.popMatrix();

    if (materials.windowBlue) materials.windowBlue.apply();
    this.scene.pushMatrix();
    this.scene.translate(0, 2.7, frontZ + 0.01); 
    this.scene.scale(0.58, 0.58, 1.0);
    this.rectQuad.display();
    this.scene.popMatrix();

    if (materials.trimWhite) materials.trimWhite.apply();
    this.scene.pushMatrix();
    this.scene.translate(0, 2.7, frontZ + 0.015);
    this.scene.scale(0.06, 0.58, 1.0);
    this.rectQuad.display();
    this.scene.popMatrix();
    this.scene.pushMatrix();
    this.scene.translate(0, 2.7, frontZ + 0.015);
    this.scene.scale(0.58, 0.06, 1.0);
    this.rectQuad.display();
    this.scene.popMatrix();

    // Duas Janelas Frontais Inferiores
    const frontWinLocations = [-1.3, 1.3];
    for (const winX of frontWinLocations) {
      if (materials.trimWhite) materials.trimWhite.apply();
      this.scene.pushMatrix(); 
      this.scene.translate(winX, 0.65, frontZ);
      this.scene.scale(0.55, 0.55, 1.0);
      this.rectQuad.display();
      this.scene.popMatrix();

      if (materials.windowBlue) materials.windowBlue.apply();
      this.scene.pushMatrix(); 
      this.scene.translate(winX, 0.65, frontZ + 0.01);
      this.scene.scale(0.43, 0.43, 1.0);
      this.rectQuad.display();
      this.scene.popMatrix();

      if (materials.trimWhite) materials.trimWhite.apply();
      this.scene.pushMatrix(); 
      this.scene.translate(winX, 0.65, frontZ + 0.015);
      this.scene.scale(0.05, 0.43, 1.0);
      this.rectQuad.display();
      this.scene.popMatrix();
      this.scene.pushMatrix(); 
      this.scene.translate(winX, 0.65, frontZ + 0.015);
      this.scene.scale(0.43, 0.05, 1.0);
      this.rectQuad.display();
      this.scene.popMatrix();
    }

    // Janelas Laterais Harmonizadas
    const windowSpacing = 1.1;
    const wallXOffset = width / 2;

    for (let i = -1; i <= 1; i++) {
      if (materials.trimWhite) materials.trimWhite.apply();
      this.scene.pushMatrix(); 
      this.scene.translate(wallXOffset + 0.01, 1.1, i * windowSpacing);
      this.scene.rotate(Math.PI / 2, 0, 1, 0);
      this.scene.scale(0.55, 0.65, 1.0);
      this.rectQuad.display();
      this.scene.popMatrix();

      if (materials.windowBlue) materials.windowBlue.apply();
      this.scene.pushMatrix(); 
      this.scene.translate(wallXOffset + 0.02, 1.1, i * windowSpacing);
      this.scene.rotate(Math.PI / 2, 0, 1, 0);
      this.scene.scale(0.43, 0.52, 1.0);
      this.rectQuad.display();
      this.scene.popMatrix();

      if (materials.trimWhite) materials.trimWhite.apply();
      this.scene.pushMatrix(); 
      this.scene.translate(wallXOffset + 0.025, 1.1, i * windowSpacing);
      this.scene.rotate(Math.PI / 2, 0, 1, 0);
      this.scene.scale(0.05, 0.52, 1.0);
      this.rectQuad.display();
      this.scene.popMatrix();
      this.scene.pushMatrix(); 
      this.scene.translate(wallXOffset + 0.025, 1.1, i * windowSpacing);
      this.scene.rotate(Math.PI / 2, 0, 1, 0);
      this.scene.scale(0.43, 0.05, 1.0);
      this.rectQuad.display();
      this.scene.popMatrix();

      if (materials.trimWhite) materials.trimWhite.apply();
      this.scene.pushMatrix(); 
      this.scene.translate(-wallXOffset - 0.01, 1.1, i * windowSpacing);
      this.scene.rotate(-Math.PI / 2, 0, 1, 0);
      this.scene.scale(0.55, 0.65, 1.0);
      this.rectQuad.display();
      this.scene.popMatrix();

      if (materials.windowBlue) materials.windowBlue.apply();
      this.scene.pushMatrix(); 
      this.scene.translate(-wallXOffset - 0.02, 1.1, i * windowSpacing);
      this.scene.rotate(-Math.PI / 2, 0, 1, 0);
      this.scene.scale(0.43, 0.52, 1.0);
      this.rectQuad.display();
      this.scene.popMatrix();

      if (materials.trimWhite) materials.trimWhite.apply();
      this.scene.pushMatrix(); 
      this.scene.translate(-wallXOffset - 0.025, 1.1, i * windowSpacing);
      this.scene.rotate(-Math.PI / 2, 0, 1, 0);
      this.scene.scale(0.05, 0.52, 1.0);
      this.rectQuad.display();
      this.scene.popMatrix();
      this.scene.pushMatrix(); 
      this.scene.translate(-wallXOffset - 0.025, 1.1, i * windowSpacing);
      this.scene.rotate(-Math.PI / 2, 0, 1, 0);
      this.scene.scale(0.43, 0.05, 1.0);
      this.rectQuad.display();
      this.scene.popMatrix();
    }

    // CORREÇÃO: Chamada limpa e única para o componente autónomo da DropZone
    this.dropZoneContainer.display();

    this.scene.gl.enable(this.scene.gl.CULL_FACE);
  }
}

class MyBarnBody extends CGFobject {
  constructor(scene) { super(scene); this.initBuffers(); }
  initBuffers() {
    this.vertices = [
      -2.0,  -1.0, 2.5,   2.0,  -1.0, 2.5,   2.0, 1.8, 2.5,  -2.0, 1.8, 2.5, 
       1.5,   3.5, 2.5,  -1.5,   3.5, 2.5,   0.0, 4.32, 2.5,
      -2.0,  -1.0,-2.5,   2.0,  -1.0,-2.5,   2.0, 1.8,-2.5,  -2.0, 1.8,-2.5, 
       1.5,   3.5,-2.5,  -1.5,   3.5,-2.5,   0.0, 4.32,-2.5,
       2.0,  -1.0, 2.5,   2.0,  -1.0,-2.5,   2.0, 1.8,-2.5,   2.0, 1.8, 2.5,
      -2.0,  -1.0,-2.5,  -2.0,  -1.0, 2.5,  -2.0, 1.8, 2.5,  -2.0, 1.8,-2.5
    ];
    this.indices = [
      0, 1, 2,    0, 2, 3,    3, 2, 4,    3, 4, 5,    5, 4, 6,
      7, 9, 8,    7, 10, 9,   10, 11, 9,  10, 12, 11, 12, 13, 11,
      14, 15, 16, 14, 16, 17,
      18, 19, 20, 18, 20, 21
    ];
    this.normals = [
      0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,
      0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
      1,0,0, 1,0,0, 1,0,0, 1,0,0,  
     -1,0,0, -1,0,0, -1,0,0, -1,0,0
    ];
    this.texCoords = [
      0.0,0.0, 1.0,0.0, 1.0,0.53, 0.0,0.53, 0.85,0.85, 0.15,0.85, 0.5,1.0,
      0.0,0.0, 1.0,0.0, 1.0,0.53, 0.0,0.53, 0.85,0.85, 0.15,0.85, 0.5,1.0,
      0,0, 1,0, 1,1, 0,1,  
      0,0, 1,0, 1,1, 0,1
    ];
    this.primitiveType = this.scene.gl.TRIANGLES; this.initGLBuffers();
  }
}

class MyBarnRoof extends CGFobject {
  constructor(scene) { super(scene); this.initBuffers(); }
  initBuffers() {
    this.vertices = [
       2.45, 1.85, 2.7,  
       1.55, 3.55, 2.7,  
       0.0,  4.40, 2.7,  
      -1.55, 3.55, 2.7,  
      -2.45, 1.85, 2.7,  
       2.35, 1.70, 2.7,  
       1.45, 3.40, 2.7,  
       0.0,  4.25, 2.7,  
      -1.45, 3.40, 2.7,  
      -2.35, 1.70, 2.7,  

       2.45, 1.85, -2.7, 
       1.55, 3.55, -2.7, 
       0.0,  4.40, -2.7, 
      -1.55, 3.55, -2.7, 
      -2.45, 1.85, -2.7, 
       2.35, 1.70, -2.7, 
       1.45, 3.40, -2.7, 
       0.0,  4.25, -2.7, 
      -1.45, 3.40, -2.7, 
      -2.35, 1.70, -2.7  
    ];
    this.indices = [
      0, 10, 11,   0, 11, 1,   1, 11, 12,   1, 12, 2,   2, 12, 13,   2, 13, 3,   3, 13, 14,   3, 14, 4,
      5, 6, 16,    5, 16, 15,  6, 7, 17,    6, 17, 16,  7, 8, 18,    7, 18, 17,  8, 9, 19,    8, 19, 18,
      5, 0, 1,     5, 1, 6,    6, 1, 2,     6, 2, 7,    7, 2, 3,     7, 3, 8,    8, 3, 4,     8, 4, 9,
      15, 16, 11,  15, 11, 10, 16, 17, 12,  16, 12, 11, 17, 18, 13,  17, 13, 12, 18, 19, 14,  18, 14, 13,
      5, 15, 10,   5, 10, 0,   4, 14, 19,   4, 19, 9
    ];
    this.normals = [];
    for (let i = 0; i < this.vertices.length; i++) { this.normals.push(0, 1, 0); }
    
    this.texCoords = [
      1.0, 0.0,  0.75, 0.0,  0.5, 0.0,  0.25, 0.0,  0.0, 0.0,
      1.0, 0.0,  0.75, 0.0,  0.5, 0.0,  0.25, 0.0,  0.0, 0.0,
      1.0, 1.0,  0.75, 1.0,  0.5, 1.0,  0.25, 1.0,  0.0, 1.0,
      1.0, 1.0,  0.75, 1.0,  0.5, 1.0,  0.25, 1.0,  0.0, 1.0
    ];
    
    this.primitiveType = this.scene.gl.TRIANGLES; this.initGLBuffers();
  }
}

class MyAdaptivePlane extends CGFobject {
  constructor(scene, centerX, centerZ, width, depth, xDivs, zDivs) {
    super(scene);
    this.centerX = centerX; this.centerZ = centerZ;
    this.width = width; this.depth = depth;
    this.xDivs = xDivs; this.zDivs = zDivs;
    this.initBuffers();
  }
  initBuffers() {
    this.vertices = []; this.indices = []; this.normals = []; this.texCoords = [];
    const xStep = this.width / this.xDivs; const zStep = this.depth / this.zDivs;
    const barnBaseY = this.scene.getGroundY(0, 0);
    
    for (let j = 0; j <= this.zDivs; j++) {
      const localZ = this.centerZ - (this.depth / 2) + (j * zStep);
      for (let i = 0; i <= this.xDivs; i++) {
        const localX = this.centerX - (this.width / 2) + (i * xStep);
        const localY = this.scene.getGroundY(localX, -4.0 + localZ, 0.025) - barnBaseY;
        this.vertices.push(localX, localY, localZ); 
        this.normals.push(0, 1, 0);
        this.texCoords.push(i / this.xDivs, j / this.zDivs);
      }
    }
    
    const numVertsX = this.xDivs + 1;
    for (let j = 0; j < this.zDivs; j++) {
      for (let i = 0; i < this.xDivs; i++) {
        const topLeft = j * numVertsX + i; 
        const topRight = topLeft + 1;
        const bottomLeft = (j + 1) * numVertsX + i; 
        const bottomRight = bottomLeft + 1;
        
        this.indices.push(topLeft, bottomLeft, topRight); 
        this.indices.push(topRight, bottomLeft, bottomRight);
      }
    }
    this.primitiveType = this.scene.gl.TRIANGLES; this.initGLBuffers();
  }
}

class MyUnitQuad extends CGFobject {
  constructor(scene) { super(scene); this.initBuffers(); }
  initBuffers() {
    this.vertices = [-0.5,-0.5,0,  0.5,-0.5,0,  0.5,0.5,0, -0.5,0.5,0];
    this.indices = [0,1,2, 0,2,3]; this.normals = [0,0,1, 0,0,1, 0,0,1, 0,0,1];
    this.texCoords = [0,1, 1,1, 1,0, 0,0];
    this.primitiveType = this.scene.gl.TRIANGLES; this.initGLBuffers();
  }
}