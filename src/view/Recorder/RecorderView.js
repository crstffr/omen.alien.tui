import {View} from '../View';
import {Text} from '../../component/Text/Text';
import {MenuRow} from '../../component/MenuRow/MenuRow';

export class RecorderView extends View {
    constructor () {
        super();

        this.logo = new Text(this.box, {
            val: 'R E C O R D E R',
            font: 'Bloody',
            color: 'light red'
        });

        this.menu = new MenuRow(this.box, ['START', '-', '-', '-']);

    }
}