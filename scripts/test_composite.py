from PIL import Image

template = Image.open(r'c:\bisness\public\mockups\templates\iphone_16_pro_max.png')
art = Image.open(r'c:\bisness\public\mockups\akira.jpg')

# Slot from template: x=350, y=250, w=359, h=756
slot_w, slot_h = 359, 756
art_resized = art.resize((slot_w, slot_h), Image.Resampling.LANCZOS)

# Create canvas same size as template
canvas = Image.new("RGBA", template.size, (255, 255, 255, 0))
canvas.paste(art_resized, (350, 250))

# Composite template on top
final = Image.alpha_composite(canvas, template)
final.save(r'C:\Users\panwa_lewnwgj\.gemini\antigravity-ide\brain\c2a8dc54-3850-4292-a1e2-9c192ca516c1\scratch\test_composite_16_pm.png')
print("Saved test_composite_16_pm.png")
