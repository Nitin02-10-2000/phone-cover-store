from psd_tools import PSDImage
from PIL import Image
import numpy as np

psd = PSDImage.open(r"C:\Users\panwa_lewnwgj\Downloads\Glass Case.psd")
for group in psd:
    if group.name.lower() == "iphone":
        for l in group:
            if l.name in ["14 Pro Max(H6.3)", "Layer 1", "Layer 2", "iph 16 Pro Max(H6.4)", "13 (H5.8) copy"]:
                pil = l.topil()
                arr = np.array(pil)
                print(l.name, "size:", pil.size, "bbox:", l.bbox)
                alpha = arr[:, :, 3]
                print("  alpha > 0:", np.count_nonzero(alpha), "alpha == 255:", np.count_nonzero(alpha == 255))
