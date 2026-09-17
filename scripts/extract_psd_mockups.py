import os
import json
from psd_tools import PSDImage
import numpy as np
from PIL import Image

psd_path = r'C:\Users\panwa_lewnwgj\Downloads\Glass Case.psd'
output_base = r'c:\bisness\public\mockups\models'
os.makedirs(output_base, exist_ok=True)

print("Opening PSD...")
psd = PSDImage.open(psd_path)
print(f"PSD Dimensions: {psd.width}x{psd.height}")

TARGET_MODELS = [
    {"group": "iphone", "layer_name": "iph 16 Pro Max(H6.4)", "slug": "iphone-16-pro-max", "name": "iPhone 16 Pro Max", "brand": "Apple", "archetype": "iphone-triple"},
    {"group": "iphone", "layer_name": "Iph 16 Pro(H5.9)", "slug": "iphone-16-pro", "name": "iPhone 16 Pro", "brand": "Apple", "archetype": "iphone-triple"},
    {"group": "iphone", "layer_name": "Iph 16(H5.8)", "slug": "iphone-16", "name": "iPhone 16", "brand": "Apple", "archetype": "iphone-dual-vert"},
    {"group": "iphone", "layer_name": "Iph 15 Pro Max(6.3)", "slug": "iphone-15-pro-max", "name": "iPhone 15 Pro Max", "brand": "Apple", "archetype": "iphone-triple"},
    {"group": "iphone", "layer_name": "14 Pro Max(H6.3)", "slug": "iphone-14-pro-max", "name": "iPhone 14 Pro Max", "brand": "Apple", "archetype": "iphone-triple"},
    {"group": "Samsung", "layer_name": "S23 Ultra", "slug": "samsung-s24-ultra", "name": "Samsung Galaxy S24 Ultra", "brand": "Samsung", "archetype": "samsung-ultra"},
    {"group": "One Plus", "layer_name": "1+11(H6.4)", "slug": "oneplus-11", "name": "OnePlus 11", "brand": "OnePlus", "archetype": "oneplus-dial"},
]

manifest = {}

