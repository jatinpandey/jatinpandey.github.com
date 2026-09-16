# Implementation notes

## 2026-09-16 — Coach UI cleanup

- The masthead wordmark on `/coach` reads `coach` in the site's Didot style and returns to the Coach landing without losing the current chat (Back returns to it).
- Landing: removed the in-page New chat and Google buttons (sign-in now happens from the message box dialog), the advisor names, "six lenses" (now "the POV of a curated set of people"), and the example's closing verdict. The example labels perspectives by what they stress instead of by name. The homepage Coach row and page description no longer name anyone. Added the ephemeral-chats notice to the landing and new-chat views.
- Chats are now memory-only: nothing is written to localStorage, and history saved by the previous version is cleared on load.
- Dialog: Google button centred; lede is just the free-prompt offer; the key field is marked "* (beta testers only)" with Use key beside it; the provider links and Cancel are gone; a close button, Escape, or a tap outside dismisses it.
- Buttons are now ink-outlined pills in sentence case instead of black slabs and small uppercase mono; the send button matches. Error messages put their actions on their own row ("Add API key", "Retry").
- `web-context.md` tells Coach never to name or identify the people behind the lenses and to describe them by what they emphasise.

## Verification

- Checked the landing, dialog and out-of-credits error at 1100px and 375px: Google button centred, tap outside closes the dialog, focus starts on the dialog title, no horizontal overflow, and no advisor names in the page text. No console errors.

## 2026-09-16 — Coach spend and abuse limits

