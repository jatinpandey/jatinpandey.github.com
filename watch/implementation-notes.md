# The insides of a mechanical watch — implementation notes

- Static project in the watch-working folder of the jatinpandey.github.com site repo, deployed with the rest of the site and served at /watch-working/. No build step: the folder itself is the site.
- Educational hand-wound Swiss-lever movement, with small seconds and 20 component groups. Procedural 3D geometry makes parts inspectable at arbitrary zoom.
- A simplified teaching model, not a manufacturer CAD assembly or a force simulation. Gear rotation ratios are linked; escapement phases are animated explicitly. Explain this in About.
- Search names, aliases, roles; selecting a result (or tapping a part on the model) highlights the component and opens its three-part description.
- UI: cool grey full-screen canvas, floating panels, camera presets, explode slider. Silver plates, brass wheels, ruby jewels.

## Verification and delivery
- Local HTTP preview returns 200. Syntax checked as ES modules; declaring the local package type fixed a Node syntax-check ambiguity, and a missing function brace was corrected before validation.
- Validated all 20 descriptions and cross-links, search aliases and empty results, minute/centre-wheel timing ratios, the single-beat step and locked escapement dwell, unique HTML IDs, and local assets.
- WebMCP search and inspection registered in the preview. Valid search returned balance/hairspring; inspection opened the balance description with the 3D model available. Invalid ID and empty query intentionally failed.
- Three.js 0.180.0 and OrbitControls are bundled locally with their MIT license. Only the optional Google font is remote; sans-serif is the fallback.
- Animation starts at 0.1× by default (model and speed menu agree); 0.25× and 1× remain available.
- Responsive UI collapses the component panel on phones and puts selected descriptions above playback. Reduced-motion preferences pause on startup.

## Selection
- The selected component group becomes opaque matte navy, with low reflectivity so studio lighting cannot wash out the highlight. All other parts keep their original finish.
- Tapping a part on the model never moves the camera or changes which layers are shown, since a tapped part is already in view. Choosing a part from search or connected parts may still hide covering layers and turn to the dial side for parts beneath the dial.
- Original colors, metalness, roughness, opacity and depth behavior restore on deselection. Selection takes priority over power tracing; tracing resumes when selection clears.

## Component list
- Tapping anywhere on a row shows or hides that part. Each section header is a show/hide toggle for every part in the section, with a mixed state when only some are shown.
- Text spells out "and" instead of using ampersands.
