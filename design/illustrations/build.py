"""Generates the illustration samples in this folder as standalone SVGs.

Run: python3 design/illustrations/build.py
Each piece is 400 x 500 and self-contained, so any of them can be dropped
into the site with a plain <img>.
"""
import math
import random
from pathlib import Path

OUT = Path(__file__).parent
W, H = 400, 500

SHARED_DEFS = """
<filter id="grain" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="3"/>
  <feColorMatrix values="0 0 0 0 0.22 0 0 0 0 0.18 0 0 0 0 0.12 0 0 0 1.7 -0.66"/>
</filter>
<filter id="rough" x="-2%" y="-2%" width="104%" height="104%">
  <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="2" result="t"/>
  <feDisplacementMap in="SourceGraphic" in2="t" scale="4" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="grainIn" x="-5%" y="-5%" width="110%" height="110%">
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="3"/>
  <feColorMatrix values="0 0 0 0 0.22 0 0 0 0 0.18 0 0 0 0 0.12 0 0 0 0.95 -0.37" result="specks"/>
  <feComposite in="specks" in2="SourceAlpha" operator="in" result="clipped"/>
  <feComposite in="clipped" in2="SourceGraphic" operator="atop"/>
</filter>
<filter id="wash" x="-6%" y="-6%" width="112%" height="112%">
  <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="9" result="t"/>
  <feDisplacementMap in="SourceGraphic" in2="t" scale="10" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feGaussianBlur in="d" stdDeviation="0.7"/>
</filter>
"""


def svg(body, defs="", grain=0.55, title="", cutout=False):
    # cutouts keep a transparent ground, so grain is confined to the artwork itself
    art = f'<g filter="url(#grainIn)">{body}</g>' if cutout else (
        f'{body}<rect width="{W}" height="{H}" filter="url(#grain)" opacity="{grain}" style="mix-blend-mode:multiply"/>'
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img">'
        f"<title>{title}</title><defs>{SHARED_DEFS}{defs}</defs>{art}"
        "</svg>"
    )


# soft egg-shaped vignette for scenes that have no natural silhouette
BLOB = "M200 22 C300 16 382 92 386 214 C392 338 362 462 252 482 C150 498 38 470 20 332 C6 202 62 28 200 22 Z"


def vignette(body, clip_id, mirror=False):
    flip = ' transform="translate(400 0) scale(-1 1)"' if mirror else ""
    return (
        f'<clipPath id="{clip_id}"><path d="{BLOB}"{flip}/></clipPath>'
        f'<g filter="url(#wash)"><g clip-path="url(#{clip_id})">{body}</g></g>'
    )


def f(n):
    return f"{n:.1f}".rstrip("0").rstrip(".")


# ---------------------------------------------------------------- 01 ramen
def ramen(frame=True, cutout=False):
    ink, cream, verm = "#1a1612", "#ede3cc", "#c8432b"
    rnd = random.Random(1)
    sun_stripes = "".join(
        f'<rect x="60" y="{y}" width="280" height="{4 + i * 1.4:.1f}" fill="{cream}"/>'
        for i, y in enumerate(range(232, 330, 13))
    )
    noodles = []
    for row, y in enumerate(range(236, 300, 7)):
        d = f"M50 {y}"
        for k in range(16):
            d += f" q9 {-5 if (k + row) % 2 else 5} 18 0"
        noodles.append(f'<path d="{d}" fill="none" stroke="{ink}" stroke-width="2.6"/>')
    ground = "".join(
        f'<line x1="{x:.0f}" y1="{y:.0f}" x2="{x + rnd.uniform(14, 40):.0f}" y2="{y:.0f}" stroke="{ink}" stroke-width="2.2"/>'
        for x, y in ((rnd.uniform(30, 350), rnd.uniform(440, 470)) for _ in range(26))
    )
    body = f"""
{'' if cutout else f'<rect width="400" height="500" fill="{cream}"/>'}
<g filter="url(#rough)">
  <clipPath id="sunclip"><circle cx="200" cy="190" r="128"/></clipPath>
  <circle cx="200" cy="190" r="128" fill="{verm}"/>
  <g clip-path="url(#sunclip)">{sun_stripes}</g>
  <g fill="none" stroke="{ink}" stroke-width="6" stroke-linecap="round">
    <path d="M150 190 C128 160 172 142 150 104"/>
    <path d="M200 176 C178 140 222 122 200 80"/>
    <path d="M250 190 C228 160 272 142 250 104"/>
  </g>
  {ground}
  <g transform="translate(0 62)">
    <path d="M42 205 Q50 306 140 338 L150 372 L250 372 L260 338 Q350 306 358 205 Z" fill="{ink}"/>
    <g fill="none" stroke="{cream}" stroke-width="3">
      <path d="M66 252 Q200 306 334 252"/>
      <path d="M86 284 Q200 332 314 284"/>
      <path d="M152 362 L248 362"/>
      <path d="M120 312 l14 -10 l14 10 l14 -10 l14 10 l14 -10 l14 10 l14 -10 l14 10 l14 -10 l14 10 l14 -10"/>
    </g>
    <ellipse cx="200" cy="205" rx="158" ry="44" fill="{ink}"/>
    <clipPath id="broth"><ellipse cx="200" cy="208" rx="142" ry="33"/></clipPath>
    <ellipse cx="200" cy="208" rx="142" ry="33" fill="{cream}"/>
    <g clip-path="url(#broth)" transform="translate(0 -52)">{''.join(noodles)}</g>
    <path d="M186 140 L226 146 L222 204 L184 202 Z" fill="{ink}"/>
    <path d="M198 148 L196 200 M210 150 L208 202" stroke="{cream}" stroke-width="2.4"/>
    <path d="M226 150 L256 156 L248 206 L222 204 Z" fill="{ink}"/>
    <ellipse cx="148" cy="201" rx="33" ry="19" fill="#fbf6ea" stroke="{ink}" stroke-width="3"/>
    <ellipse cx="151" cy="201" rx="15" ry="9" fill="{verm}"/>
    <ellipse cx="276" cy="214" rx="22" ry="15" fill="#fbf6ea" stroke="{ink}" stroke-width="3"/>
    <path d="M276 214 m-2 0 a3 2.2 0 1 1 5 1.6 a7 5 0 1 1 -10 -4.4 a11 8 0 1 1 15 9" fill="none" stroke="{verm}" stroke-width="2.6"/>
    <g fill="none" stroke="{ink}" stroke-width="2.4">
      <circle cx="104" cy="214" r="5"/><circle cx="118" cy="224" r="4.5"/><circle cx="96" cy="200" r="4"/>
      <circle cx="186" cy="226" r="4.5"/><circle cx="236" cy="228" r="4"/>
    </g>
    <g stroke-linecap="round">
      <line x1="298" y1="196" x2="392" y2="96" stroke="{ink}" stroke-width="10"/>
      <line x1="312" y1="210" x2="394" y2="134" stroke="{ink}" stroke-width="10"/>
      <line x1="336" y1="160" x2="384" y2="108" stroke="{cream}" stroke-width="2"/>
      <line x1="346" y1="182" x2="386" y2="144" stroke="{cream}" stroke-width="2"/>
    </g>
  </g>
  {'<rect x="16" y="16" width="368" height="468" fill="none" stroke="' + ink + '" stroke-width="4"/>' if frame else ''}
  <rect x="324" y="418" width="44" height="48" rx="3" fill="{verm}"/>
  <text x="346" y="452" font-family="Hiragino Mincho ProN, serif" font-size="30" fill="{cream}" text-anchor="middle">麺</text>
</g>"""
    return svg(body, grain=0.6, title="Bowl of ramen, woodcut", cutout=cutout)


