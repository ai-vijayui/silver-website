"""Generate premium gold amenity badge SVGs for Silver Group projects page."""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "images" / "icons" / "badges"
OUT.mkdir(parents=True, exist_ok=True)

DEFS = """
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E8D4A0"/>
      <stop offset="35%" stop-color="#C9A84C"/>
      <stop offset="70%" stop-color="#B88A3A"/>
      <stop offset="100%" stop-color="#8A6528"/>
    </linearGradient>
    <linearGradient id="goldSoft" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D4B56A"/>
      <stop offset="100%" stop-color="#9A7030"/>
    </linearGradient>
  </defs>
"""

FRAME = """
  <rect x="10" y="10" width="140" height="140" fill="#F7F4EF" stroke="url(#gold)" stroke-width="1" opacity="0.55"/>
  <rect x="14" y="14" width="132" height="132" fill="none" stroke="url(#gold)" stroke-width="1.5"/>
  <path d="M14 24h8M138 24h-8M14 136h8M138 136h-8M24 14v8M136 14v-8M24 138v-8M136 138v-8" stroke="url(#gold)" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="80" cy="84" r="38" fill="none" stroke="url(#gold)" stroke-width="1" opacity="0.45"/>
  <circle cx="80" cy="84" r="34" fill="none" stroke="url(#gold)" stroke-width="1.5"/>
  <path d="M48 108c-6-10-4-24 6-30M112 108c6-10 4-24-6-30" stroke="url(#gold)" stroke-width="1.3" stroke-linecap="round"/>
  <path d="M46 98c2-4 5-8 8-11M114 98c-2-4-5-8-8-11" stroke="url(#gold)" stroke-width="1.1" stroke-linecap="round" opacity="0.85"/>
  <path d="M80 36l1.8 5.4h5.8l-4.7 3.4 1.8 5.4-4.7-3.4-4.7 3.4 1.8-5.4-4.7-3.4h5.8z" fill="url(#gold)"/>
  <path d="M76 124h8M80 120v8" stroke="url(#gold)" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="72" cy="126" r="1.2" fill="url(#gold)"/>
  <circle cx="88" cy="126" r="1.2" fill="url(#gold)"/>
"""

