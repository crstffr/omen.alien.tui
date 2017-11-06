
let path = require('path');
let appRoot = require('app-root-dir');

let root = appRoot.get() + '/';
let user = path.join(root, 'userdata') + '/';

module.exports = {
    path: {
        root: root + '/',
        bin: path.join(root, 'bin') + '/',
        user: {
            root: user,
            audio: path.join(user, 'audio') + '/',
            samples: path.join(user, 'samples') + '/',
            waveforms: path.join(user, 'waveforms') + '/'
        }
    },
    waveforms: {
        zoomMultiplier: 1.25,
        sampleResolution: 16
    }
};