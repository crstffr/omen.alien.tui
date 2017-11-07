require('rootpath')();

let path = require('path');
let WebSocket = require('ws');
let figlet = require('figlet');
let blessed = require('blessed');
let Measured = require('measured');
let settings = require('settings');
let program = blessed.program();

let waveformService = new WebSocket('ws://localhost:8911');
let waveformServiceActive = false;

waveformService.on('open', function open() {
    waveformServiceActive = true;
    renderWaveform();
});

let line;
let test = 1;

let cursor;
let cursorPosition = 0;

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

let waveformBox = blessed.box({
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

let start = 0;
let zoomLevel = 1;
let lastFrame = 0;
let filename = 'test.wav';
let fileInfo = require(path.join(settings.path.user.samples, filename, 'info.json'));
let waveInfo = {};

let menuBar = blessed.box({
    parent: container,
    width: '100%-2',
    height: 4,
    bottom: 0,
    style: {
        fg: '#00ff00'
    }
});

figlet.text(' MODE | TRIM | FOOB | BARZ ', {
    // font: 'Mini'
    // font: 'Small Shadow'
    font: 'JS Stick Letters'
},(err, text) => {
    text = text.replace(/\|/g, '│');
    menuBar.setContent(text);
});

let menuLine = blessed.line({
    parent: container,
    orientation: 'horizontal',
    bottom: 4,
    style: {
        fg: '#00ff00'
    }
});

let infoBar = blessed.box({
    parent: container,
    width: '100%-2',
    height: 3
});

let infoLine = blessed.line({
    parent: container,
    orientation: 'horizontal',
    top: 3,
    style: {
        fg: '#00ff00'
    }
});

let infoBox1 = blessed.box({
    parent: infoBar,
    width: '25%+1',
    height: 3,
    left: 0,
    top: 0,
    align: 'left',
    valign: 'middle'
});

let infoBox2 = blessed.box({
    parent: infoBar,
    width: '25%+1',
    height: 3,
    left: '25%',
    top: 0,
    align: 'center',
    valign: 'middle',
    content: 'Mode: TRIM'
});

let infoBox3 = blessed.box({
    parent: infoBar,
    width: '25%+1',
    height: 3,
    left: '50%',
    top: 0,
    align: 'center',
    valign: 'middle'
});

let infoBox4 = blessed.box({
    parent: infoBar,
    width: '25%+1',
    height: 3,
    left: '75%',
    top: 0,
    align: 'center',
    valign: 'middle'
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
        fg: 'white'
    }
});

consoleBox.hide();

let console = {
    log: (...args) => {
        let content = "";
        args.forEach(val => {
            if (typeof val === 'object') {
                val = JSON.stringify(val, null, '  ');
            }
            content += val + " ";
        });
        consoleBox.add(content);
    }
};

function renderInfoFile() {
    let length = fileInfo.length / 1000 + 's';
    infoBox1.setContent(` File: ${filename}\n Length: ${length}`);
}

function renderInfoZoom() {
    infoBox3.setContent(`Zoom: ${zoomLevel}`);
}

function renderInfoCursor() {
    let seconds = (cursorPosition + 1) * waveInfo.timeRatio / 1000;
    let position = Math.round(seconds * 1000) / 1000;
    infoBox4.setContent(`Cursor: ${position}s`);
}

renderInfoFile();
renderInfoZoom();
renderInfoCursor();

function renderWaveform() {
    if (!waveformServiceActive) { return; }
    waveformService.send(JSON.stringify({
        type: 'fetch',
        width: waveformBox.width,
        height: waveformBox.height,
        file: filename,
        zoom: zoomLevel,
        start: start,
    }));
}

waveformService.on('message', msg => {
    let data = JSON.parse(msg);
    if (data.type === 'fetch') {
        waveformBox.setContent(data.waveform);
        waveInfo = data.info;
        renderInfoCursor();
        screen.render();
    }
});

let cursorMeter = new Measured.Meter({
    rateUnit: 300
});

function renderCursor() {
    if (cursor) {
        cursor.destroy();
        cursor = null;
    }
    cursor = blessed.line({
        parent: waveformBox,
        orientation: 'vertical',
        top: 4,
        left: cursorPosition,
        style: {
            fg: '#ff0000'
        }
    });
    renderInfoCursor();
    screen.render();
}

function moveCursor(dir) {
    let boost = 0;
    let change = 0;
    let pos = cursorPosition;
    let min = 0, max = waveformBox.width - 1;
    let rate = cursorMeter.toJSON().currentRate;
    if (rate > 2.5) { boost = 3}
    if (rate > 3) { boost = 6}
    switch (dir) {
        case 'left':
            change = -(1 + boost);
            break;
        case 'right':
            change = 1 + boost;
            break;
    }
    pos += change;
    if (pos > max) {
        if (waveInfo.end !== 0) {
            // start
        }
        pos = max;
    } else if (pos < min) {
        console.log(waveInfo.start);
        pos = min;
    }
    cursorPosition = pos;
    cursorMeter.mark();
    renderCursor();
}

function zoom(dir) {
    switch (dir) {
        case 'up': // in
            if (zoomLevel === 'max') { return; }
            if (zoomLevel === 22) {
                zoomLevel = 'max';
            } else {
                zoomLevel++;
            }
            break;
        case 'down': // out
            if (zoomLevel === 'max') {
                zoomLevel = 22;
            } else if (zoomLevel === 1) {
                start = 0;
            } else {
                zoomLevel--;
            }
            break;
    }
    renderInfoZoom();
    renderWaveform();
}

screen.on('keypress', (char, extra) => {
    switch(extra.name) {
        case 'left':
        case 'right':
            moveCursor(extra.name);
            break;
        case 'up':
        case 'down':
            zoom(extra.name);
            break;
    }
});

renderWaveform();
screen.render();


function twoDecimals(val) {
    return Math.round(val * 100) / 100;
}