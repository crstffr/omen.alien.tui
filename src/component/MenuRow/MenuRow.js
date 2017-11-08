import {Text} from '../Text/Text';
import {Component} from '../Component';
import {console} from '../../util/console';

export class MenuRow extends Component {

    font = 'Mini';
    //font = 'Stick Letters';
    color = 'light yellow';

    buttons = [];
    keys = ['a', 's', 'd', 'f'];

    constructor (parent, buttons) {
        super(parent);

        this.setBox(this.tui.box({
            parent: parent,
            right: 0,
            height: 5,
            bottom: -1,
            style: {
                fg: '#00ff00',
            }
        }));

        this.createButtons(buttons || []);

        this.onShow(() => {
            // console.log('showing menurow');
        });

        this.onHide(() => {
            // console.log('hiding menurow');
        });

    }

    createButtons(buttons) {
        this.buttons = buttons.map((val, key) => {
            let w = Math.floor(100 / buttons.length);
            let o = key === 0 ? 1 : key;
            let x = String(w * key) + '%-1';
            let btn = this.tui.box({
                parent: this.box,
                align: 'center',
                left: x,
                height: 6,
                width: w + '%+3',
                border: {
                    type: 'line',
                    fg: '#00ff00',
                }
            });
            btn.text = new Text(btn, {
                val: val,
                font: this.font,
                color: this.color
            });
            return btn;
        });
    }

    updateButtons(buttons) {
        buttons.forEach((val, key) => {
            this.updateButton(key, val);
        });
    }

    updateButton(key, val) {
        this.buttons[key].text.setText(val);
    }

    keyHandler(key, data) {



    }

}