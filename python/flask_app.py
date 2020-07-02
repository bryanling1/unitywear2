import numpy as np
import cv2
from flask import Flask, request
import sys
import os 
import cvHelpers

app=Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        image = request.files['file']
        filepath = os.path.join("./temp_images", image.filename)
        image.save(filepath)
        img = cv2.imread(filepath)
        colors = cvHelpers.getColorMap(img)
        cvHelpers.protrace(img, None)
        return {'colors':colors, 'svg':None}

if __name__ == "__main__":
    app.run(debug=True, threaded=True)