require('rootpath')();

const path = require('path');
const WebSocket = require('ws');
const spawnSync = require('child_process').spawnSync;

const settings = require('settings');
const wss = new WebSocket.Server({ port: 8911 });
const fetchCmd = path.join(settings.path.bin, 'fetch-waveform.js');

console.log('Server started at: ws:/localhost:8911');

let zoom = 0;
let info = {};
let file = '';

let waveform;
let waveformLines;
let waveformWidth;
let waveformRatio;

    wss.on('connection', ws => {

    ws.on('message', msg => {

        let data = JSON.parse(msg);
        let response = {
            waveform: '',
            type: data.type,
            info: {
                width: 0,
                start: 0,
                end: 0
            }
        };

        console.log(data);

        if (data.type === 'fetch') {

            if (data.file !== file || data.zoom !== zoom) {
                file = data.file;

                info = require(path.join(settings.path.user.samples, file, 'info.json'));

                waveform = spawnSync(fetchCmd, [
                    data.width, data.height, data.file, data.zoom
                ]).stdout.toString();

                waveformLines = waveform.split('\n');
                waveformWidth = waveformLines[0].length;
                waveformRatio = waveformWidth / info.frames;
            }

            let startTime = data.start || 0;
            let startFrame = Math.floor((startTime / 1000) * info.sampleRate);
            let startChar = Math.floor(startFrame * waveformRatio);

            // how many milliseconds per px (char width).
            let timeRatio = info.length / waveformWidth;

            response.info = {
                start: startTime,
                timeRatio: timeRatio,
                end: startTime + (timeRatio * data.width)
            };

            waveformLines.forEach(line => {
                response.waveform += line.substr(startChar, data.width) + '\n';
            });

            ws.send(JSON.stringify(response));

        }

    });

});