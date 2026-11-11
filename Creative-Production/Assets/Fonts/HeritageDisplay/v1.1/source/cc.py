"""Connected-component labelling (4-neighbour) on a boolean mask, numpy only."""
import numpy as np


def label(mask):
    H, W = mask.shape
    lab = np.zeros((H, W), dtype=np.int32)
    comps = []
    n = 0
    ys, xs = np.nonzero(mask)
    for y, x in zip(ys, xs):
        if lab[y, x]:
            continue
        n += 1
        stack = [(y, x)]
        lab[y, x] = n
        pix = []
        while stack:
            cy, cx = stack.pop()
            pix.append((cy, cx))
            for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
                if 0 <= ny < H and 0 <= nx < W and mask[ny, nx] and not lab[ny, nx]:
                    lab[ny, nx] = n
                    stack.append((ny, nx))
        p = np.array(pix)
        comps.append(dict(id=n, area=len(pix), y0=p[:, 0].min(), y1=p[:, 0].max(),
                          x0=p[:, 1].min(), x1=p[:, 1].max(),
                          cx=p[:, 1].mean(), cy=p[:, 0].mean()))
    return lab, comps
