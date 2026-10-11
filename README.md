# HFS — Hand Flight Simulator · V6.6

Eight worlds, five vehicles, six game modes, easier body control, adjustable AI, and a live neural-evolution lab. Everything, including MediaPipe Pose and Hand Landmarker, runs locally once the ZIP is extracted.

## Run

Extract the whole ZIP and keep all files together. Stop an older game server with Ctrl+C first.

- Mac: open Terminal in the `HFS_WEB` folder and run `python3 start.py`. You can also use `START_MAC.command`.
- Windows: double-click `START_WINDOWS.cmd` or run `py -3 start.py`.
- The launcher prints the address and opens your browser. Keep Terminal open while playing.
- Python 3 is required; no pip packages are needed. Use a browser with WebGL and camera support. Do not open index.html directly.

The server only listens on your computer. If port 8000 is busy, the launcher selects the next free port and prints it.

## Recommended first flight

The new default is Downtown Drone Run, Quad Drone, Arcade controls and Practice. You spawn at street height (7 m above the ground), so the obstacles are directly in your flight path. The flight deck shows **HFS / HAND FLIGHT SIMULATOR**; if you do not see that, stop the older server and run this extracted copy.

Steer with A/D and climb/descend with W/S. Key presses and releases now ramp smoothly rather than sending instantaneous full joystick input. The drone accelerates and brakes gradually. Hold Ctrl for precision mode (half cruise speed and reduced lateral/vertical authority), Space to brake toward a hover, or Shift to boost. Low courses reduce drone/airship cruise to 60% of normal, to leave reaction time for nearby obstacles. Other maps keep the faster cruise speeds. Release Space to resume cruise.

Downtown Drone Run and Industrial Harbor have 24 small gates each. Weave around lamps, vehicles, stacked containers and barriers; fly beneath overhead bridges or climb above them. Gates score your route, but you can explore away from them in Free Flight. Guided mode follows gates and does not guarantee safe obstacle avoidance. These tight courses are intended for drones; planes and airships may be too large or fast for some gaps. Choose an original world for ordinary plane races.

Guided flight handles gate alignment automatically. Your hands make small corrections to the route. This is intentionally forgiving. Switch to Arcade when you want full direct steering, or Simulation for the more demanding bank-turn model.

## Keyboard / touch

- W/S or up/down: climb/descend.
- A/D or left/right: steer left/right.
- Shift: temporary boost; charge regenerates. Ctrl: precision speed (especially useful for drones).
- Space: hover in the drone or airship. Release to cruise again.
- C: cockpit/chase camera.
- P: pause/resume, including when a slider/dropdown has focus. P also closes the flight deck and resumes the current flight. R: restart. Escape: flight deck.
- Touch steering buttons appear on touch devices. A keyboard is still useful for boost/hover.
- Switching maps, modes, vehicles, assistance or difficulty starts a fresh flight and cancels an active training run.
- Flights pause when the window loses focus. Click Resume when you return.

## Easier body controls

1. Launch a flight, then click MediaPipe body control and allow camera permission.
2. Keep your shoulders and hands in view. Relax your arms with your hands open in a comfortable position and hold still for roughly 1.3 seconds.
3. Click Start body flight when calibration is ready. This starts a fresh flight in cockpit view.
4. Two-hand joystick (default): move both hands together gently left/right and up/down. You do not need to flap your arms or hold them overhead.
5. Right-hand or left-hand joystick: select the side you prefer and use just that hand, with both shoulders visible. Your other hand does not need to be tracked.
6. Shoulder mode: tilt your shoulders to bank, and change hand height to pitch.

### Fist boost

The default **Match steering mode** setting uses both fists with two-hand steering, or the selected hand's fist with right/left-hand steering. Close the required hand(s) for about 0.18 seconds to boost; open either required hand to release. Keep moving your wrist(s) gently to steer while boosting. You do not need to raise your arms.

