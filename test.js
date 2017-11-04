let throttle = require('lodash.throttle');
let sleep = require('system-sleep');
let debounce = require('debounce');
let blessed = require('blessed');
let program = blessed.program();

process.title = 'OmenAlien';
program.disableMouse();
program.hideCursor();

let screen = blessed.screen({
    autoPadding: true,
    dockBorders: true,
    title: process.title,
});

let container = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    padding: 0,
    border: {
        type: 'line',
        fg: 'green'
    }
});

for (let i = 1; i <= 100; i ++) {
    console.log(i);
}