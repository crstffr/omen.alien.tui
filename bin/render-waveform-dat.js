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
let start = process.argv[6] || 0;

let filename = [width, height, zoom, start].join('-');
let pngFilename = filename + '.png';
let pngFilepath = path.join(settings.path.user.waveforms, file, 'png', pngFilename);

let datFilename = filename + '.json';
let datFilepath = path.join(settings.path.user.waveforms, file, 'dat', datFilename);

pixels(pngFilepath, function(err, ndarray) {

    if (err) {
        console.log(err);
        return
    }

    let content = JSON.stringify(ndarray.data);
    fs.writeSync(fs.openSync(datFilepath, 'w'), content);

});