# ---------------------------------------------------------------- 02 coffee
def coffee():
    paper, blue, pink = "#f3eee2", "#2f4fa0", "#ff4fae"
    defs = f"""
<pattern id="dotP" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><circle cx="4.5" cy="4.5" r="2.6" fill="{pink}"/></pattern>
<pattern id="dotB" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="3.5" cy="3.5" r="1.9" fill="{blue}"/></pattern>"""
    cup = "M103 225 L127 348 Q200 378 273 348 L297 225 Z"
    body = f"""
<rect width="400" height="500" fill="{paper}"/>
<g style="mix-blend-mode:multiply" transform="translate(5 3)">
  <circle cx="200" cy="250" r="150" fill="url(#dotP)"/>
  <ellipse cx="200" cy="370" rx="152" ry="36" fill="{pink}"/>
  <path d="{cup}" fill="{paper}"/>
  <ellipse cx="200" cy="225" rx="97" ry="25" fill="{paper}"/>
  <path d="M296 250 C352 244 352 322 280 320" fill="none" stroke="{paper}" stroke-width="16"/>
  <g fill="{pink}">
    <path d="M62 120 l6 16 l16 6 l-16 6 l-6 16 l-6 -16 l-16 -6 l16 -6 Z"/>
    <path d="M340 150 l4 11 l11 4 l-11 4 l-4 11 l-4 -11 l-11 -4 l11 -4 Z"/>
    <path d="M330 420 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z"/>
  </g>
</g>
<g style="mix-blend-mode:multiply">
  <ellipse cx="200" cy="370" rx="152" ry="36" fill="none" stroke="{blue}" stroke-width="4"/>
  <path d="M232 232 L297 225 L273 348 Q250 358 226 364 Z" fill="url(#dotB)"/>
  <path d="{cup}" fill="none" stroke="{blue}" stroke-width="5" stroke-linejoin="round"/>
  <ellipse cx="200" cy="225" rx="97" ry="25" fill="none" stroke="{blue}" stroke-width="5"/>
  <ellipse cx="200" cy="228" rx="82" ry="17" fill="{blue}"/>
  <path d="M200 240 C176 226 181 212 193 214 C198 215 200 220 200 222 C200 220 202 215 207 214 C219 212 224 226 200 240 Z" fill="{paper}"/>
  <path d="M296 250 C352 244 352 322 280 320" fill="none" stroke="{blue}" stroke-width="12" stroke-linecap="round"/>
  <g fill="none" stroke="{blue}" stroke-width="5" stroke-linecap="round">
    <path d="M168 186 C148 156 188 140 168 104"/>
    <path d="M212 180 C192 146 232 130 212 90"/>
    <path d="M254 186 C234 156 274 140 254 104"/>
  </g>
  <text x="200" y="458" font-family="Georgia, serif" font-style="italic" font-size="30" fill="{blue}" text-anchor="middle">slow mornings</text>
</g>"""
    return svg(body, defs, grain=0.7, title="Coffee cup, risograph")