The Boost gesture selector also lets you choose Both fists, Right fist, Left fist or Off independently of the steering mode. Keep the whole required hand visible, including fingers, with room between the hands. The camera overlay draws tracked fingers blue and a detected fist gold; the status text confirms when boost is active. A fist requires curled fingers; pointing with an extended finger does not count. The boost uses the same limited charge and recharge as Shift. Tracking loss releases gesture boost immediately on the next inference, or after 0.35 seconds without a fresh hand frame. Shift continues to work in every mode, including if finger tracking cannot initialize.

Hand tracking uses the bundled official [MediaPipe Hand Landmarker model](https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task) alongside Pose; all inference stays on your computer. Actual recognition and comfort need checking with your webcam. Better light and a clear view of the fingers help. Close the camera panel to stop both trackers and camera capture.

Sensitivity defaults to 0.7. Lower it if movement feels twitchy; raise it if steering feels weak. The dead zone and smoothing remove small accidental movements. Measurement is relative to your torso, so moving your whole body sideways does not steer the hand joystick. Changing the mapping recalibrates and pauses the game. Recalibrate after changing where you stand.

If tracking is lost, body inputs become neutral. A sustained loss after calibration pauses the flight once per tracking-loss episode. Press P or click Resume to continue with neutral body input and keyboard control. Reacquiring tracking rearms this automatic pause for a future loss. Guided flight may continue auto-alignment briefly before the pause. Keyboard inputs override each axis. The green skeleton is a preview of tracked joints. The camera preview is mirrored.

MediaPipe model, JavaScript and WASM files are bundled, including a non-SIMD fallback. Video is processed in your browser; this game does not record or upload it. Physical tracking quality depends on camera placement, lighting, clothing and visibility.

## Flight assistance

- Guided: automatic gate alignment plus gentle user corrections. In Free Flight, Sky Hunt and Survival, which have no gates, it acts as direct arcade steering.
- Arcade: self-centering heading and pitch; release to level and fly straight.
- Simulation: coordinated bank turns, drag, climb energy and stall response for winged aircraft. Heading persists after a turn. This is harder.
- Drones and airships retain direct lateral/vertical movement and hover in all assist settings.

These are game flight models, not validated aerodynamic simulators.

## Vehicles

| Vehicle | Cruise speed | Behavior |
| --- | --- | --- |
| Trainer Plane | 48 m/s | Stable beginner aircraft with spinning propeller |
| Swift Jet | 82 m/s | Fast, swept wings, wider turns and stronger boost |
| Cloud Glider | 44 m/s | Long wings, gentle climb and modest boost |
| Quad Drone | 34 m/s | Direct lateral movement, vertical speed control, hover and four spinning rotors |
| Sky Airship | 28 m/s | Slow cruise, gentle vertical movement and hover |

Other aircraft, drones and airships fly through side lanes as background traffic. They are scenery and do not collide with the player.

## Worlds

- Training Valley: wide gates, calm air, green hills and wind turbines.
- Coral Coast: water, islands, palms and sweeping route changes.
- Neon Metropolis: a solid night skyline with illuminated windows, streets, rooftop helipads and gold exploration targets.
- Amber Dunes: desert hills, stone arches and a warm sunset.
- Aurora Fjords: snowy peaks, ice-colored ground, stars and aurora ribbons.
- Thunder Pass: dark clouds, crosswind and lightning flashes.
- Downtown Drone Run: daytime street canyon, textured pavement, windows, shopfronts, streetlights, buses, parked cars, trees, barriers and pedestrian bridges.
- Industrial Harbor: waterfront warehouses, stacked corrugated containers, cranes, gantries and lamps.

