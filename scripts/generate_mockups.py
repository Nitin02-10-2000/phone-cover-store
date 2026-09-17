"""
CaseTadka Studio Mockup Generator
Renders artwork onto photorealistic 3D Glass Case Studio mockups.
"""

import os
import sys
import json
from pathlib import Path
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = PROJECT_ROOT / "public" / "mockups" / "templates"
METADATA_FILE = TEMPLATES_DIR / "templates.json"
OUTPUT_DIR = PROJECT_ROOT / "public" / "mockups" / "studio_renders"

def load_templates():
    if not METADATA_FILE.exists():
        raise FileNotFoundError(f"Template metadata not found at {METADATA_FILE}")
    with open(METADATA_FILE, "r") as f:
        return json.load(f)

def render_mockup(art_path_or_img, template_id="iphone_16_pro_max", output_path=None, quality=90):
    templates = load_templates()
    if template_id not in templates:
        raise ValueError(f"Unknown template_id: {template_id}. Available: {list(templates.keys())}")

    meta = templates[template_id]
    template_file = TEMPLATES_DIR / f"{template_id}.png"
    if not template_file.exists():
        raise FileNotFoundError(f"Template image not found at {template_file}")

    template_img = Image.open(template_file)
    slot = meta["slot"]

    # Load artwork
    if isinstance(art_path_or_img, (str, Path)):
        art_img = Image.open(art_path_or_img).convert("RGBA")
    else:
        art_img = art_path_or_img.convert("RGBA")

    # Add slight 4px bleed to guarantee no white gap around slot borders
    bleed = 6
    slot_w = slot["width"] + bleed * 2
    slot_h = slot["height"] + bleed * 2
    slot_x = slot["x"] - bleed
    slot_y = slot["y"] - bleed

    # Resize artwork to fill slot maintaining aspect ratio or stretching to phone
    art_resized = art_img.resize((slot_w, slot_h), Image.Resampling.LANCZOS)

    # Base canvas with studio background (pure white / soft off-white #f8f8fa)
    canvas = Image.new("RGBA", template_img.size, (248, 248, 250, 255))
    canvas.paste(art_resized, (slot_x, slot_y), mask=art_resized.split()[3] if "A" in art_resized.getbands() else None)

    # Paste template on top using its alpha mask (phone frame, camera bump, reflections, wall & floor shadows)
    canvas.paste(template_img, (0, 0), mask=template_img.split()[3])

    final_rgb = canvas.convert("RGB")

    if output_path:
        os.makedirs(Path(output_path).parent, exist_ok=True)
        final_rgb.save(output_path, "JPEG", quality=quality)
        print(f"[OK] Rendered {template_id} -> {output_path}")

    return final_rgb

def batch_render_catalog():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    art_dir = PROJECT_ROOT / "public" / "mockups"
    
    catalog_items = [
        ("akira", art_dir / "akira.jpg"),
        ("porsche_911", art_dir / "porsche_art.png"),
        ("spiderman", art_dir / "spiderman_art.png"),
        ("cyberpunk", art_dir / "cyberpunk.jpg"),
        ("chainsaw_man", art_dir / "chainsaw_man.jpg"),
        ("solo_leveling", art_dir / "solo_leveling.jpg"),
        ("sukuna", art_dir / "itachi_tsukuyomi.jpg"),
        ("gaming", art_dir / "gaming_controller.jpg"),
    ]

    for item_id, path in catalog_items:
        if path.exists():
            # Generate iPhone 16 Pro Max render
            out_iph = OUTPUT_DIR / f"{item_id}_iphone16.jpg"
            render_mockup(path, template_id="iphone_16_pro_max", output_path=out_iph)

            # Generate Samsung S23 Ultra render
            out_s23 = OUTPUT_DIR / f"{item_id}_s23ultra.jpg"
            render_mockup(path, template_id="samsung_s23_ultra", output_path=out_s23)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
        tpl = sys.argv[2] if len(sys.argv) > 2 else "iphone_16_pro_max"
        out = sys.argv[3] if len(sys.argv) > 3 else "output_mockup.jpg"
        render_mockup(input_file, template_id=tpl, output_path=out)
    else:
        print("Running batch render for top catalog items...")
        batch_render_catalog()
