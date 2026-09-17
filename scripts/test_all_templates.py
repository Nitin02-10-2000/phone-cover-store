from PIL import Image
import os, json

templates = {
    "iphone_16_pro_max": {"file": r"c:\bisness\public\mockups\templates\iphone_16_pro_max.png", "slot": (350, 250, 359, 756)},
    "samsung_s23_ultra": {"file": r"c:\bisness\public\mockups\templates\samsung_s23_ultra.png", "slot": (350, 250, 476, 998)},
    "oneplus_11": {"file": r"c:\bisness\public\mockups\templates\oneplus_11.png", "slot": (350, 250, 411, 923)},
    "iphone_14_pro_max": {"file": r"c:\bisness\public\mockups\templates\iphone_14_pro_max.png", "slot": (350, 250, 333, 726)},
}

art = Image.open(r"c:\bisness\public\mockups\akira.jpg")
out_dir = r"C:\Users\panwa_lewnwgj\.gemini\antigravity-ide\brain\c2a8dc54-3850-4292-a1e2-9c192ca516c1\scratch"

for model, data in templates.items():
    tpl = Image.open(data["file"])
    sx, sy, sw, sh = data["slot"]
    art_resized = art.resize((sw, sh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", tpl.size, (0, 0, 0, 0))
    canvas.paste(art_resized, (sx, sy))
    final = Image.alpha_composite(canvas, tpl)
    final.save(os.path.join(out_dir, f"test_{model}.png"))
    print(f"Tested {model}: size={tpl.size}, slot=({sx},{sy},{sw},{sh})")