# ---------------------------------------------------------------- 03 ravi varma homage
def varma():
    gold, crimson = "#d4a345", "#8f1d1f"
    defs = """
<radialGradient id="rvBg" cx="72%" cy="62%" r="85%"><stop offset="0" stop-color="#6b4222"/><stop offset=".45" stop-color="#2f1c0f"/><stop offset="1" stop-color="#0f0805"/></radialGradient>
<radialGradient id="rvGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(300 352) scale(230)"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".75"/><stop offset=".35" stop-color="#e98b35" stop-opacity=".28"/><stop offset="1" stop-color="#e98b35" stop-opacity="0"/></radialGradient>
<linearGradient id="rvSkin" x1="1" y1="0" x2="0" y2=".3"><stop offset="0" stop-color="#e7b287"/><stop offset=".55" stop-color="#b87649"/><stop offset="1" stop-color="#6e3f22"/></linearGradient>
<linearGradient id="rvSari" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c33a2c"/><stop offset=".5" stop-color="#8f1d1f"/><stop offset="1" stop-color="#3d0a0d"/></linearGradient>
<linearGradient id="rvGreen" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f7a45"/><stop offset="1" stop-color="#1c2e1a"/></linearGradient>
<linearGradient id="rvFrame" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3d58a"/><stop offset=".3" stop-color="#a8752a"/><stop offset=".55" stop-color="#f0cf7c"/><stop offset=".8" stop-color="#7a5119"/><stop offset="1" stop-color="#d9ad55"/></linearGradient>
<pattern id="canvas" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0h4M0 2h4" stroke="#000" stroke-width=".5" opacity=".35"/><path d="M1 0v4M3 0v4" stroke="#fff" stroke-width=".4" opacity=".15"/></pattern>
<filter id="oil" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency="0.06 0.02" numOctaves="3" seed="5" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="3.5" xChannelSelector="R" yChannelSelector="G"/></filter>"""
    jasmine = "".join(
        f'<circle cx="{126 + 40 * math.cos(a):.1f}" cy="{196 + 40 * math.sin(a):.1f}" r="4.2" fill="#f6efdc"/>'
        for a in [math.radians(d) for d in range(110, 290, 16)]
    )
    border_dots = "".join(
        f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2" fill="#f5d88f"/>'
        for x, y in ((150 + t * 1.05 + 18 * math.sin(t / 60), 300 + t) for t in range(10, 200, 13))
    )
    body = f"""
<rect width="400" height="500" fill="url(#rvBg)"/>
<g filter="url(#oil)">
  <path d="M40 500 C60 440 50 380 30 330 L0 330 L0 500 Z" fill="#1e120a"/>
  <path d="M340 420 L400 400 L400 500 L330 500 Z" fill="#3b2412"/>
  <path d="M104 300 C150 270 232 278 270 304 C312 336 330 420 338 500 L52 500 C60 420 70 330 104 300 Z" fill="url(#rvSari)"/>
  <path d="M236 290 C268 300 288 322 300 352 L284 368 C270 340 250 318 222 306 Z" fill="url(#rvGreen)"/>
  <path d="M290 346 C300 360 304 372 300 384 L270 380 C276 366 280 356 290 346 Z" fill="url(#rvSkin)"/>
  <path d="M142 290 C196 320 232 372 246 500" fill="none" stroke="{gold}" stroke-width="11"/>
  <path d="M142 290 C196 320 232 372 246 500" fill="none" stroke="#6b1414" stroke-width="2" stroke-dasharray="3 7"/>
  {border_dots}
  <path d="M96 318 C120 360 124 430 118 500" fill="none" stroke="#5a0f12" stroke-width="3" opacity=".7"/>
  <path d="M176 330 C190 380 196 440 190 500" fill="none" stroke="#5a0f12" stroke-width="3" opacity=".6"/>
  <path d="M196 112 C214 112 226 126 228 150 C229 160 232 166 240 180 C242 184 238 187 232 188 C234 192 234 196 236 199 C233 202 230 203 231 206 C233 209 232 214 228 218 C226 226 222 232 212 236 C204 239 196 238 190 236 L190 268 C204 276 220 282 232 292 L130 302 C146 282 156 262 156 240 C140 220 150 150 196 112 Z" fill="url(#rvSkin)"/>
  <path d="M202 104 C158 96 124 128 128 172 C130 200 146 222 160 236 C168 226 172 204 182 184 C192 164 200 146 218 132 C214 116 210 108 202 104 Z" fill="#140c08"/>
  <circle cx="124" cy="196" r="32" fill="#140c08" stroke="#5b3a20" stroke-width="2"/>
  <path d="M206 106 C226 112 224 124 218 132" fill="none" stroke="#8a5a30" stroke-width="2.5" stroke-linecap="round"/>
  {jasmine}
  <path d="M206 158 Q216 154 224 159" fill="none" stroke="#2b160c" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M204 150 Q214 143 226 148" fill="none" stroke="#1c0f08" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="226" cy="138" r="2.6" fill="#b3121a"/>
  <circle cx="234" cy="190" r="3.2" fill="none" stroke="{gold}" stroke-width="1.6"/>
  <path d="M229 205 Q233 207 231 209" fill="none" stroke="#7b2a22" stroke-width="2.4"/>
  <circle cx="194" cy="214" r="5" fill="{gold}"/>
  <path d="M186 222 L202 222 L198 240 L190 240 Z" fill="{gold}"/>
  <path d="M190 268 C204 276 220 282 232 292" fill="none" stroke="{gold}" stroke-width="5" stroke-dasharray="6 3"/>
  <ellipse cx="300" cy="376" rx="26" ry="9" fill="#b98a3a"/>
  <path d="M274 376 Q300 398 326 376" fill="#8a6225"/>
  <path d="M300 368 C290 356 296 340 300 330 C304 340 310 356 300 368 Z" fill="#fff2b3"/>
</g>
<rect width="400" height="500" fill="url(#rvGlow)" style="mix-blend-mode:screen"/>
<rect width="400" height="500" fill="url(#canvas)" opacity=".5" style="mix-blend-mode:overlay"/>
<rect x="9" y="9" width="382" height="482" fill="none" stroke="url(#rvFrame)" stroke-width="18"/>
<rect x="19" y="19" width="362" height="462" fill="none" stroke="#2a1a08" stroke-width="2"/>"""
    return svg(body, defs, grain=0.35, title="Woman with a brass lamp, after Raja Ravi Varma")


# ---------------------------------------------------------------- 04 ghibli-style pastoral
def pastoral(cutout=False):
    rnd = random.Random(4)

    def cloud(cx, cy, s):
        puffs = [(-60, 10, 38), (-24, -18, 50), (22, -34, 58), (66, -8, 46), (98, 16, 32), (-90, 26, 26), (10, 20, 44)]
        light = "".join(f'<circle cx="{cx + x * s:.0f}" cy="{cy + y * s:.0f}" r="{r * s:.0f}"/>' for x, y, r in puffs)
        shade = "".join(f'<circle cx="{cx + x * s + 6:.0f}" cy="{cy + y * s + 14 * s:.0f}" r="{r * s * 0.86:.0f}"/>' for x, y, r in puffs)
        return f'<g fill="#bcd3e6">{shade}</g><g fill="#fffdf6">{light}</g>'

    grass = "".join(
        f'<path d="M{x:.0f} {y:.0f} q{rnd.uniform(2, 6):.1f} {-rnd.uniform(8, 16):.1f} {rnd.uniform(8, 16):.1f} {-rnd.uniform(14, 24):.1f}" '
        f'stroke="{rnd.choice(["#b8dc7a", "#3f7a38", "#7fb85a"])}" stroke-width="2" fill="none" stroke-linecap="round"/>'
        for x, y in ((rnd.uniform(0, 400), rnd.uniform(405, 500)) for _ in range(110))
    )
    body = f"""
<defs>
  <linearGradient id="pSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5eaede"/><stop offset=".6" stop-color="#a9d6ee"/><stop offset="1" stop-color="#e4f2ef"/></linearGradient>
  <linearGradient id="pHill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ccc62"/><stop offset="1" stop-color="#5a9a44"/></linearGradient>
</defs>
<rect width="400" height="500" fill="url(#pSky)"/>
<g filter="url(#wash)">
  {cloud(150, 170, 1.55)}
  {cloud(340, 250, 0.6)}
  <path d="M0 318 C60 290 110 300 160 308 C220 290 300 280 400 300 L400 360 L0 360 Z" fill="#7aa6c4" opacity=".75"/>
  <path d="M0 350 C80 320 170 330 240 346 C300 334 360 330 400 338 L400 500 L0 500 Z" fill="url(#pHill)"/>
  <path d="M0 410 C90 380 220 392 400 380 L400 500 L0 500 Z" fill="#4f8d3e"/>
  <path d="M150 500 C170 460 210 430 196 400 C188 380 206 366 232 356" fill="none" stroke="#e8d9a8" stroke-width="10" stroke-linecap="round"/>
  <g transform="translate(70 318)">
    <rect x="0" y="14" width="44" height="30" fill="#f6f0e0"/>
    <path d="M-6 16 L22 -6 L50 16 Z" fill="#c0433a"/>
    <rect x="30" y="-6" width="6" height="14" fill="#8b5a3c"/>
    <rect x="8" y="24" width="8" height="9" fill="#5b87a8"/><rect x="26" y="24" width="8" height="12" fill="#6b4a33"/>
  </g>
  <rect x="297" y="298" width="10" height="70" fill="#5a4030"/>
  <g fill="#2f6b34"><circle cx="302" cy="270" r="44"/><circle cx="268" cy="292" r="30"/><circle cx="338" cy="290" r="32"/><circle cx="300" cy="236" r="30"/></g>
  <g fill="#5c9a46"><circle cx="290" cy="254" r="22"/><circle cx="318" cy="228" r="14"/><circle cx="264" cy="282" r="14"/></g>
</g>
{grass}
<g transform="translate(214 382)">
  <path d="M-7 30 L0 4 L7 30 Z" fill="#d9493c"/>
  <circle cx="0" cy="0" r="5" fill="#f1c9a5"/>
  <ellipse cx="0" cy="-3" rx="10" ry="2.6" fill="#e9cf7a"/>
  <path d="M-4 -4 Q0 -10 4 -4" fill="#e9cf7a"/>
</g>
<g fill="none" stroke="#39506a" stroke-width="1.8" stroke-linecap="round">
  <path d="M300 110 q6 -6 12 0 q6 -6 12 0"/><path d="M334 132 q5 -5 10 0 q5 -5 10 0"/>
</g>"""
    if cutout:
        body = vignette(body, "dayClip")
    return svg(body, grain=0.45, title="Hillside with cumulus clouds, in the spirit of Studio Ghibli", cutout=cutout)


