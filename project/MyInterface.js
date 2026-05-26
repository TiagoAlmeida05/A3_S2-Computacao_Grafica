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
        this.initGameplayUIFolder();
        this.initGameplayHUD();

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

    initGameplayUIFolder() {
        const gameplayFolder = this.gui.addFolder("Gameplay UI");
        this.readOnlyControllers = [
            gameplayFolder.add(this.scene, "healthLabel").name("Current HP").listen(),
            gameplayFolder.add(this.scene, "healthPercent", 0, 100).name("HP Bar (%)").listen(),
            gameplayFolder.add(this.scene, "instantDamageHp").name("Collision Damage").listen(),
            gameplayFolder.add(this.scene, "instantRestoredHp").name("Restored HP").listen(),
            gameplayFolder.add(this.scene, "balesAtBarn").name("Bales at Barn").listen(),
            gameplayFolder.add(this.scene, "scoreLabel").name("Score").listen(),
            gameplayFolder.add(this.scene, "gameStatus").name("Status").listen()
        ];

        for (const controller of this.readOnlyControllers) {
            controller.domElement.style.pointerEvents = "none";
            controller.domElement.style.opacity = "0.82";
        }

        gameplayFolder.open();
    }

    initGameplayHUD() {
        const existing = document.getElementById("gameplay-hud");
        if (existing) existing.remove();

        const style = document.createElement("style");
        style.id = "gameplay-hud-style";
        style.textContent = `
            #gameplay-hud {
                position: fixed;
                top: 18px;
                left: 18px;
                width: min(360px, calc(100vw - 36px));
                color: #f8faf8;
                font-family: Arial, Helvetica, sans-serif;
                pointer-events: none;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
                z-index: 10;
            }
            #gameplay-hud .hud-row {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                gap: 12px;
                margin-bottom: 8px;
            }
            #gameplay-hud .hud-title {
                font-size: 13px;
                font-weight: 700;
                letter-spacing: 0;
                text-transform: uppercase;
            }
            #gameplay-hud .hud-value {
                font-size: 15px;
                font-weight: 700;
            }
            #gameplay-hud .health-track {
                height: 18px;
                border: 1px solid rgba(255, 255, 255, 0.58);
                background: rgba(18, 23, 20, 0.58);
                box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.35);
            }
            #gameplay-hud .health-fill {
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, #5fd46b, #c8e35b);
                transition: width 160ms linear, background 160ms linear;
            }
            #gameplay-hud .hud-metrics {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 8px;
                margin-top: 10px;
            }
            #gameplay-hud .hud-metric {
                min-width: 0;
                padding: 7px 8px;
                background: rgba(18, 23, 20, 0.62);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            #gameplay-hud .hud-metric-label {
                display: block;
                font-size: 10px;
                color: rgba(248, 250, 248, 0.72);
            }
            #gameplay-hud .hud-metric-value {
                display: block;
                margin-top: 2px;
                font-size: 14px;
                font-weight: 700;
                white-space: nowrap;
            }
        `;

        const previousStyle = document.getElementById("gameplay-hud-style");
        if (previousStyle) previousStyle.remove();
        document.head.appendChild(style);

        this.hud = document.createElement("div");
        this.hud.id = "gameplay-hud";
        this.hud.innerHTML = `
            <div class="hud-row">
                <span class="hud-title">Wagon HP</span>
                <span class="hud-value" data-hud="hpLabel">100 / 100 HP</span>
            </div>
            <div class="health-track">
                <div class="health-fill" data-hud="hpFill"></div>
            </div>
            <div class="hud-metrics">
                <span class="hud-metric">
                    <span class="hud-metric-label">Score</span>
                    <span class="hud-metric-value" data-hud="score">0</span>
                </span>
                <span class="hud-metric">
                    <span class="hud-metric-label">Damage</span>
                    <span class="hud-metric-value" data-hud="damage">0 HP</span>
                </span>
                <span class="hud-metric">
                    <span class="hud-metric-label">Restored</span>
                    <span class="hud-metric-value" data-hud="restored">0 HP</span>
                </span>
            </div>
        `;
        document.body.appendChild(this.hud);
        this.updateGameplayHUD();
    }

    updateGameplayHUD() {
        if (!this.hud || !this.scene) return;

        const healthPercent = Math.max(0, Math.min(100, this.scene.healthPercent || 0));
        const fill = this.hud.querySelector('[data-hud="hpFill"]');
        const hpLabel = this.hud.querySelector('[data-hud="hpLabel"]');
        const score = this.hud.querySelector('[data-hud="score"]');
        const damage = this.hud.querySelector('[data-hud="damage"]');
        const restored = this.hud.querySelector('[data-hud="restored"]');

        if (fill) {
            fill.style.width = `${healthPercent}%`;
            fill.style.background = healthPercent > 55
                ? "linear-gradient(90deg, #5fd46b, #c8e35b)"
                : healthPercent > 25
                    ? "linear-gradient(90deg, #f2b84b, #f0dc5a)"
                    : "linear-gradient(90deg, #e34d45, #f28b54)";
        }
        if (hpLabel) hpLabel.textContent = this.scene.healthLabel;
        if (score) score.textContent = this.scene.scoreLabel;
        if (damage) damage.textContent = `${Number(this.scene.instantDamageHp || 0).toFixed(1)} HP`;
        if (restored) restored.textContent = `${Number(this.scene.instantRestoredHp || 0).toFixed(1)} HP`;
    }

    update() {
        super.update();
        this.updateGameplayHUD();
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
