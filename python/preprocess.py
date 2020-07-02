from PIL import Image
import numpy
from PIL import ImageFilter, ImageOps
import argparse

def preprocess(src):
    img = Image.open(src)
    img = img.convert("RGB")
    img = ImageOps.posterize(img, bits=5)
    img = img.quantize(colors=10, method=0, kmeans=10)
    img = img.convert("RGB")
    img.show()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--src", required=True)
    args = parser.parse_args()

    preprocess(args.src)