# ---------------------------------------------------------------- 05 van gogh homage
def starry(cutout=False):
    rnd = random.Random(11)
    vortices = [(170, 170, 70, 1.4), (290, 120, 42, -0.9), (80, 90, 40, 1.0)]
    moon = (338, 78)
    stars = [(60, 200, 16), (235, 60, 12), (130, 60, 11), (250, 230, 14), (370, 210, 10), (32, 60, 9)]
    if cutout:
        moon = (296, 112)
        stars = [(62, 210, 16), (225, 66, 12), (130, 78, 11), (250, 236, 14), (344, 228, 10), (96, 136, 9)]

    def horizon(x):
        return 318 + 22 * math.sin(x / 70) + 10 * math.sin(x / 23)

    def flow(x, y):
        vx, vy = 1.0, 0.0
        for cx, cy, r, s in vortices:
            dx, dy = x - cx, y - cy
            d = math.hypot(dx, dy) + 1e-3
            w = s * math.exp(-((d - r) ** 2) / (2 * (r * 0.8) ** 2))
            vx += -dy / d * w * 1.8
            vy += dx / d * w * 1.8
        for cx, cy, r in [(moon[0], moon[1], 30)] + stars:
            dx, dy = x - cx, y - cy
            d = math.hypot(dx, dy) + 1e-3
            w = math.exp(-d / (r * 2.2)) * 3
            vx += -dy / d * w
            vy += dx / d * w
        n = math.hypot(vx, vy)
        return vx / n, vy / n

    strokes = []

    def stroke(pts, color, width):
        d = "M" + " L".join(f"{f(x)} {f(y)}" for x, y in pts)
        strokes.append(f'<path d="{d}" stroke="{color}" stroke-width="{width}"/>')

    sky_blues = ["#1c347c", "#24438f", "#3560ad", "#4f7cc2", "#86a9d8", "#b9cfe9"]
    yellows = ["#f4d65e", "#e9b93a", "#fff0a6", "#d6a331"]
    for _ in range(2300):
        x, y = rnd.uniform(-10, 410), rnd.uniform(-10, 340)
        if y > horizon(x):
            continue
        near = min(math.hypot(x - cx, y - cy) / r for cx, cy, r in [(moon[0], moon[1], 26)] + stars)
        swirl = max(math.exp(-((math.hypot(x - cx, y - cy) - r) ** 2) / (2 * 18**2)) for cx, cy, r, _ in vortices)
        if near < 2.4 and rnd.random() < 1.3 - near / 2.4:
            color = rnd.choice(yellows)
        elif swirl > 0.5 and rnd.random() < 0.7:
            color = rnd.choice(sky_blues[3:])
        else:
            color = rnd.choice(sky_blues[:4])
        pts = [(x, y)]
        for _ in range(rnd.randint(3, 6)):
            vx, vy = flow(*pts[-1])
            pts.append((pts[-1][0] + vx * 3.4, pts[-1][1] + vy * 3.4))
        stroke(pts, color, rnd.choice([3, 3.5, 4]))

    hill_cols = ["#1b2c55", "#243a66", "#2f4d72", "#1d3b45", "#34506a"]
    for _ in range(900):
        x = rnd.uniform(-10, 410)
        y = rnd.uniform(horizon(x), 500)
        slope = (horizon(x + 1) - horizon(x - 1)) / 2 * max(0, 1 - (y - horizon(x)) / 80)
        ang = math.atan(slope) + rnd.uniform(-0.15, 0.15)
        L = rnd.uniform(7, 14)
        col = rnd.choice(hill_cols if y < 430 else ["#1f3a2a", "#2d4a2f", "#3b5a36", "#20301f", "#4a6340"])
        stroke([(x, y), (x + math.cos(ang) * L, y + math.sin(ang) * L)], col, 3.5)

    houses = []
    for i, (hx, hy, hw) in enumerate([(170, 404, 26), (200, 412, 22), (230, 398, 30), (266, 410, 24), (300, 402, 28), (334, 414, 22), (140, 416, 22)]):
        houses.append(f'<rect x="{hx}" y="{hy}" width="{hw}" height="18" fill="#2a3b57" stroke="#0f1a2c" stroke-width="2"/>')
        houses.append(f'<path d="M{hx - 3} {hy} L{hx + hw / 2} {hy - 11} L{hx + hw + 3} {hy} Z" fill="#3f4e6e" stroke="#0f1a2c" stroke-width="2"/>')
        if i % 2 == 0:
            houses.append(f'<rect x="{hx + 5}" y="{hy + 5}" width="6" height="6" fill="#f4d65e"/>')
    houses.append('<path d="M244 398 L250 340 L256 398 Z" fill="#2a3b57" stroke="#0f1a2c" stroke-width="2"/>')

    cypress_path = "M92 500 C40 440 70 380 58 320 C52 280 70 230 66 190 C64 160 78 120 86 96 C96 130 104 170 112 210 C122 260 118 300 132 350 C146 410 150 460 132 500 Z"
    cyp = []
    for _ in range(420):
        x, y = rnd.uniform(40, 150), rnd.uniform(90, 500)
        ang = -math.pi / 2 + rnd.uniform(-0.35, 0.35) + 0.2 * math.sin(y / 30)
        L = rnd.uniform(8, 16)
        col = rnd.choice(["#16241a", "#223a24", "#2f4a2a", "#3d5c33", "#0e1510", "#5b5a2a"])
        cyp.append(f'<path d="M{f(x)} {f(y)} l{f(math.cos(ang) * L)} {f(math.sin(ang) * L)}" stroke="{col}" stroke-width="4"/>')

    halos = "".join(
        f'<circle cx="{cx}" cy="{cy}" r="{r * k:.1f}" fill="none" stroke="{c}" stroke-width="3" stroke-dasharray="7 4"/>'
        for cx, cy, r in stars
        for k, c in [(1.0, "#fff4b8"), (1.6, "#f4d65e")]
    )
    star_cores = "".join(f'<circle cx="{cx}" cy="{cy}" r="{r * 0.55:.1f}" fill="#fff7cf"/>' for cx, cy, r in stars)
    body = f"""
<rect width="400" height="500" fill="#1a2d6a"/>
<g stroke-linecap="round" fill="none">{''.join(strokes)}</g>
{halos}{star_cores}
<g fill="none" stroke-dasharray="9 4" stroke-width="4">
  <circle cx="{moon[0]}" cy="{moon[1]}" r="44" stroke="#e9b93a"/>
  <circle cx="{moon[0]}" cy="{moon[1]}" r="34" stroke="#fff0a6"/>
</g>
<circle cx="{moon[0]}" cy="{moon[1]}" r="24" fill="#f8d956"/>
<circle cx="{moon[0] + 11}" cy="{moon[1] - 6}" r="19" fill="#c78e24"/>
{''.join(houses)}
<clipPath id="cyp"><path d="{cypress_path}"/></clipPath>
<path d="{cypress_path}" fill="#15211a"/>
<g clip-path="url(#cyp)" stroke-linecap="round">{''.join(cyp)}</g>"""
    if cutout:
        body = vignette(body, "nightClip", mirror=True)
    return svg(body, grain=0.4, title="Swirling night sky over a village, after Van Gogh", cutout=cutout)


