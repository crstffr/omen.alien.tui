let blessed = require('blessed');
let program = blessed.program();

process.title = 'OmenAlien';
program.disableMouse();
program.hideCursor();

var screen = blessed.screen({
    lockKeys: true,
    grabKeys: false,
    autoPadding: false,
    dockBorders: true,
    title: process.title,
});

screen.on('keypress', (...args) => {
    // console.log(args);
});

var container = blessed.box({
    parent: screen,
    top: 'center',
    left: 'center',
    width: '100%',
    height: '100%',
    padding: 0,
    border: {
      type: 'line',
      fg: 'white'
    },
    style: {
        fg: '#00ff00'
    }
});

container.setContent(
"    ▒█████      ███▄ ▄███▓   ▓█████     ███▄    █\n" +
"   ▒██▒  ██▒   ▓██▒▀█▀ ██▒   ▓█   ▀     ██ ▀█   █\n" +
"   ▒██░  ██▒   ▓██    ▓██░   ▒███      ▓██  ▀█ ██▒\n" +
"   ▒██   ██░   ▒██    ▒██    ▒▓█  ▄    ▓██▒  ▐▌██▒\n" +
"   ░ ████▓▒░   ▒██▒   ░██▒   ░▒████▒   ▒██░   ▓██░\n" +
"   ░ ▒░▒░▒░    ░ ▒░   ░  ░   ░░ ▒░ ░   ░ ▒░   ▒ ▒\n" +
"     ░ ▒ ▒░    ░  ░      ░    ░ ░  ░   ░ ░░   ░ ▒░\n" +
"   ░ ░ ░ ▒     ░      ░         ░         ░   ░ ░\n" +
"       ░ ░            ░         ░  ░            ░\n"
);

screen.render();

screen.key('q', function() {
    process.exit(0);
});

/*

    ▒█████      ███▄ ▄███▓   ▓█████     ███▄    █\n
   ▒██▒  ██▒   ▓██▒▀█▀ ██▒   ▓█   ▀     ██ ▀█   █\n
   ▒██░  ██▒   ▓██    ▓██░   ▒███      ▓██  ▀█ ██▒\n
   ▒██   ██░   ▒██    ▒██    ▒▓█  ▄    ▓██▒  ▐▌██▒\n
   ░ ████▓▒░   ▒██▒   ░██▒   ░▒████▒   ▒██░   ▓██░\n
   ░ ▒░▒░▒░    ░ ▒░   ░  ░   ░░ ▒░ ░   ░ ▒░   ▒ ▒\n
     ░ ▒ ▒░    ░  ░      ░    ░ ░  ░   ░ ░░   ░ ▒░\n
   ░ ░ ░ ▒     ░      ░         ░         ░   ░ ░\n
       ░ ░            ░         ░  ░            ░\n
\n
▄▄▄          ██▓        ██▓   ▓█████     ███▄    █\n
▒████▄       ▓██▒       ▓██▒   ▓█   ▀     ██ ▀█   █\n
▒██  ▀█▄     ▒██░       ▒██▒   ▒███      ▓██  ▀█ ██▒\n
░██▄▄▄▄██    ▒██░       ░██░   ▒▓█  ▄    ▓██▒  ▐▌██▒\n
▓█   ▓██▒   ░██████▒   ░██░   ░▒████▒   ▒██░   ▓██░\n
▒▒   ▓▒█░   ░ ▒░▓  ░   ░▓     ░░ ▒░ ░   ░ ▒░   ▒ ▒\n
▒   ▒▒ ░   ░ ░ ▒  ░    ▒ ░    ░ ░  ░   ░ ░░   ░ ▒░\n
░   ▒        ░ ░       ▒ ░      ░         ░   ░ ░\n
░  ░       ░  ░    ░        ░  ░            ░ \n

*/