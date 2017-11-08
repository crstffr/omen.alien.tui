import {View} from '../View';
import {Text} from '../../component/Text/Text';
import {MenuRow} from '../../component/MenuRow/MenuRow';

export class ScopeView extends View {
    constructor () {
        super();

        this.logo = new Text(this.box, {
            val: 'S C O P E',
            font: 'Bloody',
            color: 'light blue'
        });

        this.menu = new MenuRow(this.box, ['LOCKED', '-', '-', '-']);
    }
}