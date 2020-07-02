const express = require('express');
const fileUpload = require('express-fileupload');
const getColors = require('get-image-colors')
const fs = require('fs')
// const replaceColor = require('replace-color');
const cv = require('opencv4nodejs');
const {PythonShell} = require('python-shell');
const app = express();
const bodyParser = require('body-parser')
const svgIntersections = require('svg-intersections');
require("./helpers/svgHelpers")

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const sumReducer=(total, num)=>{
  return total + num
}
//Get Color Promise from python file
const getColorsPromise = (file_path) =>{
  return new Promise((resolve, reject)=>{
    const options = {
      args: [
        '--src='+file_path, 
      ]
    };  
    PythonShell.run(__dirname + "/python/getColors.py", options, (err, result)=>{
      if (err) reject(err)
      resolve(result[0].split("|"))
    })
  })  
}

//rgb to hex array
const rgbsToHexes = (rgbs) =>{
  let hexes = []
  for (let i=0; i< rgbs.length; i++){
    const r = parseInt(rgbs[i].split(",")[0])
    const g = parseInt(rgbs[i].split(",")[1])
    const b = parseInt(rgbs[i].split(",")[2])
    hexes.push(rgbToHex(r, g, b))
  }
  return hexes
}

// Upload Endpoint
app.post('/upload', async (req, res) => {
  if (req.files === null) return res.status(400).json({ msg: 'No file uploaded' });
  const file = req.files.file;
  const file_name = file.name.split(".")[0]
  const file_path = `${__dirname}/temp_images/${file.name}`
  const temp_file_path = `${__dirname}/temp_images/${file_name}_temp.png`
  await file.mv(file_path).catch(err=> res.status(500).send(err))
  const color_options = {count:10}
  const rgbs = await getColorsPromise(file_path)
  const hex = rgbsToHexes(rgbs)
  // const color_vals = await rgbs.map(i=>{i.split(",")})
  
  const rgbs_string = rgbs.join("|")
  const options = {
    args: [
      '--src='+file_path, 
      '--colors='+rgbs_string,
      '--tolerance=20', 
      '--dest='+temp_file_path 
    ]
  };  
  PythonShell.run(__dirname + "/python/getMasks.py", options, (err, result)=>{
    if (err) res.status(500).send(err)
    res.send({paths: String(result).split("|"), 'colors':rgbs})
  })
});

app.post("/genSVGsFromMask", async (req, res)=>{
  const path = req.body["src"]
  const color = req.body['color']
  const data = await getSvg(path, color)
  const data_paths =  data.split("\n")[1]
  res.set('Content-Type', 'text/html');
  res.send(data_paths)
})

app.listen(5000, () => console.log('Server Started...'));

