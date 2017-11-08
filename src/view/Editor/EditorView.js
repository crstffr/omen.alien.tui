import {View} from '../View';
import {Text} from '../../component/Text/Text';
import {MenuRow} from '../../component/MenuRow/MenuRow';

export class EditorView extends View {
    constructor () {
        super();

        this.logo = new Text(this.box, {
            val: 'E D I T O R',
            font: 'Bloody',
            color: 'light yellow'
        });

        this.menu = new MenuRow(this.box, ['OPEN', '-', '-', '-']);

    }
}