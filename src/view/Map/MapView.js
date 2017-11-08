import {View} from '../View';
import {Text} from '../../component/Text/Text';
import {MenuRow} from '../../component/MenuRow/MenuRow';

export class MapView extends View {
    constructor () {
        super();

        this.logo = new Text(this.box, {
            val: 'M A P',
            font: 'Bloody',
            color: 'light magenta'
        });

        this.menu = new MenuRow(this.box, ['-', '-', '-', '-']);

    }
}