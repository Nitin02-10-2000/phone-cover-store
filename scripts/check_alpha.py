from psd_tools import PSDImage
import numpy as np

psd = PSDImage.open(r'C:\Users\panwa_lewnwgj\Downloads\Glass Case.psd')

for group in psd:
    if group.is_group():
        print(f"\nGroup: {group.name}")
        for layer in group:
            img = layer.topil()
            if img:
                arr = np.array(img)
                if arr.ndim == 3 and arr.shape[2] == 4:
                    alpha = arr[:, :, 3]
                    zero_alpha_count = np.sum(alpha == 0)
                    total_pixels = alpha.size
                    print(f"  {layer.name}: size={img.size}, bbox={layer.bbox}, 0-alpha ratio={zero_alpha_count/total_pixels:.2f}")
