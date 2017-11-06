require('rootpath')();

const path = require('path');
const WebSocket = require('ws');
const spawnSync = require('child_process').spawnSync;

const settings = require('settings');
const wss = new WebSocket.Server({ port: 8911 });
const fetchCmd = path.join(settings.path.bin, 'fetch-waveform.js');

console.log('Server started at: ws:/localhost:8911');

let zoom = 0;
let waveform;

wss.on('connection', ws => {

    ws.on('message', msg => {

        let data = JSON.parse(msg);
        let response = {type: data.type};

        console.log(data);

        if (data.type === 'fetch') {

            if (data.zoom !== zoom) {
                waveform = spawnSync(fetchCmd, [
                    data.width, data.height, data.file, data.zoom
                ]).stdout.toString();
            }

            response.waveform = '';
            let start = data.start || 0;

            waveform.split('\n').forEach(line => {
                let chars = line.split('');
                for (let i = start; i < start + data.width; i++) {
                    response.waveform += chars[i];
                }
                response.waveform += '\n';
            });

            ws.send(JSON.stringify(response));

        }
    });

});