# ---------------------------------------------------------------- 06 chai cart matchbox label
def chai():
    ink, red, cream, mustard, teal = "#1d1a17", "#b8322a", "#f4e6c4", "#e7b43a", "#1f6d68"
    stripes = "".join(
        f'<path d="M200 118 L{x0} 196 L{x1} 196 Z" fill="{red if i % 2 == 0 else cream}"/>'
        for i, (x0, x1) in enumerate(zip(range(70, 330, 26), range(96, 356, 26)))
    )
    glasses = "".join(
        f'<g transform="translate({x} 256)"><path d="M0 0 L20 0 L17 30 L3 30 Z" fill="{cream}" stroke="{ink}" stroke-width="2.5"/>'
        f'<path d="M1.6 10 L18.4 10 L17 30 L3 30 Z" fill="#b97a3f"/><path d="M4 4 L6 26" stroke="#fff" stroke-width="1.5" opacity=".6"/></g>'
        for x in (112, 140, 168)
    )
    body = f"""
<rect width="400" height="500" fill="{red}"/>
<g filter="url(#rough)">
  <rect x="18" y="18" width="364" height="464" fill="{cream}"/>
  <rect x="28" y="28" width="344" height="444" fill="{mustard}" stroke="{ink}" stroke-width="3"/>
  <g fill="{red}">
    <circle cx="48" cy="48" r="8"/><circle cx="352" cy="48" r="8"/><circle cx="48" cy="452" r="8"/><circle cx="352" cy="452" r="8"/>
  </g>
  <path d="M60 58 H340 L326 82 L340 106 H60 L74 82 Z" fill="{red}" stroke="{ink}" stroke-width="3"/>
  <text x="200" y="96" font-family="Rockwell, 'Arial Black', serif" font-weight="700" font-size="36" letter-spacing="10" fill="{cream}" text-anchor="middle">CHAI</text>
  <circle cx="200" cy="300" r="150" fill="#f0cc6a"/>
  <line x1="200" y1="118" x2="200" y2="370" stroke="{ink}" stroke-width="5"/>
  {stripes}
  <path d="M70 196 L330 196" stroke="{ink}" stroke-width="3"/>
  <path d="M200 118 L70 196 M200 118 L330 196" stroke="{ink}" stroke-width="3" fill="none"/>
  <path d="M70 196 q13 12 26 0 q13 12 26 0 q13 12 26 0 q13 12 26 0 q13 12 26 0 q13 12 26 0 q13 12 26 0 q13 12 26 0 q13 12 26 0 q13 12 26 0" fill="{cream}" stroke="{ink}" stroke-width="3"/>
  <rect x="88" y="286" width="224" height="84" fill="{teal}" stroke="{ink}" stroke-width="4"/>
  <rect x="100" y="298" width="200" height="60" fill="none" stroke="{cream}" stroke-width="2" stroke-dasharray="6 5"/>
  <text x="200" y="336" font-family="Georgia, serif" font-style="italic" font-size="20" fill="{cream}" text-anchor="middle">garam · meetha</text>
  <rect x="80" y="280" width="240" height="10" fill="#8a4b2a" stroke="{ink}" stroke-width="3"/>
  {glasses}
  <rect x="222" y="262" width="56" height="18" fill="#3a3a3a" stroke="{ink}" stroke-width="3"/>
  <path d="M228 262 C224 226 276 226 272 262 Z" fill="#c9923b" stroke="{ink}" stroke-width="3"/>
  <path d="M272 244 C292 240 296 226 306 220" fill="none" stroke="{ink}" stroke-width="5"/>
  <path d="M232 236 C220 240 218 252 226 256" fill="none" stroke="{ink}" stroke-width="4"/>
  <rect x="244" y="220" width="12" height="8" fill="#c9923b" stroke="{ink}" stroke-width="2.5"/>
  <g fill="none" stroke="{cream}" stroke-width="4" stroke-linecap="round">
    <path d="M300 208 C292 196 308 190 300 176"/><path d="M314 214 C306 200 322 194 314 180"/>
  </g>
  <g fill="{cream}" stroke="{ink}" stroke-width="4">
    <circle cx="130" cy="392" r="30"/><circle cx="270" cy="392" r="30"/>
  </g>
  <g stroke="{ink}" stroke-width="3">
    <path d="M130 362 V422 M100 392 H160 M109 371 L151 413 M151 371 L109 413"/>
    <path d="M270 362 V422 M240 392 H300 M249 371 L291 413 M291 371 L249 413"/>
  </g>
  <circle cx="130" cy="392" r="6" fill="{red}" stroke="{ink}" stroke-width="2"/>
  <circle cx="270" cy="392" r="6" fill="{red}" stroke="{ink}" stroke-width="2"/>
  <path d="M312 300 L350 276" stroke="{ink}" stroke-width="6" stroke-linecap="round"/>
  <rect x="40" y="430" width="320" height="30" fill="{ink}"/>
  <text x="200" y="451" font-family="'Courier New', monospace" font-weight="700" font-size="13" letter-spacing="3" fill="{mustard}" text-anchor="middle">★ BEST QUALITY · MADE IN BLR ★</text>
</g>"""
    return svg(body, grain=0.75, title="Chai cart, vintage matchbox label")


