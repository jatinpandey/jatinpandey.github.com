# The insides of a mechanical watch — implementation notes

- Static project in the watch folder of the jatinpandey.github.com site repo, deployed with the rest of the site and served at /watch/. No build step: the folder itself is the site.
- Educational hand-wound Swiss-lever movement, with small seconds and 20 component groups. Procedural 3D geometry makes parts inspectable at arbitrary zoom.
- A simplified teaching model, not a manufacturer CAD assembly or a force simulation. Gear rotation ratios are linked; escapement phases are animated explicitly. Explain this in About.
- Search names, aliases, roles; selecting a result (or tapping a part on the model) highlights the component and opens its three-part description.
- UI: cool grey full-screen canvas, floating panels, camera presets, explode slider. Silver plates, brass wheels, ruby jewels.
- Header is just the title, search and About button; no eyebrow, badge, gesture hint text or footer credits link. There are no on-screen camera controls: the camera lands on the three-quarter view and people orbit and zoom directly.
- Layout keeps the render clear: components on the left; part description and playback/explode controls stacked on the right. On phones there is no side space, so playback stays along the bottom.
- The starting camera distance is fitted to the window so the whole watch, crown included, shows between the side panels. The dial view is still used internally when search picks a part beneath the dial.

## Energy flow (data ready, UI not built)
- A "Trace power" button used to tint the energy-carrying parts amber. It was removed because a static tint didn't show energy actually flowing.
- flow.js now holds the ordered path from crown to hairspring: 13 steps grouped into wind, store, transmit and regulate phases, each with the part to highlight, what it does, and how it sets off the next step. The winding step also highlights the click. The last step loops back to the escape wheel, since steps 9 to 13 repeat every beat. A separate branch covers centre wheel → cannon pinion → motion works → hands.
- validate.mjs checks that every step names a real part and is physically linked (via components.js links) to the step before it.
- Next: build a guided walkthrough UI on top of this data, highlighting one step at a time.

## Verification and delivery
- Local HTTP preview returns 200. Syntax checked as ES modules; declaring the local package type fixed a Node syntax-check ambiguity, and a missing function brace was corrected before validation.
- Validated all 20 descriptions and cross-links, search aliases and empty results, minute/centre-wheel timing ratios, the single-beat step and locked escapement dwell, unique HTML IDs, and local assets.
- WebMCP search and inspection registered in the preview. Valid search returned balance/hairspring; inspection opened the balance description with the 3D model available. Invalid ID and empty query intentionally failed.
- Three.js 0.180.0 and OrbitControls are bundled locally with their MIT license. Only the optional Google font is remote; sans-serif is the fallback.
- Animation starts at 0.1× by default (model and speed menu agree); 0.25×, 1× and 10× are available. 10× makes the third wheel visibly turn (once a minute) but the centre wheel still only creeps (once every six minutes), and the balance swings 25 times a second, faster than a 60 fps screen can show smoothly, so it flickers.
- The component panel is always expanded (no collapse button), including on phones. Selected descriptions sit above playback on phones. Reduced-motion preferences pause on startup.

## Selection
- The selected component group becomes opaque matte navy, with low reflectivity so studio lighting cannot wash out the highlight. All other parts keep their original finish.
- Tapping a part on the model never moves the camera or changes which layers are shown, since a tapped part is already in view. Choosing a part from search or connected parts may still hide covering layers and turn to the dial side for parts beneath the dial.
- Tapping empty space around the watch (a click, not a drag) clears the selection and closes the description.
- Original colors, metalness, roughness, opacity and depth behavior restore on deselection.

## Component list
- Every part starts visible; there is no Movement/All parts switch. The footer button reads "Clear all" and hides every part (also clearing any highlight); once nothing is shown it reads "Select all" and shows everything again.
- Tapping anywhere on a row shows or hides that part. Each section sits on a tinted block, and its header is a checkbox for every part in the section, with a mixed (dash) state when only some are shown. Rows use checkboxes to signal multi-select.
- Text spells out "and" instead of using ampersands.
