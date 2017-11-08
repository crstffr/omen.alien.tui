import Figlet from 'figlet';
import {Component} from '../Component';
import {trim, dimensions} from '../../util/String/String';

import {console} from '../../util/console';

export class Text extends Component {

    font = '';

    constructor (parent, opts) {
        super();

        this.font = opts.font;

        this.box = this.tui.box({
            parent: parent,
            top: 'center',
            left: 'center',
            style: {
                fg: opts.color || 'white'
            }
        });

        if (opts.val) {
            this.setText(opts.val);
        }
    }

    setText(str) {
        Figlet.text(str, {font: this.font}, (err, text) => {
            let content = trim(text);
            let dims = dimensions(content);
            this.box.setContent(content);
            this.box.height = dims.h + 1;
            this.box.width = dims.w;
            this.tui.render();
        });
    }

}