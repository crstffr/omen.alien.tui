#!/usr/bin/env node

require('rootpath')();
let fs = require('fs');
let path = require('path');
let pixels = require('get-pixels');
let settings = require('settings');

let width = process.argv[2];
let height = process.argv[3];
let file = process.argv[4];
let zoom = process.argv[5] || 1;

if (!width || !height || !file) {
    console.log('Missing arguments.  width height file [zoom]');
    process.exit(1);
}

let filename = [width, height, zoom].join('-');
let pngFilename = filename + '.png';
let pngFilepath = path.join(settings.path.user.waveforms, file, 'png', pngFilename);

let txtContent = "";
let txtFilename = filename + '.txt';
let txtFilepath = path.join(settings.path.user.waveforms, file, 'txt', txtFilename);

pixels(pngFilepath, function(err, ndarray) {

    if (err) {
        console.log(err);
        return
    }

    for(let r = 0; r < ndarray.shape[1]; r++) {
        for (let c = 0; c < ndarray.shape[0]; c++) {
            let pixel = ndarray.get(c, r, 0);
            txtContent += (pixel === 0) ? " " : "│";
        }
        txtContent += "\n";
    }

    fs.writeSync(fs.openSync(txtFilepath, 'w'), txtContent);

});