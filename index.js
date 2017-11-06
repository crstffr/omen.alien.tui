let WebSocket = require('ws');
let throttle = require('lodash.throttle');
let blessed = require('blessed');
let program = blessed.program();

let waveformService = new WebSocket('ws://localhost:8911');
let waveformServiceActive = false;

waveformService.on('open', function open() {
    waveformServiceActive = true;
    renderWaveform();
});

let line;
let test = 1;

process.title = 'OmenAlien';
program.disableMouse();
program.hideCursor();

let screen = blessed.screen({
    autoPadding: true,
    dockBorders: true,
    title: process.title,
});

screen.key(['C-c', 'q'], function(ch, key) {
    screen.destroy();
    process.exit(0);
});

screen.key('`', function(ch, key) {
    consoleBox.toggle();
    screen.render();
});

/*
screen.key('a', () => {
    test = test === 1 ? 2 : 1;
    renderImage()
});
screen.key('z', throttle(moveLineLeft, 200));
screen.key('x', throttle(moveLineRight, 200));
*/
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

let waveform = blessed.box({
    parent: container,
    top: 0,
    left: 0,
    padding: 0,
    width: '100%-2',
    valign: 'center',
    height: '85%',
    style: {
        fg: 'yellow'
    }
});

let logo = blessed.box({
    parent: container,
    top: 'center',
    left: 'center',
    width: 54,
    height: 11,
    style: {
        fg: '#00ff00'
    }
});

logo.setContent(
    "   ▄▄▄         ██░       ██░  ▓█████    ███▄    █\n" +
    "  ▒████▄      ▒██▒      ▒██▒  ▓█   ▀    ██ ▀█   █\n" +
    "  ▒██  ▀█▄    ▒██░      ▒██▒  ▒███     ▓██  ▀█ ██▒\n" +
    "  ░██▄▄▄▄██   ▒██░      ░██░  ▒▓█  ▄   ▓██▒  ▐▌██▒\n" +
    "   ▓█   ▓██▒  ░██████▒  ░██░  ░▒████▒  ▒██░   ▓██░\n" +
    "   ▒▒   ▓▒█░  ░ ▒░▓  ░  ░▓    ░░ ▒░ ░  ░ ▒░   ▒ ▒ \n" +
    "    ▒   ▒▒ ░  ░ ░ ▒  ░   ▒ ░   ░ ░  ░  ░ ░░   ░ ▒░\n" +
    "    ░   ▒       ░ ░      ▒ ░     ░        ░   ░ ░ \n" +
    "        ░  ░      ░  ░   ░       ░  ░           ░ \n"
);

logo.hide();

let timescale = blessed.box({
    parent: container,
    width: '100%-2',
    height: 4,
    left: 0,
    top: '78%',
    style: {
        fg: 'white'
    }
});

let consoleBox = blessed.log({
    parent: container,
    scrollable: true,
    label: 'CONSOLE',
    scrollOnInput: true,
    top: 0,
    left: 0,
    width: '30%',
    height: '100%-2',
    border: {
        type: 'line',
        fg: 'white',
        bg: 'dark grey'
    }
});

consoleBox.hide();

let console = {
    log: (...args) => {
        let content = "";
        args.forEach(val => {
            content += val + " ";
        });
        consoleBox.add(content);
    }
};

let zoom = 1;
let start = 0;

function renderWaveform() {
    if (!waveformServiceActive) { return; }
    waveformService.send(JSON.stringify({
        type: 'fetch',
        width: waveform.width,
        height: waveform.height,
        file: 'test.wav',
        start: start,
        zoom: zoom
    }));
}

waveformService.on('message', msg => {
    let data = JSON.parse(msg);
    if (data.type === 'fetch') {
        waveform.setContent(data.waveform);
        screen.render();
    }
});

screen.key('n', function(ch, key) {
    start = (start > 0) ? start - 10 : 0;
    renderWaveform();
});

screen.key('m', function(ch, key) {
    if (zoom === 1) { return; }
    start += 10;
    renderWaveform();
});

screen.key('z', function(ch, key) {
    zoom = (zoom > 1) ? zoom - 1 : 1;
    if (zoom === 1) { start = 0; }
    renderWaveform();
});

screen.key('x', function(ch, key) {
    zoom = (zoom < 22) ? zoom + 1 : 22;
    renderWaveform();
});


renderWaveform();
screen.render();


function twoDecimals(val) {
    return Math.round(val * 100) / 100;
}