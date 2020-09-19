
# Unity Wear Tool: 3D Garment Design Visualizer Web-App

<img src="./unitywearmain.jpg" width="100%" />

The purpose of this web-app is to simplify the team-wear merchandise design process. 
Most team brands already have a go-to logo when it comes to designing customized annual team wear
such as warmup jerseys. Teams often have to approach mediocre graphic designers to come up with a 
new design for their upcoming season. This tool helps automate this process by providing customizable
garment design templates that take in an existing logo and style it.

Additionally, the image of the logo is processed to meet common design requirements for screen printing

## Built With
- Node.js
- React
- OpenCV
- Material UI
- Three.js

## Program Flow
1. Take in a standard image file (PNG, SVG, currently does not support SVG)
2. Decides the number of colors needed by a k-means algorithm
3. Generates an SVG image using OpenCV contour hierarchy for the colors selected
4. Displays the result in the editor where the user can add or subtract paths for the desired silhouette 
5. 3D display the designs in an interactive widget with Three.js for each design preview

## Next Steps
- Add a CSV file reader for order forms. Can be used by coaches keeping track of orders from players with jersey numbers, last names, etc.
- Customize colors for particular designs directly in the widget
