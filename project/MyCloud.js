import { CGFobject } from "../lib/CGF.js";

class MyCloudQuad extends CGFobject {
  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0,
      0.5, 0.5, 0.0,
      -0.5, 0.5, 0.0
    ];

    this.indices = [
      0, 1, 2,
      0, 2, 3
    ];

    this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ];

    this.texCoords = [
      0, 0,
      1, 0,
      1, 1,
      0, 1
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}

export class MyCloudLayer {
  constructor(scene, instances, shader) {
    this.scene = scene;
    this.instances = instances;
    this.shader = shader;
    this.quad = new MyCloudQuad(scene);
  }

  setInstances(instances) {
    this.instances = instances;
  }

  wrap(value, bounds) {
    const range = bounds * 2;
    let v = value + bounds;
    v = v - Math.floor(v / range) * range;
    return v - bounds;
  }

  display(time, camera, sunDirection, opacity, dirX, dirZ, movement, bounds) {
    if (!this.instances || !camera) return;

    const camPos = camera.position || [0, 0, 0];

    this.scene.setActiveShader(this.shader);
    this.shader.setUniformsValues({
      uTime: time,
      uSunDirection: sunDirection,
      uOpacity: opacity,
      uCloudColor: [1.0, 0.98, 0.92],
      uShadowColor: [0.62, 0.66, 0.7]
    });

    const cloudBounds = bounds || 180;

    for (const cloud of this.instances) {
      const offset = movement * cloud.speed;
      const cloudX = this.wrap(cloud.x + dirX * offset, cloudBounds);
      const cloudZ = this.wrap(cloud.z + dirZ * offset, cloudBounds);
      const cloudY = cloud.y;
      const cosR = Math.cos(cloud.rotation);
      const sinR = Math.sin(cloud.rotation);
      const forwardX = sinR;
      const forwardZ = cosR;

      for (const puff of cloud.puffs) {
        const ox = puff.offsetX * cloud.scaleX;
        const oz = puff.offsetZ * cloud.scaleZ;
        const px = cloudX + ox * cosR - oz * sinR + forwardX * puff.offsetD;
        const pz = cloudZ + ox * sinR + oz * cosR + forwardZ * puff.offsetD;
        const py = cloudY + puff.offsetY * cloud.scaleY;

        const facing = Math.atan2(camPos[0] - px, camPos[2] - pz);

        this.scene.pushMatrix();
        this.scene.translate(px, py, pz);
        this.scene.rotate(facing, 0, 1, 0);
        this.scene.rotate(puff.rotation || 0, 0, 0, 1);
        this.scene.scale(
          puff.scaleX * cloud.scaleX,
          puff.scaleY * cloud.scaleY,
          1.0
        );

        this.shader.setUniformsValues({
          uPuffSeed: puff.seed,
          uPuffOpacity: puff.opacity
        });

        this.quad.display();
        this.scene.popMatrix();
      }
    }

    this.scene.setActiveShader(this.scene.defaultShader);
  }
}
