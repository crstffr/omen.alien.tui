let throttle = require('lodash.throttle');
let blessed = require('blessed');
let program = blessed.program();

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

let track = {
    16: require('./test-16.json'),
    24: require('./test-24.json'),
    32: require('./test-32.json'),
    64: require('./test-64.json'),
    128: require('./test-128.json')
};

function renderWaveform() {

    let rows = new Array(waveform.height).fill(new Array(waveform.width).fill(0));

    let res = 0;

    if (zoom < 8) {
        res = 128;
    } else if (zoom < 24) {
        res = 64;
    } else if (zoom < 64) {
        res = 32;
    } else if (zoom < 96) {
        res = 24;
    } else if (zoom >= 96) {
        res = 16;
    }

    let content = "";
    let data = track[res];
    let center = Math.floor(waveform.height / 2);
    let hratio = waveform.height / Math.pow(2, data.bits);
    let maxinc = data.length * 2 / waveform.width;
    let rate = data.sample_rate / data.samples_per_pixel;
    let inc = maxinc / zoom;
    let maxview = maxinc * waveform.width;
    let viewing = inc * waveform.width;
    let samples = data.data;

    start = Math.floor(maxview - viewing) / 2;

    console.log('---');
    console.log(' zoom:', twoDecimals(zoom));
    console.log(' res:', res);
    console.log(' > start:', start);
    console.log(' > inc:', twoDecimals(inc));
    console.log(' > rate:', twoDecimals(rate));
    console.log(' > viewing:', twoDecimals(viewing));
    //console.log('zoom:', zoom, 'viewing:', viewing, 'inc:', inc, 'start:', start);

    let vals = [];

    for (let i = 0; i < waveform.width; i++) {
        let x = i;
        let i1 = Math.round((i * inc) + start);
        let i2 = i1 + 1;
        let y1 = Math.round(samples[i1] * hratio);
        let y2 = Math.round(samples[i2] * hratio);
        let h  = Math.abs(y1 - y2);
        let hh = Math.ceil(h/2);
        vals.push(hh);
    }

    for (let r = 0; r < waveform.height; r++) {
        for (let c = 0; c < waveform.width; c++) {
            let v = vals[c];
            if (r < center) {
                content += (v >= (center - r)) ? '│' : ' ';
            } else if (r === center) {
                content += (v > 0) ? '│' : '·';
            } else if (r > center) {
                content += (v >= (r - center)) ? '│' : ' ';
            }
        }
        content += '\n';
    }

    waveform.setContent(content);

    let timespace = waveform.width / 6;
    for (let i = 1; i < 6; i++) {
        let x = Math.floor(i * timespace);
        let sample = Math.round((x * inc / 2) + (start / 2));
        let time = twoDecimals(sample / rate);
        if (time < 10) {
            time = '00:0' + time;
        }
        blessed.text({
            parent: timescale,
            left: x - 3,
            top: -1,
            height: 3,
            align: 'center',
            style: {
                fg: '#888'
            }
        }).setContent('   |\n' + time);
    }

    screen.render();

}


screen.key('z', function(ch, key) {
    let z = zoom / 1.25;
    zoom = (z > 1) ? z : 1;
    renderWaveform();
});

screen.key('x', function(ch, key) {
    let z = zoom * 1.25;
    zoom = (z < 128) ? z : 128;
    renderWaveform();
});


renderWaveform();
screen.render();


function twoDecimals(val) {
    return Math.round(val * 100) / 100;
}