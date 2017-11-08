
import {container, tui, screen} from '../../inst/screen';

export let ConsoleView = tui.log({
    parent: container,
    scrollable: true,
    scrollOnInput: true,
    label: 'CONSOLE',
    top: 0,
    left: 0,
    width: '30%',
    height: '100%-2',
    border: {
        type: 'line',
        fg: 'white'
    }
});

ConsoleView.hide();

tui.key('`', () => {
    ConsoleView.toggle();
    tui.render();
});

ConsoleView.on('show', foo => {
    ConsoleView.setFront();
});