ICONS = {
    "amenity-sewage": """
  <path d="M48 78h36v6H48z" stroke="url(#gold)" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M84 81h14v10l6 3v8H78v-8l6-3V81z" stroke="url(#gold)" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M72 92v10M76 92v10M80 92v10" stroke="url(#gold)" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M68 102h24" stroke="url(#gold)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M98 84c2 2 2 5 0 7" stroke="url(#gold)" stroke-width="1.3" stroke-linecap="round"/>
""",
    "amenity-lift": """
  <rect x="62" y="58" width="36" height="48" rx="1" stroke="url(#gold)" stroke-width="1.6"/>
  <path d="M70 58v48M90 58v48" stroke="url(#gold)" stroke-width="1.5"/>
  <path d="M80 68v6M80 84v6" stroke="url(#gold)" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="80" cy="76" r="3" stroke="url(#gold)" stroke-width="1.4"/>
  <path d="M52 72l6-6M52 92l6 6M108 72l-6-6M108 92l-6 6" stroke="url(#gold)" stroke-width="1.5" stroke-linecap="round"/>
""",
    "amenity-garden": """
  <path d="M56 98V72c0-8 6-14 12-16 6 2 12 8 12 16v26" stroke="url(#gold)" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M68 56c4-6 10-8 12-8s8 2 12 8" stroke="url(#gold)" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M52 98h56" stroke="url(#gold)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M64 78v8M80 74v12M96 80v6" stroke="url(#gold)" stroke-width="1.3" stroke-linecap="round" opacity="0.8"/>
""",
    "amenity-security": """
  <circle cx="80" cy="76" r="16" stroke="url(#gold)" stroke-width="1.4" opacity="0.55"/>
  <path d="M68 76c0-8 5-14 12-16 7 2 12 8 12 16v10l-12 6-12-6V76z" stroke="url(#gold)" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M74 78l4 4 8-8" stroke="url(#gold)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M58 88h44" stroke="url(#gold)" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
""",
    "amenity-drinking-water": """
  <path d="M92 62h10v10H92z" stroke="url(#gold)" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M97 72v8" stroke="url(#gold)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M88 80h18v4H88z" stroke="url(#gold)" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M66 88h16l-3 14H69l-3-14z" stroke="url(#gold)" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M74 88v6" stroke="url(#gold)" stroke-width="1.3" stroke-linecap="round"/>
  <path d="M70 96c4 2 8 2 12 0" stroke="url(#gold)" stroke-width="1.3" stroke-linecap="round"/>
""",
    "amenity-water-conservation": """
  <path d="M80 58c-8 10-12 18-12 26a12 12 0 1 0 24 0c0-8-4-16-12-26z" stroke="url(#gold)" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M80 66v14" stroke="url(#gold)" stroke-width="1.3" stroke-linecap="round" opacity="0.7"/>
  <path d="M58 98c6-3 14-3 22 0s16 3 22 0" stroke="url(#gold)" stroke-width="1.5" stroke-linecap="round"/>
""",
    "amenity-water-supply": """
  <path d="M72 62h16v8H72z" stroke="url(#gold)" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M80 70v10" stroke="url(#gold)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M68 80h24l-4 12H72l-4-12z" stroke="url(#gold)" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M80 92v8" stroke="url(#gold)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M80 100c-3 3-3 6 0 8 3-2 3-5 0-8z" fill="url(#goldSoft)" stroke="url(#gold)" stroke-width="1.2"/>
""",
    "amenity-renewable-energy": """
  <circle cx="80" cy="78" r="14" stroke="url(#gold)" stroke-width="1.6"/>
  <path d="M80 64v-4M80 96v-4M66 78h-4M98 78h-4M70 68l-3-3M93 91l-3-3M93 68l3-3M70 91l3-3" stroke="url(#gold)" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M80 72v12M76 78h8" stroke="url(#gold)" stroke-width="1.7" stroke-linecap="round"/>
  <rect x="74" y="96" width="12" height="8" rx="1" stroke="url(#gold)" stroke-width="1.4"/>
""",
    "amenity-community-hall": """
  <path d="M54 98h52" stroke="url(#gold)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M58 98V68h44v30" stroke="url(#gold)" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M68 98V78h24v20" stroke="url(#gold)" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M80 68V58" stroke="url(#gold)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M66 58h28l-3 10H69l-3-10z" stroke="url(#gold)" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M62 54h36" stroke="url(#gold)" stroke-width="1.5" stroke-linecap="round"/>
""",
    "amenity-fire-safety": """
  <rect x="72" y="58" width="16" height="40" rx="2" stroke="url(#gold)" stroke-width="1.6"/>
  <path d="M76 64h8M76 72h8M76 80h8M76 88h8" stroke="url(#gold)" stroke-width="1.3" stroke-linecap="round"/>
  <path d="M72 98h16" stroke="url(#gold)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M88 72h8v8h-8z" stroke="url(#gold)" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M92 80v18" stroke="url(#gold)" stroke-width="1.5" stroke-linecap="round"/>
""",
    "amenity-road": """
  <path d="M54 98h52" stroke="url(#gold)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M62 98l14-28 8 16 8-20 14 32" stroke="url(#gold)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M80 98v-6" stroke="url(#gold)" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3 3"/>
""",
}


def build_svg(name: str, icon: str) -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none" aria-hidden="true">
{DEFS}
{FRAME}
{icon.strip()}
</svg>
"""


for name, icon in ICONS.items():
    (OUT / f"{name}.svg").write_text(build_svg(name, icon), encoding="utf-8")
    print(f"Wrote {name}.svg")

print(f"Generated {len(ICONS)} badge icons in {OUT}")
