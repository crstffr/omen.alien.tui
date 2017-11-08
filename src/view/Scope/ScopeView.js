import Figlet from 'figlet';
import {View} from '../View';

export class ScopeView extends View {
    constructor () {
        super();

        this.box = this.tui.box({
            parent: this.parent.container,
            top: 'center',
            left: 'center',
            style: {
                fg: '#00ff00'
            }
        });

        this.hide();

        Figlet.text('S C O P E', {font: 'Bloody'}, (err, text) => {
            if (err) { console.log(err); return; }
            let content = text.split('\n').map(line => {
                return line.replace(/\w?$/, '');
            }).join('\n');
            this.box.setContent(content);
            this.tui.render();
        });
    }
}