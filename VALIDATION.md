# HFS — Hand Flight Simulator · V6.6 validation

Checks performed on 2026-10-10.

## Simulation and rules

All 57 Node.js regression tests passed with the updated speeds and tighter gates. They cover:

- Missed gates count once without rewinding, swept gate crossings, multiple gate crossings and no duplicate credit.
- Completion when gates are all missed, ground impacts, boost recharge, raw-model stall response and render-rate independence.
- Guided neutral-input completion for every combination of six worlds and five vehicles (30 combinations).
- Rookie AI genuinely flying slower, missing some gates through normal detection and finishing later than the neutral-input guided player.
- Arcade steering recentering, actual vehicle speed differences, drone hover and height hold, and Free Flight not ending at a course or time limit.
- Swept orb detection, one-time collection, survival immunity and three-hit termination.
- Neutral-pose calibration, shoulder-mode polarity, hand-joystick polarity, whole-body movement rejection, single-hand visibility requirements, loss of tracking and recalibration.

- Swept building collision, safe flight above rooftops and beside buildings, narrowing mountain collision volume, and one-time landmark collection.

- Keyboard press/release ramps, drone lateral acceleration/braking, precision speed, low-altitude lamp collisions versus safe flyovers, and street-course gate heights. Original six-map guided checks are unchanged; new narrow obstacle courses do not guarantee guided completion.

## Browser

Headless Chromium 133 with software WebGL:

- Flight deck displayed the six worlds, five vehicles and six game modes, with Arcade and Casual defaults in V5. V6 opens Downtown Drone Run, Quad Drone and Practice.
- Launch countdown and flight worked; pausing kept simulation time unchanged.
- A complete 32-generation evolution run populated real best/average/worst metrics and the champion trajectory. A focused check confirmed monotone best-retained scores and restored the saved graph/controller after reload.
- All six environments rendered; trainer, jet, drone, glider and airship were exercised across race, practice, Time Trial, Sky Hunt, Survival and Free Flight selections.
- Desktop world views, evolution panel, mobile cockpit and mobile menu screenshots were inspected.
- Bundled MediaPipe Pose initialized and ran inference on synthetic camera video without external network requests. Changing the hand mapping and closing the camera worked.
- No JavaScript page errors and no external network requests during the broad browser run.

The current city update also passed a live keyboard-driven collision check: steering from the central avenue into a building produced “Building impact.” Restart, switching graphics quality, and High city/coast rendering worked with no page errors. Updated city/coast screenshots were inspected. Previous broad browser checks above cover the retained features; they were not all repeated for this update.

V6 live browser checks exercised keyboard steering into solid street scenery, restart, graphics switching and both new courses in High quality, with no page errors. Screenshots were inspected. Physical keyboard inertia and precision behavior were checked separately in the fixed-step tests.

## Limits of verification

The synthetic camera stream verifies initialization and inference, not human tracking accuracy or comfort. Actual body steering still needs a test with a person and their webcam. Mac and Windows launchers and Safari/Edge behavior were not executed on native machines here. Software rendering is not a performance measurement for the user's device. This is an arcade game with optional simplified simulation controls, not validated aircraft aerodynamics. Building and mountain collision uses approximate safety volumes. Background traffic and small decorations do not collide.

## V6.1 pause fix

A focused Chromium regression check passed: P from the flight deck, focused body-control slider/dropdown, held-key repeat suppression, resume after window focus loss, and the Resume button. Text input remains excluded from game shortcuts. Test-only state accessors also checked that a tracking-loss pause does not immediately recur after manual resume, and rearms after recovery. This tests pause state handling, rather than physical webcam tracking. No JavaScript page errors.

## V6.2 AI race fix

Nine added regression tests passed: both new drone courses completed without collisions at Rookie, Casual, Skilled and Expert settings against the shared obstacle layout, and clear-air controls matched the original difficulty controller exactly.

