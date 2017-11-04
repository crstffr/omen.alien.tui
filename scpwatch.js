let scp = require('scp');
let path = require('path');
let nodemon = require('nodemon');

nodemon({
    ext: '*',
    stdout: false,
    script: 'noop.js',
}).on('restart', (files) => {
    files.forEach(file => {
        scp.send({
            file: file,
            user: 'pi',
            host: '192.168.66.132',
            port: '22',
            path: '~/omen.alien.tui'
        }, (err) => {
            if (err) console.log(err);
            else console.log('TX: ' + file);
        });
    });
});