- Free-tier requests (coach-api) now go through, in order: a verified Google account, a 256 KB body cap, a 4,000-character cap on the new message, history trimmed to the newest ~24,000 characters (older turns dropped, long ones truncated), one in-flight reply per account, a 200-prompt daily ceiling across all users, the 10-prompt lifetime credit, and a 4,000-token reply cap (gpt-5 at low reasoning effort). Credit and daily slot are refunded when no reply arrives. All limits are environment variables.
- The page checks the 4,000-character cap before sending on the free tier and shows specific messages for too long, still answering, daily limit (with an add-key button and a `coach_daily_limit` event), and server errors.
- `web-context.md` now tells Coach to stay in role and decline unrelated work or instructions to become something else.
- `/api/event` rejects bodies over 1 KB.
- Per-IP limits in coach-api (Redis fixed window, keyed on Vercel's `x-real-ip`): 20 chat requests, 60 events and 60 balance checks per minute. Vercel Firewall rate limiting isn't available on the Hobby plan, so a staged firewall rule was discarded; Vercel's automatic DDoS mitigation still applies.

## Verification

- Unit-checked the trimming: a 41-message, ~400k-character history is cut to the newest 7 messages (~22.5k characters) starting on a user turn; over-length prompts, system roles, non-string content and histories ending on an assistant turn are rejected.
- In the browser with a mocked backend: the length pre-check keeps the text in the box, and 429 in-progress, 503 daily-limit, 413 and 502 each show the right message without saving the failed turn.
- Against the deployed backend: unauthenticated chat is rejected, an oversized event body returns `too_large`, CORS preflight still passes for the site, and a burst of 65 event requests from one IP starts returning 429 within the minute.

## 2026-09-16 — Coach v2: Google sign-in, free prompts, analytics

- `/coach/` now opens on a landing page, "Coach - Your personal board of directors", with a New chat button, Sign in with Google, and a sample exchange. `#chat` is the chat view. The header has "New chat" and, when signed in, an avatar menu (free prompts left, use your own key, sign out). The Key button and the "Conversations stay in this browser" line are gone.
- Tapping the message box without a way to answer opens a dialog: sign in with Google, or paste an Anthropic (`sk-ant-…`) or OpenAI (`sk-…`) key. Own keys call the provider straight from the browser (Claude Opus 5 or gpt-5) with no limit.
- Signed-in users without a key get 10 free prompts, served by `coach-api` (Vercel project in jatinpandey's projects, `https://coach-api-one.vercel.app`, source in `~/Desktop/life-coach/coach-api`). It verifies the Google ID token, reserves a credit atomically in Upstash Redis (refunded if no reply arrives), and streams gpt-5 on the site owner's OpenAI key, which never reaches the browser. The eleventh prompt shows "You have run out of credits" with a prompt to add a key.
- The coach's environment notes moved to `coach/skill/web-context.md`, loaded by both the page and the server. It now treats people as themselves unless they say they are Jatin.
- Analytics: GA4 events `coach_landing_view`, `coach_new_chat_click`, `coach_access_prompt`, `coach_sign_in`, `coach_key_added`, `coach_prompt_sent` (mode, prompt_number), `coach_out_of_credits`. The same steps are beaconed to `coach-api/api/event`, which keeps unique visitors per step and prompts per visitor in Redis; `GET /api/stats` (bearer token) reports the funnel and prompts-per-user histograms.
- `coach/config.js` holds the public API base and Google client ID.

## Verification

- Mocked the provider and backend in the browser: gated message box, key validation, an own-OpenAI-key reply (request carries the skill prompt as the developer message), free replies decrementing the counter, the out-of-credits dialog when the page knows the balance, and the out-of-credits message when the server returns 402. Checked the account menu and 375px layout.
- Against the deployed backend: CORS preflight allows only the listed origins, `/api/chat` rejects missing and forged Google tokens, `/api/event` validates steps, `/api/stats` requires the token and reads live Redis.

## 2026-09-16 — Coach

- Added `/coach/`, a chat interface for the life-coach skill: the six advisor lenses (Buddha, Shah Rukh Khan, Jordan Peterson, Elon Musk, Naval Ravikant, Rick Rubin) answering in a streamed conversation. It uses the site's paper palette, Didot headings and masthead, with a pinned composer, starter prompts, stop/retry, and conversations kept in localStorage.
- `coach/skill/` holds `SKILL.md`, `references/guide.md` and `references/advisors.md` copied unchanged from the skill. `app.js` fetches them at load and builds the system prompt, so editing those files and pushing changes the coach. A short preamble tells the model it has no journal/memory access and can't edit its own files here.
- GitHub Pages is static, so there's no server to hold an API key. Each visitor enters their own Anthropic key; it is stored in localStorage and requests go directly from the browser to `api.anthropic.com` via the Anthropic JS SDK (pinned 0.126.0 from jsDelivr). Model `claude-opus-5`, adaptive thinking, effort `high`, server-side refusal fallbacks, and automatic prompt caching.
- Added a Coach row to Projects after the watch, with a monoline speech-bubble spot (`projects/images/spot-coach.svg`). The page is `noindex`.

## Verification

- No API key was available locally, so the Anthropic endpoint was mocked in the browser with a streamed SSE response. Confirmed the request carries the model, system prompt with all three skill files, adaptive thinking, fallbacks and caching, plus the browser-access, beta and key headers; text streams in and renders as sanitized Markdown; the second turn sends the full prior history; history persists across reloads.
- Checked a 401 (shows "That API key was rejected" with Update key / Retry and leaves history clean), Retry, Stop mid-stream, and the key prompt opening when no key is set. Checked 375px and desktop widths with no horizontal overflow.

## 2026-09-16 — Single ramen illustration and larger footer text

- Trimmed the footer illustrations to the ramen bowl alone, centred above the footer at 150–200px wide with a slight tilt; it still wiggles on hover or tap. Removed the unused day, dosa and night cut-outs from `images/illustrations/` (the originals remain in `design/illustrations/`).
- Increased the footer text from 0.68rem to 0.82rem.

## Verification

- Checked the homepage at 1280px and 390px: the ramen is horizontally centred, the wiggle still triggers, and there is no horizontal overflow. `git diff --check` passes.

## 2026-09-14 — Playful wordmark dots and illustrations

- The tittles on `j` and `i` in the wordmark are now separate dots that hop and squash in turn when the wordmark is hovered. The letters stay real text: each glyph is clipped just below its printed dot, and the drawn dots use Didot's measured metrics. `motion.js` enables this only when Didot actually renders, so other fonts keep the plain wordmark. Applied on the homepage and Pi page.
- The footer illustrations are scattered with individual offsets, tilts and scales, and wiggle on mouse hover or touch tap (with a light haptic tick on touch). The wiggle keeps each piece's resting offset and is skipped under reduced motion.

## Verification

- Compared the clipped wordmark against plain Didot at 2× and checked a mid-hop frame: identical at rest, no doubled or missing dots.
- Triggered the wiggle with mouse and touch pointer events and confirmed the animation runs and restarts. Checked the scattered layout at desktop and phone widths with no horizontal overflow. `node --check motion.js` and `git diff --check` pass.

## 2026-09-14 — Paper texture, serif headings, and illustrations

- Added a paper texture to the shared stylesheet: multiply grain with faint fibres, laid-paper lines, and a warm edge. A heavy-over-hairline double rule replaces the masthead drop shadow and matches the content width; matching rules frame the project list; a small star sits on the footer rule.
- Set the About, Projects, Pi and Things headings and the project names in Didot (the wordmark face). The `jatin` wordmark now sits left, aligned with the content column.
- Replaced the project icons with monoline spot illustrations (`projects/images/spot-*.svg`).
- Added “The Insides of a Mechanical Watch” after Flixelated, linking to `/watch/` in a new tab with a matching watch spot. The watch animation now starts at 0.1×.
- Added four transparent-background illustrations above the footer (day hillside and Van Gogh-style night as soft cut-out vignettes, masala dosa on its leaf, ramen bowl), four across and two per row on phones. Grain is confined to the painted areas so no rectangle shows. They are decorative and hidden from assistive technology.
- Rethemed `projects/things.html` from dark teal to the site's light palette via `poolsuite.css`; copy unchanged.
- `design/illustrations/` holds the ten-style exploration; `build.py` regenerates the samples, the homepage cut-outs in `images/illustrations/`, and the project spots.

## Verification

- Checked the homepage at 1280px and 390px, and the Pi and Things pages: no horizontal overflow, all images load, the wordmark and masthead rule align with the content edge, and the illustrations sit directly after Projects.
- Compared local and live pages at identical window sizes to rule out CSS differences behind a “shrunk” report (it was browser zoom).
- All generated SVGs pass `xmllint`; the watch project's validation passes; HTML parsing and `git diff --check` pass.

## 2026-09-12 — Editorial project ledger

- Replaced the live homepage's tall project-card stack with the selected Editorial ledger treatment: compact ruled rows, smaller project marks, restrained copy, and a clear outbound arrow.
- Kept descriptions visible on desktop and reduced mobile rows to project names while preserving the full name and description in each link's accessible label.
- Updated the Meanwhile in History description to “Explore the world and its many civilizations.” in both the homepage and the local treatment comparison.

## Verification

- Visually verified the live homepage at 1280 × 900 and 390 × 844. Desktop rows retain readable descriptions; mobile rows reduce cleanly to project names with no horizontal overflow.
- Confirmed all four links preserve their full accessible labels and new-tab behavior, the updated Meanwhile wording appears locally, and the browser reports no errors or warnings.
- HTML parsing, exact-copy/layout assertions, and `git diff --check` pass.

## 2026-09-12 — Projects section treatment exploration

- Built a local comparison page with four scalable alternatives to the growing homepage project-card stack: Editorial ledger, Cover grid, Feature + archive, and Project rail.
- Showed each direction in both desktop and mobile compositions using the current project titles, descriptions, imagery, typography, and warm charcoal palette.
- Kept this exploration isolated at `design/project-treatments/index.html`; the pushed homepage remains unchanged until a direction is selected.

## Verification

- Visually reviewed all four treatments in the local browser and corrected a class collision in the Project rail layout.
- Confirmed the comparison page has no horizontal overflow at a 390px viewport and all four embedded mobile previews remain 320px wide.
- Confirmed the browser accessibility tree exposes all four treatment names and project links.

## 2026-09-11 — Meanwhile in History project image

- Replaced the temporary `M·H` monogram with the supplied Meanwhile in History map screenshot.
- Stored the supplied image unchanged and used the existing square project frame to crop it responsively around the highlighted Germany/Berlin view.
- Kept the image decorative inside the already-labelled project link so assistive technology receives one concise project name and description.

## Verification

- Refreshed the homepage locally at desktop and 390px widths. Tightened the frame crop around Germany and the Berlin label so the supplied map remains recognizable at icon size; the card layout has no clipping or horizontal overflow.
- Confirmed the PNG loads successfully at its original 838 × 636 resolution, the project link retains its accessible name and description, HTML parsing succeeds, and `git diff --check` passes.

## 2026-09-11 — Meanwhile in History project

- Added “Meanwhile in History” immediately after Flixelated and before Things, linking to `https://meanwhileinhistory.vercel.app/` in a new tab.
- Used the supplied description exactly: “Explore the world and its history.” Added a restrained `M·H` editorial monogram surface that fits the existing project-object system.
- Updated the Pi page line to begin with “Work” and changed “AND” to lowercase “and,” including the matching page-description metadata.
- No push or deployment was requested for this pass.

## Verification

- Refreshed the homepage and Pi page locally. Confirmed the new project appears in the requested order, its title wraps cleanly at 390px, and the Pi copy renders with the requested capitalization.
- Confirmed all four project cards retain new-tab behavior, both HTML pages parse, exact-copy/order assertions pass, and `git diff --check` passes.

## 2026-09-11 — Copy, interaction, and Pi-page cleanup

- Removed the tweet link from the About sentence while preserving its text.
- Removed the Things date/category metadata, shortened the homepage Pi card copy, and updated the Pi page description to the requested “memory game AND party trick” wording.
- Changed the Pi counter from fraction-like `n / ∞` text to grammatically correct `n digit` / `n digits` text.
- Removed the pointer-leave sound while preserving the visual reset, hover-entry sound, press sound, and touch haptics.
- Reduced the vertical gap between the Pi button and footer. Added `touch-action: manipulation` on the Pi page to prevent double-tap zoom during rapid play while preserving pinch zoom and scrolling.
- Set all three homepage project cards to open in new tabs with `noopener`; footer and About navigation behavior is unchanged.

## Verification

- Refreshed the homepage and Pi page locally and confirmed the requested copy, removed metadata, shorter footer gap, and new-tab project links are reflected in the accessibility tree and rendered layout.
- Triggered 52 rapid Pi button presses and confirmed the counter reads `52 digits`; computed `touch-action` is `manipulation`, and the browser reported no errors or warnings.
- Confirmed the pointer-leave handler now only resets card transforms and emits no sound. HTML parsing, JavaScript syntax, exact-copy/link assertions, and `git diff --check` pass.

## 2026-09-11 — Compact centered wordmark restored

- Restored `jatin` as the live editorial-serif masthead wordmark on both the homepage and Pi page.
- Re-centered the wordmark within the shared responsive masthead container while preserving its accessible “Jatin Pandey, home” label.
- Retained the spaced full-name SVG as a design-source artifact only; it is no longer used by the live masthead.

## Verification

- Refreshed the local homepage and confirmed the compact `jatin` mark is centered and readable while the accessible home-link label remains intact.
- Confirmed both HTML pages parse, exact wordmark assertions pass, and `git diff --check` passes.

## 2026-09-11 — Spaced full-name wordmark selection

- Selected `jatin pandey`, with a space, as the live editorial-serif masthead wordmark on both the homepage and Pi page.
- Removed the rejected joined `jatinpandey` study and retained the spaced full-name SVG as the selected design artifact.

## Verification

- Refreshed the local homepage and confirmed the spaced full-name mark is left-aligned, readable, and preserves the accessible home-link label.
- Confirmed both HTML pages and the retained SVG parse successfully, the rejected SVG is absent, exact-copy assertions pass, and `git diff --check` passes.

## 2026-09-11 — Copy refinements and full-name wordmarks

- Updated the About paragraph, Things description, and Pi description using the user’s latest exact wording. Applied the Pi wording consistently on both the homepage card and Pi page.
- Added two image-only wordmark studies in the current editorial-serif style: `jatinpandey` and `jatin pandey`. Both use the site’s warm paper and near-black palette at matching dimensions for direct comparison.
- Kept the live masthead wordmark unchanged while these full-name variants are under review.

## Verification

- Refreshed the local homepage and confirmed all three copy changes render without disturbing the layout.
- Confirmed both new wordmark images render in the intended Didot/Bodoni style, parse as SVG, and use matching dimensions and colors. Exact-copy assertions, HTML parsing, and `git diff --check` pass.

## 2026-09-11 — About copy trim

- Removed the opening “I spend a lot of time thinking about systems…” paragraph from the homepage About section exactly as requested.
- Preserved the remaining About copy, layout, links, and styling.

## Verification

- Refreshed the local homepage and confirmed the About section now starts with “I'm broadly interested in problem solving.” The remaining linked sentence and project layout are unchanged.
- Confirmed the removed sentence no longer exists in the homepage source, HTML parsing succeeds, and `git diff --check` passes.

## 2026-09-11 — Left-aligned masthead wordmark

- Moved the selected editorial serif wordmark from the center to the left on both the homepage and Pi page.
- Added a shared masthead inner container so the wordmark follows the site’s 1064px content shell and responsive page margins instead of hugging the viewport edge.
- No deployment or push was requested; this change remains local for review.

## Verification

- Visually verified the homepage at desktop and 390 × 844. The wordmark aligns with the About/Projects content edge at both widths, and the accessible home-link label remains intact.
- Confirmed both HTML pages parse and `git diff --check` passes.

## 2026-09-11 — Editorial serif wordmark and charcoal accent

- Selected the editorial serif `jatin` direction for the live masthead on both the homepage and Pi page. The visible mark uses the same Didot/Bodoni system-serif stack as the chosen SVG, while the home link retains the accessible label “Jatin Pandey, home.”
- Replaced the previous indigo primary accent with warm charcoal `#42433f`, including its translucent and shadow variants. Updated the wordmark comparison artifacts to show the same final palette.
- Kept the five-option wordmark gallery and reusable SVG files as design-source artifacts. No content, routes, or project interactions changed.

## Verification

- Visually verified the homepage at desktop and 390 × 844, and the Pi page at 390 × 844. The serif mark remains centered, compact, and readable on both pages.
- Confirmed both home links expose the accessible label “Jatin Pandey, home.” HTML/SVG parsing, color assertions, and `git diff --check` pass.

## 2026-09-11 — Wordmark design exploration

- Created five isolated SVG wordmark directions under `design/wordmarks/`: Quiet grotesk, Custom monoline, Full signature, Editorial serif, and Wide caps.
- Matched the current homepage rather than introducing a separate brand system: warm bone background, near-black ink, restrained indigo accent, Avenir-like geometry, and minimal ornament.
- Ranked Quiet grotesk as the best immediate fit because it preserves the homepage’s calm editorial tone and remains legible in the existing compact sticky header. Custom monoline is the most ownable alternative if a more distinctive identity is preferred.
- Added a local comparison page at `design/wordmarks/index.html`. The live homepage and shared stylesheet are unchanged; no option has been selected or deployed.

## Verification

- Confirmed all five SVGs parse as XML and include accessible titles and descriptions.
- Confirmed the comparison page parses as HTML, displays all five assets, and remains single-column at narrow viewport widths.
- `git diff --check` passes for the exploration files and notes update.

## 2026-09-11 — Project list update

- Removed the Coherence iOS card from the homepage project list. The existing project detail file remains untouched because the request was to remove the app from Projects, not delete its source page.
- Added Flixelated as an external project linking to `https://flixelated.club`.
- Used the supplied screenshot as the project image and kept the description deliberately brief: “A daily film guessing game built around pixelated movie posters.”
- Kept the current homepage structure and styling intact. The larger interface revamp is still a concept decision and should be implemented only after a direction is chosen.

## Verification

- `git diff --check` passes.
- Served the site locally and confirmed the homepage, analytics script, and Flixelated screenshot all load successfully.
- Visually checked the project card at the default desktop viewport and at 390 × 844. The image scales without overflow, all three project cards remain readable, and the Flixelated link is exposed correctly to the accessibility tree.
- The local server reports only the pre-existing missing `/favicon.ico`; it does not affect this change.

## 2026-09-11 — PoolSuite-inspired local mockup

- Reworked the homepage into a playful retro desktop using a coral, cream, navy, teal, yellow, and green palette. The presentation borrows the leisure-software energy of PoolSuite without copying its branding or interface.
- Reorganized the existing About and Projects content into application-like windows, tactile project tiles, a postcard, and code-native tropical foliage.
- Kept navigation as ordinary semantic links, added a skip link and visible keyboard focus, respected reduced-motion preferences, and preserved narrow-screen layouts.
- Changed the homepage Flixelated destination to a new local project page. The project page links onward to `https://flixelated.club` and displays both the original gameplay screenshot and the newly supplied results screenshot.
- No deployment was requested or performed. This version is intended for local review first.

## Verification

- `git diff --check` passes, and both HTML documents parse without syntax errors using Python's standard HTML parser.
- Served the site locally on port 4173. Browser requests successfully loaded the homepage, shared stylesheet, both screenshot assets, and the Flixelated detail page.
- Visually checked the homepage and Flixelated page at the default desktop viewport and at 390 × 844. Corrected the detail-page title scale and the featured-card mobile stacking after those checks.
- The accessibility tree exposes the full navigation, project links, headings, screenshot descriptions, and outbound game links. The browser console contains no errors or warnings.

## 2026-09-11 — Retro interface correction

- Removed the invented email link and all other homepage copy that was not part of the pre-redesign site. The homepage now contains only the original name, About/Projects navigation, three About paragraphs, three project entries, and footer line.
- Removed the `JP`, `Bengaluru · online`, intro eyebrow, large added headline, and current-exploration strip.
- Replaced the pastel resort palette with dirty beige, charcoal, dark olive, tobacco brown, oxidized orange, and muted brass.
- Rebuilt navigation as large icon cells inspired by 1990s leisure software. The original About copy now appears on a pinned, folded, hard-shadowed 3D sticky note.
- Reworked projects into a software-directory window with three circular media objects, filename-like labels, and the original descriptions. This borrows the selection language of the supplied PoolSuite reference without reproducing its CD player.
- Applied the same darker retro system to the Flixelated detail page and removed added descriptive flourishes there while preserving its requested screenshots and live-game link.

## Verification

- `git diff --check` and standard-library HTML parsing pass.
- Visually verified the sticky note and project directory at 1280 × 800 and at the in-app browser's narrow viewport; verified the Flixelated page at the wide viewport.
- Confirmed through the accessibility tree that only the intended navigation, original homepage copy, project content, and footer remain. No browser console errors or warnings were found.

## 2026-09-11 — Typographic index with dimensional objects

- Replaced the rejected retro software treatment with a clean editorial index based on the approved typographic exploration.
- The desktop layout uses a sticky About rail and three full-width project rows. The wording remains limited to the previously approved site content; no “small projects” positioning is present.
- Each project row is anchored by a distinct CSS-built 3D object: a framed pixel-art slab for Flixelated, interlocking geometric blocks for Things, and a dark pi slab. Hovering or keyboard-focusing the row moves its object 72px toward the viewer in perspective.
- The interaction uses only compositor transforms, completes in 180ms, and becomes static under `prefers-reduced-motion`.
- Updated the Flixelated detail page to use the same bone, graphite, black, and vermilion design system.

## Verification

- `git diff --check` and standard-library HTML parsing pass.
- Visually verified the homepage at 1440 × 900 and 390 × 844, including the forward 3D focus state. Corrected a mobile About-label collision found during QA.
- Visually verified the Flixelated detail page at 390 × 844. The accessibility tree exposes all navigation, project links, and screenshot descriptions, and the browser console contains no warnings or errors.
- The local server remains available on port 4173. No deployment was performed.

## 2026-09-11 — Single-page index and Pi interaction

- Removed the About and Projects links from the top bar and reordered the homepage into one linear composition: About first, then Projects.
- Removed “messy” from the About copy and added the requested linked thought about the vanished distance between wishing, searching, and building.
- Reduced every project action to its arrow. Flixelated now links directly to `https://flixelated.club`, Things links to `https://github.com/jatinpandey/things`, and the unused local Flixelated landing page was removed.
- Rebuilt the Pi experience in the same bone, graphite, black, and vermilion editorial system while preserving its digit sequence, click interaction, Enter-key interaction, counter, and progressive reveal.
- Each new Pi digit animates from the viewport center toward its final inline position, shrinking from an exaggerated foreground scale over 180ms. The motion is skipped when reduced motion is requested.
- No deployment was requested or performed.

## Verification

- Standard-library HTML parsing, requested-copy/link assertions, and `git diff --check` pass.
- Confirmed in the local browser that the homepage exposes only the name in its top bar, places About before Projects, and points each project at the requested destination.
- Confirmed the Pi page visually at the narrow in-app viewport and tested both its button and Enter-key paths; each advances the digit string and updates the accessible count.

## 2026-09-11 — Compact homepage rhythm

- Replaced the oversized name heading with “About” and removed the redundant About label below it.
- Tightened the intro’s top padding, type scale, paragraph spacing, column gap, and bottom spacing so the section no longer fills an artificial viewport-height block.
- Turned the top-left name into a lowercase `jatinpandey` wordmark with contrasting weights and a single vermilion registration mark. The same home wordmark appears on the Pi page.
- Reduced the Projects heading lead-in and scale while retaining the dimensional project objects and existing content.
- Removed the final project-row border and the page’s empty bottom padding. The footer now draws one viewport-wide divider immediately above its content.
- No deployment was requested or performed.

## Verification

- Visually checked the revised About/Projects transition and the bottom of the homepage in the local browser. The footer follows the final project without an empty band or duplicate rule.
- Confirmed the wordmark remains an accessible home link with the readable label “Jatin Pandey, home.”
- Standard-library HTML parsing and `git diff --check` pass.

## 2026-09-11 — Unnumbered object collection

- Matched the Projects and Pi page title scales to the About heading and removed all decorative project numbers.
- Folded the tweet destination into the existing phrase “distance between having an idea and making something real,” removing the standalone linked quote.
- Removed repeated horizontal rules from the header, About transition, Projects heading, project rows, and Pi console. A small asymmetric black-and-vermilion block cluster marks major transitions, while generous staggered spacing separates project objects.
- Changed every external project link to open in the current tab.
- Rebuilt the Things object face from the supplied three-bar icon: a charcoal slab with one violet and two paper-colored rounded bars.
- Increased project-object depth on interaction. Pointer hover brings the object 150px toward the viewer in the first 196ms, then keeps it rotating slowly around its horizontal axis while hovered; keyboard focus gets the same forward depth without a loop, and reduced-motion users get a static state.
- Updated the Pi description on the homepage and Pi page to the requested meditative/party-trick wording.
- No deployment was requested or performed.

## Verification

- Confirmed the homepage has no target-new-tab attributes, project-number elements, standalone tweet text, or supersized Projects/Pi titles.
- Standard-library HTML parsing, CSS copy assertions, and `git diff --check` pass.

## 2026-09-11 — Footer social link and direct depth motion

- Extended both the homepage and Pi footer with a same-tab `𝕏 @jatinpandey` link to `https://x.com/jatinpandey`, retaining the existing footer copy and typographic treatment.
- Removed the project objects’ rotating hover loop. Hover and keyboard focus now move each object directly 150px toward the viewer without changing its resting orientation.
- Kept the 180ms compositor-only transition and the existing static reduced-motion behavior.
- No deployment was requested or performed.

## Verification

- Confirmed the X profile link appears in both page accessibility trees and has the label “Jatin Pandey on X.”
- Confirmed the object interaction no longer contains animation keyframes or rotation deltas.
- Standard-library HTML parsing and `git diff --check` pass.

## 2026-09-11 — Alignment, link restraint, and accent shortlist

- Simplified the wordmark to the larger lowercase word `jatin`; removed `pandey` and the vermilion registration square on both pages.
- Restored a subtle top-bar divider and replaced the asymmetric block separator with one inset rule that follows the site content margins.
- Removed the Things-row stagger so all three 3D objects share the same vertical axis. Mobile rows now center the object against their copy instead of top-aligning it.
- Centered the taste line and X profile link as one compact footer group.
- Reduced the X hover treatment to a conventional underline. Keyboard focus retains a visible outline, and the linked sentence uses the same restrained hover behavior.
- Kept the existing red accent temporarily because the user requested a shortlist before choosing its replacement. No logo dots were added while the accent decision is pending.
- No deployment was requested or performed.

## Verification

- Visually checked the wordmark, top-bar rule, inset About separator, aligned project objects, and centered footer in the local browser.
- Standard-library HTML parsing, removed-selector assertions, and `git diff --check` pass.

## 2026-09-11 — Project surfaces and cat peek

- Grouped each project’s object, copy, and arrow inside a lightly shaded graphite-tinted surface with a restrained border and soft elevation shadow. On mobile the arrow is pinned inside the card’s lower-right corner.
- Replaced the object depth movement with a CSS-built cat that rises from behind the object, remains visible, and retreats at the end of a three-second hover or keyboard-focus sequence. The entrance and exit each occupy 180ms, the animation uses only transform and opacity, and reduced-motion users see no animation.
- Removed the remaining black-and-vermilion dash motif from the Pi heading.
- Moved the Pi digit count above the reveal region and aligned it to the right. Moved the button/Enter instruction directly beneath the button.
- Made the homepage and Pi footers structurally and textually identical, including the taste line and X profile link, and set the social link to inherit the footer typography.
- No deployment was requested or performed.

## Verification

- Visually checked project grouping at the narrow local viewport and confirmed the arrow remains inside each surface.
- Visually checked the reordered Pi status and controls, then revealed a digit; the counter updated from zero to one in its new position.
- Confirmed both page accessibility trees expose the same footer content.
- Standard-library HTML parsing, motion-property assertions, and `git diff --check` pass.
