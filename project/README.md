# Project T02-G02

## Group Members
* **Tomás Jardim** - 202306202
* **João Martins** - up202207341
* **Tiago Almeida** - up202303450

## Project Overview
This project is an interactive 3D WebGL survival and delivery game built using the WebCGF library. The player drives a horse-drawn wagon across a procedurally generated prairie. The objective is to pick up hay bales scattered across the map and deliver them to the barn's drop zone to restore the wagon's health and score points. The game features an endless gameplay loop with dynamically respawning hay bales, health mechanics, and a physics-based collision system with rocks, trees, and the barn.

## Run Instructions & Dependencies
* **Dependencies:** This project requires the provided `webCGF` library folder to be located in the correct parent directory as required by the engine.
* **How to Launch:**
  1. Extract the `project-t02-g02-[N].zip` file.
  2. Start a local web server (e.g., using VS Code Live Server, Python's `http.server`, or XAMPP) in the root directory of the project.
  3. Open your modern web browser and navigate to `http://localhost:[port]` to launch the game.

## Controls Reference
| Key | Action |
| :---: | :--- |
| **W** | Accelerate forward |
| **S** | Brake |
| **A** | Steer Left |
| **D** | Steer Right |
| **P** | Pick up nearest hay bale (when the vertical arrow turns red) |
| **L** | Deliver hay bales (must be inside the barn's Drop Zone) |
| **C** | Toggle between Third-Person and First-Person camera views |

## Implemented Features & Chosen Bonuses
**Core Features:**
* Complete wagon movement physics (acceleration, braking, steering) with a dual-hitbox collision system.
* Gameplay logic including HP decay, hay pickup/delivery, random obstacle damage, and a custom DAT.gui stats panel.
* Complete scene modeling including a barn, drop zone, multiple tree variants, and water ponds.

**Chosen Bonus / Advanced Features:**
To fulfill the advanced tier/bonus requirements, we successfully implemented:
1. **Procedural Terrain:** The map generates dynamic heights using Fractional Brownian Motion (fBm) noise.
2. **Procedural Flora:** Thousands of unique grass blades and complex flowers are generated dynamically, alongside safely scattered nature obstacles (multiple textured rocks, pine trees, dead trees).
3. **Wind Shader:** A custom vertex and fragment shader (`grass.vert` / `grass.frag`) dynamically animates the procedural grass blades based on global wind strength and direction.
4. **Cloud Shader:** A complex, animated 3D cloud layer rendered using custom shaders (`cloud.vert` / `cloud.frag`).
5. **Kinematic Horse Animation:** The horses feature programmatic, kinematic walk cycles, where their hooves lift and strike dynamically based on the wagon's actual speed and turning radius.
6. **Arrow Shader:** A custom shader (`arrow.vert` / `arrow.frag`) that dynamically changes color based on the wagon's proximity to a hay bale.
7. **Endless Gameplay Loop & Weight Physics:** Hay bales safely respawn dynamically upon delivery, and the wagon's acceleration and top speed are mathematically penalized based on the weight of the hay currently being carried.

## Known Issues or Limitations
* The wagon wheels may occasionally visually clip slightly into the procedural dirt trail on very steep inclines due to the complex terrain noise.


## Screenshots
1. **[Scene Overview](./screenshots/project-t02-g02-1.png)**
2. **[Flora and Scatter Details](./screenshots/project-t02-g02-2.png)**
3. **[Wagon and Horse Close-up](./screenshots/project-t02-g02-3.png)**
4. **[Animated GIF - Wind/Cloud Shaders](./screenshots/project-t02-g02-4.gif)**
5. **[Barn and Drop Zone](./screenshots/project-t02-g02-5.png)**

## AI Usage Declaration
During the development of this project, AI was used as an educational tool and debugging assistant. Specifically, AI was used to:
* Review codebase architecture and ensure adherence to WebCGF engine limitations.
* Assist with the mathematical logic for the Dual-Hitbox Penetration Resolution collision system.
* Help debug rendering order and OpenGL Polygon Offset logic for the Drop Zone.
* Optimize Level of Detail (LOD) distance thresholds for procedural grass generation.
