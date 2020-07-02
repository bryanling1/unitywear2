import cv2 as cv
import argparse
import numpy as np
import os
import sys
import pdb
import requests
from PIL import Image
import PIL.ImageOps


IMG_HEGHT = 1000
IMG_WIDTH = 1000
back_dim = (IMG_WIDTH, IMG_HEGHT)

def fitImageDimensions(dim, back_dim):
    """
    dim:(width, height)

    returns new dimesniosn of dim to fit
    """
    img_ratio = dim[0] / dim[1]
    back_ratio = back_dim[0] / back_dim[0]

    new_width = 0
    new_height = 0

    if img_ratio > back_ratio:
        new_width = back_dim[0]
        new_height = new_width / img_ratio
    else:
        new_height = back_dim[1]
        new_width = new_height * img_ratio
    
    return (int(new_width), int(new_height))
def showImage(img):
    cv.imshow("test",img)
    cv.waitKey(0)
def RGBAtoRGB(img):
    r, g, b, a = cv.split(img)
    new_r = (a * r)*255
    new_g = (a * g)*255
    new_b = (a * b)*255
    rgb = np.array([new_r, new_g, new_b])
    dst = cv.merge(rgb)
    return dst
def splitImageFromContours(img, contours, hierarchy):
    fills = []
    for i, contour in enumerate(contours):
        area = cv.contourArea(contour)
        if area < 50:
            fills.append(None)
            continue
        parent = hierarchy[0][i][3]
        temp = np.zeros((img.shape[0], img.shape[1], 3))
        cv.drawContours(temp,[np.array(contour)],-1,(255, 255, 255), cv.FILLED)
        temp = cv.cvtColor(np.float32(temp), cv.COLOR_BGR2GRAY)
        if parent == -1: 
            fills.append(temp)
            continue
        prev_parent = None
        count = 0
        while parent != -1:
            count += 1
            if prev_parent is None:
                prev_parent = parent
            parent = hierarchy[0][parent][3]
        if count%2==0:
            fills.append(temp)
        else:
            fills.append(None)
            parent_image = fills[prev_parent]
            parent_image = np.uint8(parent_image)
            mask = np.uint8(temp)
            subtract = cv.bitwise_not(mask)
            new_img = cv.bitwise_and(parent_image, subtract) 
            fills[prev_parent] = new_img
    return [x for x in fills if x is not None]
def invertRGB(color):
    """
    color as a tuple (r, g, b)
    """
    new_r = 255 - color[0]
    new_g = 255 - color[1]
    new_b = 255 - color[2]
    return np.array((new_r, new_g, new_b))

def run(src, colors, tolerance, dest):
    tolerance = int(tolerance)
    out = []
    count = 0
    for x, color in enumerate(colors): 
        color_str = "rgb("+color+")"
        color = color.split(",")
        color.reverse()
        color = np.array(color)
        color = color.astype(int)
        color_val = np.sum(color)
        #fit the image onto a 1080 x 1080 canvas
        img = Image.open(src)
        img_dim = img.size
        new_dim = fitImageDimensions(img_dim, back_dim )
        img = img.resize(new_dim, Image.ANTIALIAS).convert("RGBA")
        backing = Image.new('RGBA', (IMG_WIDTH, IMG_HEGHT), color=(0, 0, 0, 0))
        backing.paste(img, (0, 0), img)
        #if the color is too dark, paste a white background color and invert it
        if color_val < 30:
            white_back = Image.new('RGB', (IMG_WIDTH, IMG_HEGHT), color=(255, 255, 255))
            white_back.paste(backing)
            white_back = PIL.ImageOps.invert(white_back)
            color = invertRGB(color)
            backing = white_back
        img = np.array(backing)
        img = cv.cvtColor(img, cv.COLOR_BGR2RGB)
        #apply mask on color with given tolerance
        lower = color - tolerance
        upper = color + tolerance
        mask = cv.inRange(img, lower, upper)
        res = cv.bitwise_and(img, img, mask= mask)  
        kernel = np.ones((1, 1), np.uint8)
        imgEroded = cv.dilate(res, kernel, iterations=3)
        img = cv.GaussianBlur(imgEroded, (5, 5), -1)
        img = imgEroded
        tmp = cv.cvtColor(img, cv.COLOR_RGB2GRAY)
        _,alpha = cv.threshold(tmp,0,255,cv.THRESH_BINARY)
        b, g, r = cv.split(img)
        rgba = np.array([b,g,r, alpha])
        dst = cv.merge(rgba)
        dst[...,0:3]=[0,255,0] 
        #determine the contours to area ratio to see if its just a bunch of tiny dots
        contours, hierarchy = cv.findContours(tmp, cv.RETR_TREE, cv.CHAIN_APPROX_NONE)
        total_area = 0
        for cnt in contours:
            area = cv.contourArea(cnt)
            total_area += area
        if total_area == 0: continue
        ca_ratio = len(contours)/total_area
        if ca_ratio >= 0.8 : continue

        #split the image using tree hierarchy
        imgs = splitImageFromContours(dst, contours, hierarchy)

        for i, img in enumerate(imgs):
            #write the temporary files
            _,alpha = cv.threshold(img,0,255,cv.THRESH_BINARY)
            zeros = np.zeros((img.shape[0], img.shape[1]))
            rgba = np.array([zeros ,img,zeros , alpha]) #make it green
            rgba = cv.merge(rgba)
            cv.imwrite(dest, rgba)
            url = 'http://localhost:5000/genSVGsFromMask'
            params = {'src': dest, "color":color_str}
            data = requests.post(url, data=params)
            out += data.text.split("|")
            #write out for debugging
    
    print("|".join(out))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--src", required=True)
    parser.add_argument("--colors", required=True)
    parser.add_argument("--tolerance", required=True)
    parser.add_argument("--dest", required=True)
    args = parser.parse_args()
    colors = args.colors.split("|")

    run(args.src, colors, args.tolerance, args.dest)