Chromium exercised both the Race AI shortcut and flight-deck Gate Race selection. Fast-forwarding the actual fixed-step game with all generated world colliders confirmed Casual drone completion on Downtown Drone Run and Industrial Harbor (20 hits, four misses each), plus a Training Valley plane race (12 hits, two misses for the AI). No page errors. The V6.1 pause browser regression was repeated and passed. Real-time performance of the avoidance search on the user's hardware remains unmeasured.

## V6.3 visible rival and floating windows

The 57 simulation tests remained passing. A Chromium check confirmed the rival marker and live camera rendered; title-bar dragging, corner resizing, minimize/expand, minimized dragging, saved position on reload, and mobile viewport clamping worked. Evolution produced three nonempty recorded candidate paths with finite fitness scores and rendered their animated replay. MediaPipe panel dragging was checked with the camera panel exposed, without starting human capture. An arranged desktop screenshot was inspected. No page errors. The pause regression was rerun and passed.

The additional rival camera incurs rendering cost; its real-time performance on the user's hardware has not been measured. Human webcam tracking remains a physical testing limitation.

## V6.4 finishing effects

All 57 simulation tests passed. Chromium verified gesture-unlocked running audio, Shift-driven particles and widened camera field of view, effect fading on pause, event-cue synthesis, mute and mute persistence after reload, with no page errors. Offline Web Audio rendering produced nonzero finite sound below clipping and exactly zero output when muted. Boost screenshot inspected. The pause browser regression also passed. This verifies synthesis/output data; subjective sound quality on physical speakers was not assessed.

## V6.5 fist boost and left-hand steering

Checks performed on 2026-10-11. All 68 Node tests passed, including new fist/open/pointing classification, scale/rotation invariance, invalid landmarks, the 180ms hold, two-fist requirement, right/left one-hand selection, tracking/confidence loss release, calibration/disabled state, independent gesture overrides, and left-hand steering without the other wrist. The prior race, obstacle and flight tests remain passing.

The official bundled Hand Landmarker task archive passed its integrity check. Human recognition accuracy and comfort have not been physically tested; synthetic landmark tests verify control logic rather than the model's recognition of real fists.

Chromium initialized both local Pose and Hand Landmarker models and ran inference on synthetic video with no external requests or page errors. Test-only injected landmarks verified the actual flight control input activates/releases boost for both, right and left fists while preserving Shift fallback. Mapping changes required recalibration, and closing the camera released both trackers and stopped capture. The updated panel screenshot was inspected. The P/pause regression was repeated and passed. Synthetic video does not verify real fist recognition.

## V6.6 rendering and tracking performance

Static scenery is batched by appearance, shadow flags and 400m depth chunks. Geometry accounting retained exactly 44,254 scene triangles downtown, 20,286 in the harbor and 43,342 in Neon Metropolis (Practice scenes), including the dynamic objects excluded from batching. Static mesh reductions were 851, 632 and 280 respectively. Tests verify transformed bounds, differing materials, hidden/transparent/dynamic exclusions and separate culling volumes. Collision arrays remain independent of rendered instances.

Chromium 153 with software WebGL compared sampled Free Flight views: downtown main-view draw calls 1,268 → 455, harbor 814 → 198, Neon Metropolis 556 → 279. Counts include visible craft and pass/culling differences; they are not FPS multipliers. Timed software-rendered frames varied heavily under CPU contention and cannot predict hardware FPS. Screenshots of the batched worlds were captured; the downtown image was inspected.

The standalone tracking worker initialized both bundled models and inferred on a blank image. The complete app then initialized both trackers in the worker, inferred on fake camera video, accepted two/right/left fist control test inputs, preserved Shift fallback and recalibration, and cleaned up the worker and camera on close. No external requests or page errors in that camera check. Worker startup holds the world image to reduce competition while initializing models. Real human tracking and native Safari behavior remain untested; unsupported worker initialization falls back to the prior tracker.

All 71 Node regressions passed. Chromium also repeated the P/pause regression, completed AI races on both obstacle courses and Training Valley, and verified Shift boost visuals, pause fading, synthesized event sound, mute and persistence, with no page errors. The final camera check additionally exercised cancellation during worker startup, confirming it clears loading promptly and cannot restart capture through a late result.
