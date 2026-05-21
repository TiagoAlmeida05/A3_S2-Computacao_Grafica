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
        this.firstPersonController = this.gui.add(this.scene, "firstPersonCamera")
            .name("First Person Camera")
            .onChange(() => document.activeElement?.blur());
        this.gui.add(this.scene, "scaleFactor", 0.1, 5).name("Scale Factor");

        window.addEventListener("keydown", (event) => this.handleKey(event, true), true);
        window.addEventListener("keyup", (event) => this.handleKey(event, false), true);

        const cloudFolder = this.gui.addFolder("Clouds");
        cloudFolder.add(this.scene, "enableClouds").name("Enable Clouds");
        cloudFolder.add(this.scene, "cloudSpeed", 0.05, 1.5).name("Cloud Speed");
        cloudFolder.add(this.scene, "cloudOpacity", 0.45, 0.9).name("Cloud Opacity");
        cloudFolder.add(this.scene, "cloudCount", 6, 24, 1)
            .name("Cloud Count")
            .onFinishChange(() => this.scene.initCloudSystem());

        return true;
    }

    handleKey(event, pressed) {
        if (!this.scene?.wagonInput) return false;

        if (pressed && event.code === "KeyC") {
            this.captureEvent(event);
            this.scene.firstPersonCamera = !this.scene.firstPersonCamera;
            this.firstPersonController?.updateDisplay();
            document.activeElement?.blur();
            return true;
        }

        const keyMap = {
            KeyW: "forward",
            KeyS: "backward",
            KeyA: "left",
            KeyD: "right"
        };
        const action = keyMap[event.code];
        if (!action) return false;

        this.captureEvent(event);
        this.scene.wagonInput[action] = pressed;
        return true;
    }

    captureEvent(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    processKeyDown(event) {
        this.handleKey(event, true);
    }

    processKeyUp(event) {
        this.handleKey(event, false);
    }
}
