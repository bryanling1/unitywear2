import numpy as np
import cv2 as cv
import pdb
import requests
from PIL import Image

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


src = "./temp_images/WCI-Athletics-Logo-_temptest_1.png"
img = Image.open(src)
imCopy = img.copy()
img = np.array(img)
img = RGBAtoRGB(img)
img_gray = cv.cvtColor(img, cv.COLOR_RGB2GRAY)
contours, hierarchy =  cv.findContours(img_gray,cv.RETR_TREE,cv.CHAIN_APPROX_SIMPLE)

fills = []
for i, contour in enumerate(contours):
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
        prev_parent = parent
        parent = hierarchy[0][parent][3]
    if count%2==0:
        fills.append(temp)
    else:
        fills.append(None)
        parent_image = fills[prev_parent]
        mask = np.uint8(temp)
        mask = cv.bitwise_not(mask)
        new_img = cv.bitwise_and(parent_image, parent_image, mask= mask) 
        fills[prev_parent] = new_img

for img in fills:q
    if img is not None:
        showImage(img)


    





