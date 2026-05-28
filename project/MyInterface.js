import { CGFinterface, dat } from "../lib/CGF.js";

export class MyInterface extends CGFinterface {
    constructor() {
        super();
        this.isDraggingChaseCamera = false;
        this.lastMouseX = 0;
        this.chaseDragSensitivity = 0.008;
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
        
        this.initGameplayHUD();

        window.addEventListener("keydown", (event) => this.handleKey(event, true), true);
        window.addEventListener("keyup", (event) => this.handleKey(event, false), true);
        this.initChaseCameraDrag(application);

        const cloudFolder = this.gui.addFolder("Clouds");
        cloudFolder.add(this.scene, "enableClouds").name("Enable Clouds");
        cloudFolder.add(this.scene, "cloudSpeed", 0.05, 1.5).name("Cloud Speed");
        cloudFolder.add(this.scene, "cloudOpacity", 0.45, 0.9).name("Cloud Opacity");
        cloudFolder.add(this.scene, "cloudCount", 6, 24, 1)
            .name("Cloud Count")
            .onFinishChange(() => this.scene.initCloudSystem());

        return true;
    }

    initChaseCameraDrag(application) {
        const canvas = application?.gl?.canvas;
        if (!canvas) return;

        canvas.addEventListener("mousedown", (event) => {
            if (event.button !== 0 || this.scene.firstPersonCamera) return;
            this.isDraggingChaseCamera = true;
            this.lastMouseX = event.clientX;
            canvas.style.cursor = "grabbing";
            this.captureEvent(event);
        }, true);

        window.addEventListener("mousemove", (event) => {
            if (!this.isDraggingChaseCamera || this.scene.firstPersonCamera) return;

            const deltaX = event.clientX - this.lastMouseX;
            this.lastMouseX = event.clientX;
            this.scene.chaseOrbitAngle += deltaX * this.chaseDragSensitivity;
            this.captureEvent(event);
        }, true);

        window.addEventListener("mouseup", (event) => {
            if (!this.isDraggingChaseCamera || event.button !== 0) return;
            this.isDraggingChaseCamera = false;
            canvas.style.cursor = "";
            this.captureEvent(event);
        }, true);

        window.addEventListener("blur", () => {
            this.isDraggingChaseCamera = false;
            canvas.style.cursor = "";
        });
    }