# ---------------------------------------------------------------- 07 masala dosa watercolor plate
def dosa(cutout=False):
    rnd = random.Random(7)
    ink = "#4a4136"
    lace = "".join(
        f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{rnd.uniform(2, 7):.1f}" ry="{rnd.uniform(1.5, 4):.1f}" fill="#9a5a20" opacity="{rnd.uniform(.25, .6):.2f}"/>'
        for x, y in ((rnd.uniform(-120, 120), rnd.uniform(-26, 26)) for _ in range(70))
    )
    seeds = "".join(
        f'<circle cx="{256 + rnd.uniform(-26, 26):.0f}" cy="{392 + rnd.uniform(-20, 20):.0f}" r="1.6" fill="#2b2218"/>'
        for _ in range(14)
    )
    sambar_bits = "".join(
        f'<ellipse cx="{120 + rnd.uniform(-28, 28):.0f}" cy="{390 + rnd.uniform(-22, 22):.0f}" rx="{rnd.uniform(2, 5):.1f}" ry="2" fill="{rnd.choice(["#e9a23b", "#6f8f3a", "#b5462a", "#f3d27a"])}"/>'
        for _ in range(18)
    )
    CAPTION = f"""<g font-family="'Snell Roundhand', 'Apple Chancery', cursive" fill="{ink}">
  <text x="200" y="490" font-size="18" text-anchor="middle">Masala Dosa — pl. VII</text>
</g>
<g stroke="{ink}" stroke-width=".8" fill="none" opacity=".5">
  <path d="M358 392 L382 380"/><path d="M358 404 L382 404"/>
</g>"""
    veins = "".join(
        f'<path d="M{200 + (t - 0.5) * 60:.0f} {40 + t * 360:.0f} q{-80 - t * 20:.0f} {30:.0f} {-150:.0f} {80 + t * 10:.0f}" stroke="#5f8f45" stroke-width="1.4" fill="none" opacity=".55"/>'
        f'<path d="M{200 + (t - 0.5) * 60:.0f} {40 + t * 360:.0f} q{80 + t * 20:.0f} {30:.0f} {150:.0f} {80 + t * 10:.0f}" stroke="#5f8f45" stroke-width="1.4" fill="none" opacity=".55"/>'
        for t in [i / 16 for i in range(1, 16)]
    )
    body = f"""
<defs>
  <linearGradient id="dLeaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a9cf7a"/><stop offset=".5" stop-color="#7fb35a"/><stop offset="1" stop-color="#4f8a3d"/></linearGradient>
  <linearGradient id="dRoll" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2c775"/><stop offset=".45" stop-color="#d99a45"/><stop offset="1" stop-color="#a8652a"/></linearGradient>
  <radialGradient id="dSteel" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#f4f4f1"/><stop offset=".6" stop-color="#c3c4c2"/><stop offset="1" stop-color="#8c8e8c"/></radialGradient>
</defs>
{'' if cutout else '<rect width="400" height="500" fill="#f6f1e6"/>'}
<g filter="url(#wash)">
  <path d="M60 30 C160 10 300 20 350 60 C380 170 380 330 340 440 C260 470 130 470 60 440 C30 330 26 150 60 30 Z" fill="url(#dLeaf)" opacity=".92"/>
  {veins}
  <path d="M200 26 C204 170 196 330 200 466" stroke="#c7dca0" stroke-width="5" fill="none"/>
  <g transform="translate(204 222) rotate(-30) scale(1.18 1.5)">
    <ellipse cx="0" cy="12" rx="150" ry="40" fill="#3f6b33" opacity=".35"/>
    <path d="M-150 -26 L150 -34 C170 -20 170 24 150 34 L-150 26 C-164 14 -164 -14 -150 -26 Z" fill="url(#dRoll)"/>
    {lace}
    <ellipse cx="-150" cy="0" rx="14" ry="26" fill="#e7b54d"/>
    <ellipse cx="-150" cy="0" rx="9" ry="18" fill="#f1d468"/>
    <circle cx="-150" cy="-4" r="3" fill="#7b9b3a"/><circle cx="-146" cy="8" r="2.4" fill="#c0521f"/>
    <path d="M-120 -24 C-40 -28 60 -34 140 -30" stroke="#fff3cf" stroke-width="3" fill="none" opacity=".6"/>
  </g>
  <circle cx="120" cy="390" r="54" fill="url(#dSteel)"/>
  <circle cx="120" cy="390" r="42" fill="#c9692f"/>
  {sambar_bits}
  <circle cx="256" cy="392" r="50" fill="url(#dSteel)"/>
  <circle cx="256" cy="392" r="38" fill="#f1ecd9"/>
  {seeds}
  <circle cx="318" cy="96" r="32" fill="url(#dSteel)"/>
  <circle cx="318" cy="96" r="23" fill="#b8402a"/>
</g>
{"" if cutout else CAPTION}"""
    return svg(body, grain=0.5, title="Masala dosa on a banana leaf, watercolour plate", cutout=cutout)


