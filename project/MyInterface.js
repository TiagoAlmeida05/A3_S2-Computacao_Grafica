import {CGFinterface, dat} from '../lib/CGF.js';

export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        super.init(application);
        
        this.gui = new dat.GUI();

        this.gui.add(this.scene, 'displayAxis').name('Display Axis');
        this.gui.add(this.scene, 'displayPlane').name('Display Plane');
        this.gui.add(this.scene, 'enableWind').name('Wind');

        this.gui.add(this.scene, 'scaleFactor', 0.1, 5).name('Scale Factor');

        return true;
    }

    processKeyDown(event) {
        if (!this.scene?.cameraMove) return;
        if (event.code === 'KeyW') this.scene.cameraMove.forward = true;
        if (event.code === 'KeyS') this.scene.cameraMove.backward = true;
    }

    processKeyUp(event) {
        if (!this.scene?.cameraMove) return;
        if (event.code === 'KeyW') this.scene.cameraMove.forward = false;
        if (event.code === 'KeyS') this.scene.cameraMove.backward = false;
    }
}