    initGameplayHUD() {
        const existing = document.getElementById("gameplay-hud-container");
        if (existing) existing.remove();

        this.hudContainer = document.createElement("div");
        this.hudContainer.id = "gameplay-hud-container";
        this.hudContainer.style.position = 'absolute';
        this.hudContainer.style.top = '0';
        this.hudContainer.style.left = '0';
        this.hudContainer.style.width = '100vw';
        this.hudContainer.style.height = '100vh';
        this.hudContainer.style.pointerEvents = 'none'; 
        this.hudContainer.style.fontFamily = 'Arial, sans-serif';
        this.hudContainer.style.zIndex = '999';

        this.hudContainer.innerHTML = `
            <div id="start-screen" style="position: absolute; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; flex-direction: column; justify-content: center; align-items: center; pointer-events: auto;">
                <h1 style="color: white; font-size: 60px; margin-bottom: 20px; text-shadow: 2px 2px 4px black;">Wagon Trail</h1>
                <p style="color: lightgray; font-size: 20px; margin-bottom: 40px;">Drive the wagon. Don't run out of health!</p>
                <button id="start-btn" style="padding: 15px 40px; font-size: 24px; cursor: pointer; background: #4CAF50; color: white; border: none; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">START GAME</button>
            </div>

            <div id="hud-screen" style="position: absolute; top: 20px; left: 20px; display: none; background: rgba(0,0,0,0.6); padding: 15px; border-radius: 10px; border: 2px solid rgba(255,255,255,0.2); box-shadow: 0 4px 8px rgba(0,0,0,0.5);">
                
                <div style="color: #FFD700; font-size: 26px; font-weight: bold; margin-bottom: 5px; text-shadow: 2px 2px 2px black;">
                    Score: <span id="score-text">0</span>
                </div>

                <div style="color: #66b3ff; font-size: 16px; font-weight: bold; margin-bottom: 5px; text-shadow: 1px 1px 2px black;">
                    Wagon Cargo: <span id="cargo-text">0 / 3</span> Bales
                </div>
                <div style="color: #ffcc66; font-size: 16px; font-weight: bold; margin-bottom: 15px; text-shadow: 1px 1px 2px black;">
                    Delivered to Barn: <span id="delivered-text">0</span> Bales
                </div>
                
                <div style="color: white; font-size: 18px; font-weight: bold; margin-bottom: 5px; text-shadow: 1px 1px 2px black;">
                    Health: <span id="hp-text">100 / 100 HP</span>
                </div>
                <div style="width: 250px; height: 25px; background: rgba(0,0,0,0.8); border: 2px solid white; border-radius: 12px; overflow: hidden; margin-bottom: 15px;">
                    <div id="hp-bar" style="width: 100%; height: 100%; background: linear-gradient(90deg, #cc0000, #ff4444); transition: width 0.2s linear;"></div>
                </div>

                <div style="font-size: 16px; font-weight: bold; text-shadow: 1px 1px 2px black;">
                    <div style="color: #ff6666; margin-bottom: 5px;">Total Damage Taken: <span id="dmg-text">-0.0</span></div>
                    <div style="color: #66ff66;">Total Health Restored: <span id="heal-text">+0.0</span></div>
                </div>
            </div>

            <div id="game-over-screen" style="position: absolute; width: 100%; height: 100%; background: rgba(100,0,0,0.85); display: none; flex-direction: column; justify-content: center; align-items: center; pointer-events: auto;">
                <h1 style="color: white; font-size: 70px; margin-bottom: 10px; text-shadow: 2px 2px 4px black;">GAME OVER</h1>
                <h2 style="color: lightgray; font-size: 30px; margin-bottom: 40px;">The horses are too tired to continue!</h2>
                <button id="restart-btn" style="padding: 15px 40px; font-size: 24px; cursor: pointer; background: #2196F3; color: white; border: none; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">PLAY AGAIN</button>
            </div>
        `;
        document.body.appendChild(this.hudContainer);

        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.startGame());
    }

    startGame() {
        if (!this.scene) return;
        
        this.scene.gameStatus = "Running";
        this.scene.currentHealthPoints = this.scene.maxHealthPoints;
        this.scene.scoreTime = 0;
        this.totalDamageTaken = 0;
        this.totalHealthRestored = 0;

        this.scene.wagonPosition = { x: 10, z: 10 };
        this.scene.wagonHeading = Math.PI;
        this.scene.wagonSpeed = 0;
        this.scene.wagonSteering = 0;
        this.scene.wagonWheelAngle = 0;
        
        this.scene.balesAtBarn = 0;
        this.scene.carriedHayCount = 0;

        this.scene.updateGameplayLabels();
        this.updateGameplayHUD();

        if (this.scene.initHayPickups) {
            this.scene.initHayPickups();
        }
    }

    updateGameplayHUD() {
        if (!this.hudContainer || !this.scene) return;

        const startScreen = document.getElementById("start-screen");
        const gameOverScreen = document.getElementById("game-over-screen");
        const hud = document.getElementById("hud-screen");

        if (this.scene.gameStatus === "START") {
            if (startScreen) startScreen.style.display = "flex";
            if (gameOverScreen) gameOverScreen.style.display = "none";
            if (hud) hud.style.display = "none";
            return; 
        } else if (this.scene.gameStatus === "HP Depleted" || this.scene.gameStatus === "GAMEOVER") {
            if (startScreen) startScreen.style.display = "none";
            if (gameOverScreen) gameOverScreen.style.display = "flex";
            if (hud) hud.style.display = "none";
            return;
        } else {
            if (startScreen) startScreen.style.display = "none";
            if (gameOverScreen) gameOverScreen.style.display = "none";
            if (hud) hud.style.display = "block";
        }

        const healthPercent = Math.max(0, Math.min(100, this.scene.healthPercent || 0));
        
        // Target your exact IDs from the HTML string
        const fill = document.getElementById('hp-bar');
        const hpLabel = document.getElementById('hp-text');
        const score = document.getElementById('score-text');
        const damage = document.getElementById('dmg-text');
        const restored = document.getElementById('heal-text');

        if (fill) {
            fill.style.width = `${healthPercent}%`;
        }
        if (hpLabel) hpLabel.textContent = this.scene.healthLabel || "100.0 / 100 HP";
        if (score) score.textContent = this.scene.scoreLabel || "0";
        if (damage) damage.textContent = `-${Number(this.scene.totalDamageTaken || 0).toFixed(1)}`;
        if (restored) restored.textContent = `+${Number(this.scene.totalHealthRestored || 0).toFixed(1)}`;

        if (score) score.textContent = this.scene.scoreLabel || "0";
        if (damage) damage.textContent = `-${Number(this.scene.totalDamageTaken || 0).toFixed(1)}`;
        if (restored) restored.textContent = `+${Number(this.scene.totalHealthRestored || 0).toFixed(1)}`;

        const cargoText = document.getElementById('cargo-text');
        const deliveredText = document.getElementById('delivered-text');
        
        if (cargoText) {
            cargoText.textContent = `${this.scene.carriedHayCount} / ${this.scene.maxCarriedHay}`;
        }
        if (deliveredText) {
            deliveredText.textContent = this.scene.balesAtBarn;
        }
    }

    update() {
        super.update();
        this.updateGameplayHUD();
    }

    handleKey(event, pressed) {
        if (!this.scene?.wagonInput) return false;

        if (this.scene.gameStatus !== "Running") return false;

        if (pressed && event.code === "KeyC") {
            this.captureEvent(event);
            this.scene.firstPersonCamera = !this.scene.firstPersonCamera;
            this.firstPersonController?.updateDisplay();
            document.activeElement?.blur();
            return true;
        }

        const keyMap = {
            KeyW: "forward",
            KeyA: "left",
            KeyD: "right"
        };
        const action = keyMap[event.code];

        if (action) {
            this.captureEvent(event);
            this.scene.wagonInput[action] = pressed;
            return true;
        }

        if (event.code === "KeyS"){
            this.captureEvent(event);
            this.scene.wagonInput.braking = pressed;
            return true;
        }
        
        return false;
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