# ---------------------------------------------------------------- 08 hampi boulder poster
def hampi():
    cream, ink = "#f2e6cc", "#2a1c17"
    body = f"""
<defs>
  <linearGradient id="hSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2694a"/><stop offset=".55" stop-color="#f0a35b"/><stop offset="1" stop-color="#f6d08a"/></linearGradient>
</defs>
<rect width="400" height="500" fill="{cream}"/>
<rect x="16" y="16" width="368" height="384" fill="url(#hSky)"/>
<circle cx="276" cy="150" r="54" fill="#fbe3a4"/>
<g fill="#fbe3a4" opacity=".55">
  <rect x="16" y="170" width="368" height="3"/><rect x="16" y="182" width="368" height="2"/><rect x="16" y="192" width="368" height="1.5"/>
</g>
<path d="M16 262 L60 234 L96 250 L140 214 L186 246 L230 226 L276 250 L330 222 L384 244 L384 400 L16 400 Z" fill="#b8566a"/>
<path d="M16 300 C40 276 70 280 88 292 C104 270 140 266 160 290 C190 280 220 290 232 306 L232 400 L16 400 Z" fill="#8a3b52"/>
<g fill="#a8583a">
  <ellipse cx="300" cy="360" rx="96" ry="58"/>
  <ellipse cx="246" cy="302" rx="52" ry="40"/>
  <ellipse cx="328" cy="270" rx="44" ry="46"/>
</g>
<g fill="#7a3a2a">
  <path d="M300 418 C240 418 200 390 206 360 C240 386 320 392 396 360 L396 418 Z"/>
  <path d="M290 318 C270 334 220 336 196 310 C206 330 250 346 290 332 Z"/>
  <path d="M360 300 C350 316 320 316 300 300 C320 320 350 322 366 306 Z"/>
</g>
<g fill="#d27a4c"><path d="M226 276 C236 266 256 264 268 272 C252 270 238 274 226 284 Z"/><path d="M304 240 C316 230 336 230 348 240 C332 238 318 242 306 250 Z"/></g>
<g fill="none" stroke="#e59a62" stroke-width="3" stroke-linecap="round" opacity=".8">
  <path d="M292 232 C310 222 340 222 356 236"/><path d="M204 296 C214 276 236 264 258 264"/><path d="M216 350 C240 310 300 298 350 306"/>
</g>
<g stroke="{ink}" stroke-linecap="round" stroke-linejoin="round" fill="none">
  <path d="M352 262 L346 244 L350 228" stroke-width="3.5"/>
  <path d="M352 262 L362 240" stroke-width="3.5"/>
  <path d="M352 262 L346 286" stroke-width="7"/>
  <path d="M346 286 L360 298 L356 314" stroke-width="4"/>
  <path d="M346 286 L336 304 L344 316" stroke-width="4"/>
</g>
<circle cx="354" cy="254" r="6" fill="{ink}"/>
<rect x="318" y="384" width="60" height="12" rx="3" fill="#2f5f73"/>
<rect x="16" y="400" width="368" height="84" fill="{ink}"/>
<text x="200" y="448" font-family="Futura, 'Avenir Next Condensed', 'Arial Narrow', sans-serif" font-weight="700" font-size="44" letter-spacing="16" fill="{cream}" text-anchor="middle">HAMPI</text>
<text x="200" y="472" font-family="Futura, 'Avenir Next', sans-serif" font-size="11" letter-spacing="5" fill="#f0a35b" text-anchor="middle">GRANITE · SUNRISE · KARNATAKA</text>"""
    return svg(body, grain=0.8, title="Climber on Hampi boulders, travel poster")


# ---------------------------------------------------------------- 09 armillary engraving
def armillary():
    sepia, paper = "#3a2918", "#efe4cb"
    cx, cy = 200, 222

    def ring(rx, ry, rot, w=7, ticks=0):
        el = (
            f'<g transform="translate({cx} {cy}) rotate({rot})">'
            f'<ellipse rx="{rx}" ry="{ry}" fill="none" stroke="{sepia}" stroke-width="{w + 2.4}"/>'
            f'<ellipse rx="{rx}" ry="{ry}" fill="none" stroke="{paper}" stroke-width="{w}"/>'
        )
        for i in range(ticks):
            a = 2 * math.pi * i / ticks
            x, y = rx * math.cos(a), ry * math.sin(a)
            nx, ny = math.cos(a) / rx, math.sin(a) / ry
            n = math.hypot(nx, ny)
            nx, ny = nx / n * w / 2, ny / n * w / 2
            el += f'<line x1="{f(x - nx)}" y1="{f(y - ny)}" x2="{f(x + nx)}" y2="{f(y + ny)}" stroke="{sepia}" stroke-width=".8"/>'
        return el + "</g>"

    hatch = f'<pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="4" stroke="{sepia}" stroke-width="1.1"/></pattern>'
    cross = f'<pattern id="cross" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><line x1="0" y1="0" x2="0" y2="4" stroke="{sepia}" stroke-width="1"/></pattern>'
    globe_lines = "".join(
        f'<ellipse cx="{cx}" cy="{cy}" rx="{24 * abs(math.cos(math.radians(a))):.1f}" ry="24" fill="none" stroke="{sepia}" stroke-width=".7"/>'
        for a in range(0, 90, 30)
    ) + "".join(
        f'<line x1="{cx - 24 * math.cos(math.asin(t)):.1f}" y1="{cy + 24 * t:.1f}" x2="{cx + 24 * math.cos(math.asin(t)):.1f}" y2="{cy + 24 * t:.1f}" stroke="{sepia}" stroke-width=".7"/>'
        for t in (-0.5, 0, 0.5)
    )
    body = f"""
<defs>{hatch}{cross}
  <filter id="roughFine"><feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed="4" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="1.6" xChannelSelector="R" yChannelSelector="G"/></filter>
  <clipPath id="shadeR"><rect x="{cx}" y="0" width="200" height="500"/></clipPath>
</defs>
<rect width="400" height="500" fill="{paper}"/>
<rect x="18" y="18" width="364" height="464" fill="none" stroke="{sepia}" stroke-width="2.5"/>
<rect x="25" y="25" width="350" height="450" fill="none" stroke="{sepia}" stroke-width=".8"/>
<g filter="url(#roughFine)">
  <ellipse cx="200" cy="430" rx="92" ry="16" fill="url(#hatch)" opacity=".6"/>
  <path d="M130 428 C150 420 250 420 270 428 L262 408 C240 402 160 402 138 408 Z" fill="{paper}" stroke="{sepia}" stroke-width="1.6"/>
  <path d="M130 428 C150 420 250 420 270 428 L262 408 C240 402 160 402 138 408 Z" fill="url(#hatch)" clip-path="url(#shadeR)"/>
  <path d="M188 406 C190 380 180 370 192 356 L208 356 C220 370 210 380 212 406 Z" fill="{paper}" stroke="{sepia}" stroke-width="1.6"/>
  <path d="M188 406 C190 380 180 370 192 356 L208 356 C220 370 210 380 212 406 Z" fill="url(#hatch)" clip-path="url(#shadeR)"/>
  <ellipse cx="200" cy="356" rx="22" ry="5" fill="{paper}" stroke="{sepia}" stroke-width="1.4"/>
  <line x1="200" y1="96" x2="200" y2="350" stroke="{sepia}" stroke-width="2.2" transform="rotate(-23 {cx} {cy})"/>
  {ring(126, 126, 0, 8, 72)}
  {ring(126, 32, -8, 6)}
  {ring(126, 50, 18, 16, 48)}
  {ring(104, 20, -8, 3)}
  <circle cx="{cx}" cy="{cy}" r="24" fill="{paper}" stroke="{sepia}" stroke-width="1.6"/>
  <path d="M{cx} {cy - 24} A24 24 0 0 1 {cx} {cy + 24} A14 24 0 0 0 {cx} {cy - 24} Z" fill="url(#cross)"/>
  {globe_lines}
  <path d="M{cx - 126} {cy} A126 126 0 0 1 {cx} {cy - 126}" fill="none" stroke="{sepia}" stroke-width="1" stroke-dasharray="2 3"/>
</g>
<g font-family="Didot, 'Bodoni 72', 'Times New Roman', serif" fill="{sepia}" text-anchor="middle">
  <path d="M104 452 C140 440 260 440 296 452 L286 466 C250 456 150 456 114 466 Z" fill="{paper}" stroke="{sepia}" stroke-width="1.2"/>
  <text x="200" y="460" font-size="13" font-style="italic" letter-spacing="1">Sphæra Armillaris · Fig. π</text>
  <text x="200" y="58" font-size="10" letter-spacing="4">TAB. XIV</text>
</g>"""
    return svg(body, grain=0.5, title="Armillary sphere, copperplate engraving")


