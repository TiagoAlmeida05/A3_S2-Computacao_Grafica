
import {CGFapplication} from '../lib/CGF.js';
import { MyScene } from './MyScene.js';
import { MyInterface } from './MyInterface.js';

function main()
{
    var app = new CGFapplication(document.body);
    var myScene = new MyScene();
    var myInterface = new MyInterface();

    app.init();

    setTimeout(() => {
        const canvas = document.querySelector("canvas");
        if (!canvas) return;

        canvas.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            console.log("WebGL context lost");
        }, false);

        canvas.addEventListener("webglcontextrestored", () => {
            console.log("WebGL context restored");
        }, false);
    }, 0);

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

    app.run();
}

main();
