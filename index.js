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

function renderWaveform() {

    let content = "";
    let data = require('./test.json');
    let center = Math.floor(waveform.height / 2);
    let ratio = waveform.height / Math.pow(2, data.bits - 1);
    let maxinc = data.length * 2 / waveform.width;
    let rate = data.sample_rate / data.samples_per_pixel;
    let inc = maxinc / zoom;
    let maxview = maxinc * waveform.width;
    let viewing = inc * waveform.width;
    let samples = data.data;

    start = Math.floor((maxview - viewing) / 2 / 2);

    console.log('zoom:', zoom, 'viewing:', viewing, 'inc:', inc, 'start:', start);

    let vals = [];

    for (let i = 0; i < waveform.width; i++) {
        let x = i;
        let i1 = Math.round((i * inc) + start);
        let i2 = i1 + 1;
        let y1 = Math.round(samples[i1] * ratio);
        let y2 = Math.round(samples[i2] * ratio);
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
        let sample = Math.round((x * inc / 2) + start);
        let time = Math.round(sample / rate * 100) / 100;
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

}


screen.key('z', function(ch, key) {
    zoom = (zoom > 1) ? zoom / 1.25 : 1;
    renderWaveform();
});

screen.key('x', function(ch, key) {
    zoom = (zoom < 128) ? zoom * 1.25 : 128;
    renderWaveform();
});


renderWaveform();
screen.render();
