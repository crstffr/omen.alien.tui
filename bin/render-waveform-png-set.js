#!/usr/bin/env node
console.time('render');

require('rootpath')();
let fs = require('fs');
let path = require('path');
let spawn = require('child_process').spawn;
let settings = require('settings');

let promises = [];
let width = process.argv[2];
let height = process.argv[3];
let filename = process.argv[4];
let program = path.join(settings.path.bin, 'render-waveform-png.js');

if (!width || !height || !filename) {
    console.log('Missing argument.  width height filename');
    process.exit(1);
}

let infoFile = path.join(settings.path.user.samples, filename, 'info.json');
let infoData = require(infoFile);
let maxZoom = infoData.maxWidth / (settings.waveforms.zoomMultiplier * width);

let zoom = 1;
let calcZoom = 1;

while (calcZoom < maxZoom) {

    promises.push(new Promise((resolve, reject) => {
        let inst = spawn(program, [width, height, filename, zoom]);
        inst.on('close', code => {
            resolve(code);
        });
    }));

    calcZoom = ++zoom * settings.waveforms.zoomMultiplier;
    infoData.maxZoom = zoom - 1;
}

promises.push(new Promise((resolve) => {
    fs.writeSync(fs.openSync(infoFile, 'w'), JSON.stringify(infoData));
    resolve();
}));


Promise.all(promises).then(() => {
    console.timeEnd('render');
    process.exit();
});