# ---------------------------------------------------------------- 10 monoline spot set
def monoline():
    ink = "#1c1b19"
    body = f"""
<rect width="400" height="500" fill="#f5f1e8"/>
<g fill="none" stroke="#d9d3c6" stroke-width="1"><path d="M200 30 V470 M30 250 H370"/></g>
<path d="M58 70 C100 40 170 60 164 120 C158 190 90 200 64 170 C40 140 30 100 58 70 Z" fill="#f2c14e" opacity=".75"/>
<path d="M240 60 C300 44 360 70 352 130 C346 190 280 206 246 172 C216 140 206 76 240 60 Z" fill="#9fc5b8" opacity=".8"/>
<path d="M70 290 C120 264 176 292 168 350 C162 408 94 418 66 386 C40 356 36 306 70 290 Z" fill="#b9a6e8" opacity=".75"/>
<path d="M250 300 C300 270 364 290 354 356 C346 410 280 420 250 392 C222 362 214 318 250 300 Z" fill="#f08a6c" opacity=".7"/>
<g fill="none" stroke="{ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
  <path d="M70 110 L86 200 L140 200 L156 110 Z M70 110 C66 96 80 88 88 96 C88 80 106 78 110 92 C116 78 136 80 134 96 C146 88 160 98 156 110 M88 110 L96 200 M113 110 L113 200 M138 110 L130 200 M92 96 C96 104 104 104 108 98"/>
  <path d="M290 76 A40 40 0 1 1 289.9 76 M250 116 H330 M290 76 C272 96 272 136 290 156 C308 136 308 96 290 76 M258 94 C276 102 304 102 322 94 M258 138 C276 130 304 130 322 138 M290 156 V178 M262 190 H318 M290 178 V190 M338 116 C338 150 316 172 290 176"/>
  <path d="M82 300 H150 V400 H82 Z M94 300 V290 M112 300 V290 M130 300 V290 M96 326 H138 M96 346 H132 M96 366 H124 M96 326 l-6 0"/>
  <path d="M250 334 C262 320 296 322 330 318 C342 317 352 314 358 306 M284 324 C286 356 280 386 262 402 M322 320 C318 352 320 382 336 398 C344 404 354 400 356 390"/>
</g>
<g font-family="'Courier New', monospace" font-size="10" fill="#6b665c" text-anchor="middle" letter-spacing="1">
  <text x="112" y="232">flixelated</text><text x="290" y="232">history</text>
  <text x="116" y="440">things</text><text x="302" y="440">pi</text>
</g>"""
    return svg(body, grain=0.3, title="Monoline spot illustrations for each project")


# ---------------------------------------------------------------- project spot icons
# Square versions of the monoline set, drawn with a heavier line so they stay
# legible at the 60px size used in the homepage project list.
SPOTS = {
    "flixelated": ("#f2c14e", "M20 36 C26 16 62 10 78 28 C92 46 84 80 58 86 C32 92 10 62 20 36 Z",
                   "M30 42 L36 84 L64 84 L70 42 Z M41 42 L44 84 M50 42 V84 M59 42 L56 84 "
                   "M30 42 C25 34 33 27 40 32 C40 23 52 21 55 29 C59 21 72 24 69 34 C77 33 79 42 70 42"),
    "watch": ("#a8bccb", "M24 30 C36 12 72 14 82 36 C92 58 78 86 52 86 C26 86 12 50 24 30 Z",
              "M40 14 H60 L58 29 M40 14 L42 29 M42 71 L40 86 H60 L58 71 "
              "M28 50 A22 22 0 1 1 72 50 A22 22 0 1 1 28 50 M72 46 H77 V54 H72 "
              "M50 36 V50 L59 56 M50 31 V33 M69 50 H67 M50 69 V67 M31 50 H33"),
    "history": ("#9fc5b8", "M26 24 C44 10 80 16 84 44 C88 72 66 90 44 84 C20 78 8 40 26 24 Z",
                "M27 44 A21 21 0 1 1 69 44 A21 21 0 1 1 27 44 M48 23 V65 M27 44 H69 M48 23 C38 32 38 56 48 65 C58 56 58 32 48 23 "
                "M31 33 Q48 38 65 33 M31 55 Q48 50 65 55 M76 44 A28 28 0 0 1 48 72 M48 72 V80 M36 84 H60 M48 80 V84"),
    "things": ("#b9a6e8", "M18 40 C22 18 58 8 76 24 C94 40 88 78 62 86 C36 94 14 64 18 40 Z",
               "M32 28 H68 V84 H32 Z M40 28 V20 M50 28 V20 M60 28 V20 M39 44 H61 M39 54 H57 M39 64 H51"),
    "pi": ("#f08a6c", "M22 30 C38 12 74 14 84 38 C94 62 76 88 50 86 C24 84 8 50 22 30 Z",
           "M24 40 C30 31 46 33 58 31 C66 30 72 28 77 21 M42 33 C44 52 40 68 29 78 "
           "M61 31 C59 50 59 65 67 74 C71 78 77 76 78 70"),
}


def spot(name):
    blob, blob_d, lines = SPOTS[name]
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">'
        f'<rect width="100" height="100" fill="#f5f1e8"/>'
        f'<path d="{blob_d}" fill="{blob}" opacity=".85" transform="translate(-3 3)"/>'
        f'<path d="{lines}" fill="none" stroke="#1c1b19" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>'
        "</svg>"
    )


PIECES = [
    ("01-ramen-woodcut", ramen),
    ("02-coffee-risograph", coffee),
    ("03-lamp-oil-portrait", varma),
    ("04-hillside-gouache", pastoral),
    ("05-night-sky-impasto", starry),
    ("06-chai-cart-matchbox", chai),
    ("07-dosa-watercolour", dosa),
    ("08-hampi-poster", hampi),
    ("09-armillary-engraving", armillary),
    ("10-project-spots-monoline", monoline),
]


# pieces shown on the homepage, published outside the design folder
LIVE = {
    "ramen": lambda: ramen(frame=False, cutout=True),
}

if __name__ == "__main__":
    site = OUT.parent.parent
    for name, fn in PIECES:
        (OUT / f"{name}.svg").write_text(fn())
        print("wrote", name)
    live = site / "images" / "illustrations"
    live.mkdir(parents=True, exist_ok=True)
    for name, fn in LIVE.items():
        (live / f"{name}.svg").write_text(fn())
        print("wrote live", name)
    for name in SPOTS:
        (site / "projects" / "images" / f"spot-{name}.svg").write_text(spot(name))
        print("wrote spot", name)