Each world has its own gate count, spacing, path shape, heights, radius and wind. Gate counts range from 14 to 24. The two new street courses have solid everyday props. Objects share visible and collision dimensions, with a safety margin; the drone uses a smaller margin than a plane. Buildings, rooftops, mountains and ground now collide with your aircraft. Collision uses swept safety volumes to prevent flying through buildings at high speed; mountain volumes approximate their shape. Background aircraft remain scenery. In the original six worlds, small trees, signs and decorative structures also remain scenery; the two new courses explicitly add solid props. Fly through gold rooftop or summit targets for 100 exploration points each, once per flight, in any mode. Restart respawns them. Gates are tighter than the previous release.

## Modes

- Gate Race: race an AI using the same selected vehicle. Each missed gate adds 6 seconds to finish time; the lower adjusted time wins. The AI's head start delay counts toward its time. Ground or scenery impact loses the race against a completing opponent.
- Time Trial: finish the course and beat your saved adjusted time. Records are kept separately per world, vehicle and assist setting.
- Practice: fly the gate course without an opponent or a time limit.
- Sky Hunt: collect glowing sky orbs during a 90-second flight. Teal orbs give 10 points, gold orbs 30. Your best score is saved per setup.
- Sky Survival: avoid red hazards and stay inside x ±130 m and world height 40–190 m for 60 seconds (on low courses the corridor is x ±30 m and y −8–40 m). Three lives and two seconds of immunity after each hit. Ground or scenery impact ends the flight.
- Free Flight: no gates or time limit. Explore cities and mountains, collect gold landmark targets, switch cameras and practice your vehicle. Solid scenery can end the flight.

Missed gates never rewind the aircraft. They count once and the next gate becomes active. Normal races and Time Trials end after at most 240 seconds; the AI has a longer safety timeout to accommodate Rookie speed.

## AI races and difficulty

Click Race AI in the toolbar, or choose Gate Race in the flight deck and Launch flight. The current map and vehicle are kept. The red opponent is visible on the start grid during the countdown; it begins moving after its difficulty-specific starting delay. An AI RIVAL label follows its projected position, or sits at the screen edge with distance/ahead/behind information when it leaves view. The AI live camera opens automatically for Gate Race and shows the actual opponent in the same world. Click AI live view to reopen or hide it. This is a second camera on the real race, not a prerecorded video or a simulated substitute. The HUD explicitly shows STARTING, RACING, FINISHED or CRASHED.

The race pilot now forecasts solid scenery four seconds ahead and chooses steering/climb detours when its normal path predicts an impact. Drones use the same collision margin as the player. Ordinary difficulty behavior is unchanged in clear air; obstacle avoidance does not guarantee a perfect race in every aircraft or setting.

- Rookie: 72% of your cruise speed, starts four seconds late, reacts slowly and deliberately aims poorly at some gates. Steering errors produce actual misses through the normal gate detector.
- Casual (default): 88% speed, two-second delay, occasional mistakes.
- Skilled: normal speed, accurate steering, uses the saved neural controller if available.
- Expert: 106% speed, precise steering and saved neural controller.

Difficulty always applies even after evolution. Rookie and Casual use the standard pilot rather than evolved corrections. The controller used for an ongoing race is frozen until restart.

## Boost effects and sound

Hold Shift or close the selected fist(s) to boost: a short blue particle trail follows your craft, a soft glow appears at the screen edges, and the camera smoothly widens its field of view. Effects follow actual boost activation and fade when boost is released, exhausted or paused. They do not change the existing flight physics.

Sound starts after your first click or key press, as required by the browser. Quiet engine/wind ambience changes with speed and boost; cues mark countdowns, gate clears/misses, pickups, hazard hits, crashes and course completion. Click Sound on/off to mute, or adjust the Volume slider. Both settings are remembered when browser storage is available. Continuous flight audio fades out when you pause, open the flight deck, finish or leave the window. All audio is synthesized locally, with no downloaded sound files.

## Movable panels

