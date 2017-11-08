import Blessed from 'blessed';
export let tui = Blessed;

let program = tui.program();
program.disableMouse();
program.hideCursor();

export let screen = tui.screen({
    autoPadding: true,
    dockBorders: true,
    title: process.title,
});

// Add helpers onto the tui object
tui.parent = {screen: screen};
tui.key = screen.key.bind(screen);
tui.render = screen.render.bind(screen);

export let container = tui.parent.container = tui.box({
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

export let overlay = tui.parent.overlay = tui.box({
    parent: screen,
    transparent: true,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
});

overlay.hide();