for target in TARGET_MODELS:
    print(f"\nProcessing {target['name']}...")
    found_layer = None
    for group in psd:
        if group.is_group() and group.name.lower() == target["group"].lower():
            for layer in group:
                if layer.name == target["layer_name"]:
                    found_layer = layer
                    break
    
    if not found_layer:
        print(f"  WARNING: Layer '{target['layer_name']}' not found!")
        continue

    pil_img = found_layer.topil()
    if not pil_img:
        print("  WARNING: Could not convert layer to PIL image!")
        continue

    model_dir = os.path.join(output_base, target["slug"])
    os.makedirs(model_dir, exist_ok=True)

    arr = np.array(pil_img)
    w, h = pil_img.size

    # Save full scene / base
    base_path = os.path.join(model_dir, "scene.png")
    pil_img.save(base_path, "PNG")

    # Find the printable white area:
    # Look for pixels that are nearly pure white: R > 250, G > 250, B > 250, A > 200
    white_mask = (arr[:, :, 0] > 248) & (arr[:, :, 1] > 248) & (arr[:, :, 2] > 248) & (arr[:, :, 3] > 200)
    white_indices = np.where(white_mask)

    if len(white_indices[0]) > 0:
        ymin, ymax = int(white_indices[0].min()), int(white_indices[0].max())
        xmin, xmax = int(white_indices[1].min()), int(white_indices[1].max())
        slot_w = xmax - xmin + 1
        slot_h = ymax - ymin + 1
        print(f"  Found printable slot: x={xmin}, y={ymin}, width={slot_w}, height={slot_h}")
    else:
        # Fallback slot
        xmin, ymin, slot_w, slot_h = int(w * 0.35), int(h * 0.25), int(w * 0.3), int(h * 0.5)
        print(f"  Fallback slot: x={xmin}, y={ymin}, width={slot_w}, height={slot_h}")

    # Create overlay where the printable slot is made transparent
    overlay_arr = arr.copy()
    # Mask out the white slot area so user art shows through
    overlay_arr[white_mask, 3] = 0
    overlay_img = Image.fromarray(overlay_arr)
    overlay_path = os.path.join(model_dir, "overlay.png")
    overlay_img.save(overlay_path, "PNG")

    # Create isolated case: crop the phone area plus margin
    pad_x = 40
    pad_y = 40
    crop_x1 = max(0, xmin - pad_x)
    crop_y1 = max(0, ymin - pad_y)
    crop_x2 = min(w, xmax + pad_x)
    crop_y2 = min(h, ymax + pad_y)

    cropped_overlay = overlay_img.crop((crop_x1, crop_y1, crop_x2, crop_y2))
    cropped_overlay_path = os.path.join(model_dir, "case_overlay.png")
    cropped_overlay.save(cropped_overlay_path, "PNG")

    cropped_base = pil_img.crop((crop_x1, crop_y1, crop_x2, crop_y2))
    cropped_base_path = os.path.join(model_dir, "case_base.png")
    cropped_base.save(cropped_base_path, "PNG")

    # Coordinates relative to cropped case
    case_w = crop_x2 - crop_x1
    case_h = crop_y2 - crop_y1
    rel_slot_x = xmin - crop_x1
    rel_slot_y = ymin - crop_y1

    # Estimate camera bounds based on archetype
    if target["archetype"] == "iphone-triple":
        cam_rel_x = rel_slot_x + 12
        cam_rel_y = rel_slot_y + 12
        cam_w = int(slot_w * 0.38)
        cam_h = int(slot_w * 0.40)
        cam_r = 24
    elif target["archetype"] == "iphone-dual-vert":
        cam_rel_x = rel_slot_x + 12
        cam_rel_y = rel_slot_y + 12
        cam_w = int(slot_w * 0.22)
        cam_h = int(slot_w * 0.42)
        cam_r = 18
    elif target["archetype"] == "samsung-ultra":
        cam_rel_x = rel_slot_x + 14
        cam_rel_y = rel_slot_y + 14
        cam_w = int(slot_w * 0.32)
        cam_h = int(slot_w * 0.65)
        cam_r = 16
    else: # oneplus-dial
        cam_rel_x = rel_slot_x + int(slot_w * 0.08)
        cam_rel_y = rel_slot_y + int(slot_h * 0.03)
        cam_w = int(slot_w * 0.45)
        cam_h = int(slot_w * 0.45)
        cam_r = int(slot_w * 0.22)

    config = {
        "slug": target["slug"],
        "name": target["name"],
        "brand": target["brand"],
        "archetype": target["archetype"],
        "full_scene": {
            "canvas_width": w,
            "canvas_height": h,
            "scene_url": f"/mockups/models/{target['slug']}/scene.png",
            "overlay_url": f"/mockups/models/{target['slug']}/overlay.png",
            "printable_x": xmin,
            "printable_y": ymin,
            "printable_width": slot_w,
            "printable_height": slot_h,
            "printable_radius": 36 if target["brand"] == "Apple" else (12 if "ultra" in target["slug"] else 32)
        },
        "case_focus": {
            "canvas_width": case_w,
            "canvas_height": case_h,
            "base_url": f"/mockups/models/{target['slug']}/case_base.png",
            "overlay_url": f"/mockups/models/{target['slug']}/case_overlay.png",
            "printable_x": rel_slot_x,
            "printable_y": rel_slot_y,
            "printable_width": slot_w,
            "printable_height": slot_h,
            "printable_radius": 38 if target["brand"] == "Apple" else (10 if "ultra" in target["slug"] else 34),
            "camera_x": cam_rel_x,
            "camera_y": cam_rel_y,
            "camera_width": cam_w,
            "camera_height": cam_h,
            "camera_radius": cam_r
        },
        "print_specs": {
            "width_mm": 77.6 if "max" in target["slug"] or "ultra" in target["slug"] else 71.5,
            "height_mm": 163.0 if "max" in target["slug"] or "ultra" in target["slug"] else 147.5,
            "dpi": 300
        }
    }

    config_path = os.path.join(model_dir, "config.json")
    with open(config_path, "w") as f:
        json.dump(config, f, indent=2)

    manifest[target["slug"]] = config
    print(f"  Extracted assets and config for {target['slug']} successfully!")

manifest_path = os.path.join(output_base, "manifest.json")
with open(manifest_path, "w") as f:
    json.dump(manifest, f, indent=2)

print(f"\nCompleted! Generated manifest for {len(manifest)} models.")
