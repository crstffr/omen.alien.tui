import Figlet from 'figlet';
import {Component} from '../Component';
import {container} from '../../inst/screen';
import {trim, dimensions} from '../../util/String/String';

class ConsoleView extends Component {
    constructor () {
        super();

        this.box = this.tui.log({
            parent: container,
            scrollOnInput: true,
            transparent: true,
            scrollable: true,
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

        this.box.on('show', foo => {
            this.box.setFront();
        });

        this.hide();
    }
}

export let Console = new ConsoleView();