MediaPipe body control, Evolution graph and AI live view are floating windows. Drag a title bar to move the window, or the bottom-right corner to resize it. The minus button minimizes it; plus expands it. Minimized camera/training panels keep running. Closing the camera stops camera capture; closing the evolution graph only hides it. Window positions and sizes are remembered in this browser when storage is available and kept inside the screen when the viewport changes. Use Tab to focus a title bar or resize corner, then arrow keys to move/resize (Shift makes larger steps).

The rival camera is limited to about 12 frames per second to reduce extra rendering cost. Close/minimize it if your device runs slowly; the main-view AI marker stays active.

## Visual evolution lab

Click Evolve AI. Training runs in a worker without blocking flight.

- 36 candidate neural pilots per generation; 32 generations.
- Each candidate is evaluated from two starting positions on the selected world, vehicle and assist setting. Low-course training starts at street height and includes the shared lamps, bridge, barrier and container/bus collision layout. Additional buildings and decorative props are checked in live flight, rather than in training.
- Keep five elites and mutate candidate weights for the next generation.
- The live graph shows real best-retained, average and worst scores. The top view animates recorded best, typical and worst candidate paths from each evaluated generation, alongside the retained champion trajectory. These are replays of actual worker simulations; they are not all 36 candidates being rendered in real time. Reloading a saved run replays its saved champion path.
- The fitness rewards gate hits, penalizes misses/crashes, and penalizes accumulated route error and time.
- Best/average scores are not race win percentages. Stochastic runs may show little improvement.
- Evolution tunes small neural corrections around a reliable baseline; it does not learn flight from scratch. Live races add a separate collision-avoidance layer, so training fitness and the race result need not match exactly.
- Closing the graph does not stop training. Click Cancel training to stop it.
- The completed controller and score/path graph are saved locally and restored when you return to that setup. The controller applies on the next restart. Storage restrictions may prevent persistence.

Older incompatible controllers are ignored. New controllers and records are kept separately per world, vehicle and assist setting.

## V6.6 smoother rendering

Repeated solid scenery is now drawn in spatially grouped instances, preserving the original geometry, materials, shadows and collision layout. Both MediaPipe trackers run in a background worker when the browser supports it, with one camera frame in flight at a time so old frames do not queue up. A compatible main-thread tracker remains available if worker initialization fails. Loading the trackers briefly holds the last world image while the loading messages remain active.

The HUD avoids rebuilding unchanged HTML; the AI live camera only resizes its render buffer when its panel size changes. Existing maps, vehicles, racing/evolution AI, camera previews, fist controls, movable panels, boost effects, sound, collisions and graphics-quality options remain available. The FPS readout in the bottom controls shows the rendered frame rate, averaged over roughly one second. FPS depends on the computer, viewport and selected quality.

## Graphics and smooth motion

Cruise speeds are roughly 30% faster across the fleet. The physics still run at a fixed 60 Hz, with interpolated aircraft poses and camera targets between steps for smoother motion. Body input keeps its existing dead zone and smoothing. Keyboard steering now also has a fixed-step 0.13-second input ramp. The drone has lateral inertia and gradual braking rather than instant sideways velocity.

Choose Low, Balanced (default) or High graphics in the flight deck. Balanced adds soft shadows; High raises shadow resolution and rendering detail. Low disables shadows for slower computers. The worlds use a gradient sky, lighting, terrain shading and more detailed city facades. New courses add procedural asphalt/concrete textures, shop glazing, roof machinery, sidewalks, lamp fixtures, vehicle windows/wheels and container ribs. The drone is smaller and has rotor blur, navigation lights and a closer chase camera. This remains a stylized game, rather than a photorealistic city simulator.

## Cockpit

Press C or click Cockpit view for the windshield frame, artificial horizon, compass, airspeed, altitude and vertical-speed instruments. Instruments display live game state. Cockpit appearance is stylized and shared across vehicles.

## Verification

If Node.js is available, run:

```sh
node --test tests/*.test.mjs
```

See `VALIDATION.md` for checks performed on this release and the remaining physical-camera testing limitation.
