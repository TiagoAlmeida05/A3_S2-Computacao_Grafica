import { CGFinterface, dat } from "../lib/CGF.js";

export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        super.init(application);

        this.gui = new dat.GUI();

        this.gui.add(this.scene, "displayPlane").name("Display Plane");
        this.gui.add(this.scene, "enableWind").name("Wind");
        this.gui.add(this.scene, "scaleFactor", 0.1, 5).name("Scale Factor");

        const cloudFolder = this.gui.addFolder("Clouds");
        cloudFolder.add(this.scene, "enableClouds").name("Enable Clouds");
        cloudFolder.add(this.scene, "cloudSpeed", 0.05, 1.5).name("Cloud Speed");
        cloudFolder.add(this.scene, "cloudOpacity", 0.45, 0.9).name("Cloud Opacity");
        cloudFolder.add(this.scene, "cloudCount", 6, 24, 1)
            .name("Cloud Count")
            .onFinishChange(() => this.scene.initCloudSystem());

        return true;
    }

    processKeyDown(event) {
        if (!this.scene?.cameraMove) return;
        if (event.code === "KeyW") this.scene.cameraMove.forward = true;
        if (event.code === "KeyS") this.scene.cameraMove.backward = true;
    }

    processKeyUp(event) {
        if (!this.scene?.cameraMove) return;
        if (event.code === "KeyW") this.scene.cameraMove.forward = false;
        if (event.code === "KeyS") this.scene.cameraMove.backward = false;
    }
}
