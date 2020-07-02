const potrace = require('potrace')

getSvg = async (path, color) => {
    const params ={
      color: color,
      threshold: 185
    }
    let potrace_promise = new Promise((resolve, reject)=>{
      potrace.trace(path, params, function(err, svg) {
        if (err) return reject(err)
        return resolve(svg)
    });
    })
    return await potrace_promise
}

rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')