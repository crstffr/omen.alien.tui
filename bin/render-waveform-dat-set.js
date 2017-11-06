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
let program = path.join(settings.path.bin, 'render-waveform-dat.js');

if (!width || !height || !filename) {
    console.log('Missing argument.  width height filename');
    process.exit(1);
}

let infoFile = path.join(settings.path.user.samples, filename, 'info.json');
let infoData = require(infoFile);

for (let zoom = 1; zoom <= infoData.maxZoom; zoom++) {
    promises.push(new Promise((resolve, reject) => {
        let inst = spawn(program, [width, height, filename, zoom]);
        inst.stderr.on('data', data => {
            console.log(data.toString());
        });
        inst.on('close', code => {
            resolve(code);
        });
    }));
}

Promise.all(promises).then(() => {
    console.timeEnd('render');
    process.exit();
});
