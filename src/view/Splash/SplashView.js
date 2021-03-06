import {View} from '../View';
import {Text} from '../../component/Text/Text';
import {MenuRow} from '../../component/MenuRow/MenuRow';
import {console} from '../../util/console';

export class SplashView extends View {
    constructor () {
        super();

        this.logo = new Text(this.box, {
            val: 'A L I E N',
            font: 'Bloody',
            color: 'light green'
        });

        this.menu = new MenuRow(this.box, ['SCOPE', 'RECORD', 'EDIT', 'ASSIGN']);
    }
}