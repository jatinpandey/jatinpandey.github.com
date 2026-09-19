# A watch in 3 dimensions — implementation notes

- Static project in the watch folder of the jatinpandey.github.com site repo, deployed with the rest of the site and served at /watch/. No build step: the folder itself is the site.
- Educational hand-wound Swiss-lever movement, with small seconds and 20 component groups. Procedural 3D geometry makes parts inspectable at arbitrary zoom.
- A simplified teaching model, not a manufacturer CAD assembly or a force simulation. Gear rotation ratios are linked; escapement phases are animated explicitly. Explain this in About.
- Search names, aliases, roles; selecting a result (or tapping a part on the model) highlights the component and opens its three-part description.
- UI: cool grey full-screen canvas, floating panels, camera presets, explode slider. Silver plates, brass wheels, ruby jewels.
- Named "A watch in 3 dimensions" in the page title, the header, the About dialog and the site landing page row.
- Header is just the title, search and About button; no eyebrow, badge, gesture hint text or footer credits link. There are no on-screen camera controls: the camera lands on the three-quarter view and people orbit and zoom directly.
- There is no component list panel. Parts are reached by tapping the model or by search; the part description and the playback/explode controls stack on the right. On phones there is no side space, so playback stays along the bottom.
- The starting camera distance is fitted to the window so the whole watch, crown included, clears the right-hand panels. The dial view is still used internally when search picks a part beneath the dial.

## Follow the flow (guided walkthrough)
- A "Trace power" button used to tint the energy-carrying parts amber. It was removed because a static tint didn't show energy actually flowing.
- flow.js now holds the ordered path from crown to hairspring: 13 steps grouped into wind, store, transmit and regulate phases, each with the part to highlight, what it does, and how it sets off the next step. The winding step also highlights the click. The last step loops back to the escape wheel, since steps 9 to 13 repeat every beat. A separate branch covers centre wheel → cannon pinion → motion works → hands.
- validate.mjs checks that every step names a real part and is physically linked (via components.js links) to the step before it.
- The "Follow the flow" button is removed for now, so nothing opens the sheet; all of its code (flow.js, the stepper, the model's three-state highlighting) is still in place and ready for a new entry point. When it was there, the button (bottom left) opened a collapsible bottom sheet built from that data: a bar with "Step n of 13", then the phase label, title, what happens, the handoff to the next part, a clickable progress track grouped by phase, and Back/Next. Arrow keys work; Escape leaves.
- Collapsing hides only the text body; the bar (which then also shows the step title), the track and Back/Next stay, so you can keep stepping with the watch in view. It sits bottom left on desktop, clear of the playback panel at bottom right, and spans the width above playback on phones.
- The model highlights three states at once: the current part (and its supporting parts) in matte navy, parts already passed through tinted toward the highlight colour, and the part next in line glowing faintly.
- On the centre-wheel step the sheet also names the display branch. On the last step the next part still glows at the escape wheel it hands back to (steps 9 to 13 loop every beat), but Next reads "Start over" and returns to step 1.
- The walkthrough reveals what it needs (the mainspring step hides the winding wheels, for example). Picking a part on the model or in search leaves the walkthrough and hands the highlight over to that part.

## Verification and delivery
- Local HTTP preview returns 200. Syntax checked as ES modules; declaring the local package type fixed a Node syntax-check ambiguity, and a missing function brace was corrected before validation.
- Validated all 20 descriptions and cross-links, search aliases and empty results, minute/centre-wheel timing ratios, the single-beat step and locked escapement dwell, unique HTML IDs, and local assets.
- WebMCP search and inspection registered in the preview. Valid search returned balance/hairspring; inspection opened the balance description with the 3D model available. Invalid ID and empty query intentionally failed.
- Three.js 0.180.0 and OrbitControls are bundled locally with their MIT license. Only the optional Google font is remote; sans-serif is the fallback.
- Animation starts at 0.1× by default (model and speed menu agree); 0.25×, 1× and 10× are available. 10× makes the third wheel visibly turn (once a minute) but the centre wheel still only creeps (once every six minutes), and the balance swings 25 times a second, faster than a 60 fps screen can show smoothly, so it flickers.
- Selected descriptions sit above playback on phones. Reduced-motion preferences pause on startup.

## Selection
- The selected component group becomes opaque matte navy, with low reflectivity so studio lighting cannot wash out the highlight. All other parts keep their original finish.
- Tapping a part on the model never moves the camera or changes which layers are shown, since a tapped part is already in view. Choosing a part from search or connected parts may still hide covering layers and turn to the dial side for parts beneath the dial.
- Tapping empty space around the watch (a click, not a drag) clears the selection and closes the description.
- Original colors, metalness, roughness, opacity and depth behavior restore on deselection.

## Showing and hiding parts
- Every part is visible. The only automatic hiding left: picking a part that sits under the dial from search or connected parts turns the view to the dial side and hides the hands and case that cover it. Any later pick, or clearing the selection, makes everything visible again.
- Text spells out "and" instead of using ampersands.

## Realism pass — 2026-09-18
- Scope: `/watch` only. Improve the original inspectable teaching model; preserve the existing 20 component IDs, mechanics, selection and guided flow.
- Reference research: ETA 6498-1 technical communication (official exploded assembly/parts list), Grand Seiko's polishing/hairline finishing article, and Khronos glTF ChronographWatch (CC BY 4.0). The Khronos asset is an exterior chronograph, not a replacement for this hand-wound teaching movement; no third-party meshes or brand marks imported.
- Implemented deterministic 512px machining maps (brushing, circular turning, bridge stripes and perlage), satin metal faces with separate polished bevel materials, geometric screw recesses, shaped open bridges, spoked wheels, thick ribbon springs, ruby annuli and shock setting, a rounded case with lugs/spring bars, knurled crown, tapered blued hands and small-seconds indices. Studio reflection cards, a shadow-casting key light and reduced exposure give surfaces more depth. No added asset downloads or dependencies.
- Preserved all component IDs and movement timings. Highlighting now restores every surface material, including crystal/clearcoat properties. Clearing a selection also restores temporarily hidden layers; existing search ordering is unchanged. Cache-versioned the entry modules so returning browsers receive this update.
- Tradeoff: retain an intentionally open and exaggerated teaching layout rather than reproduce the occluded architecture of the ETA calibre. Materials and forms use watchmaking references, not manufacturer CAD; the model remains an approximation.
- Validation passed: all existing component, connection, flow, search, timing and HTML/asset checks; added checks for finite spring geometry, UV coverage and outward face winding at three spring phases. Syntax checks include finishes.js; git diff --check clean.
- Browser review: 1280×720 and 390×844, assembled and exploded views, zoom/orbit, mainspring selection/focus, material restoration, hands/dial, guided flow, pause and single tick; no browser errors. Local preview only; not deployed.
- Sources: [ETA technical communication](https://shopb2b.eta.ch/en/technicaldocuments/index/pdf/id/1914/), [Grand Seiko finishes](https://www.grand-seiko.com/au-en/special/dream9stories/vol9/2), [Khronos downloadable watch and material notes](https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/ChronographWatch/README.md). ETA and Grand Seiko links are also in About.
