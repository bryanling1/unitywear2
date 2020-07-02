import numpy as np
import cv2
import pdb
from PIL import Image
from PIL import ImageFilter
import argparse
from colorthief import ColorThief

def getColorMap(src):
    TOL = 10
    color_thief = ColorThief(src)
    palette = color_thief.get_palette(color_count=9)
    palette = [str(x).replace("(", "").replace(")", "") for x in palette]
    palette = filterPallette(palette)
    # palette.append("255, 255, 255")
    # palette.append("0, 0, 0")
    print("|".join(palette))

def filterPallette(pallette, tol=20):
    colors = {}
    out = []
    for color in pallette:
        r = int(color.split(",")[0])
        g = int(color.split(",")[1])
        b = int(color.split(",")[2])
        if color not in colors:
            for x in range(-tol, tol):
                for y in range(-tol, tol):
                    for z in range(-tol, tol):
                        color_temp = "{}, {}, {}".format(str(r+x), str(g+y), str(b+z))
                        colors[color_temp] = 1
            out.append(color)
        
    if '0, 0, 0' not in colors: out.append('0, 0, 0')
    if '255, 255, 255' not in colors: out.append('255, 255, 255')
    return out


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--src", required=True)
    args = parser.parse_args()

    getColorMap(args.src)

    
