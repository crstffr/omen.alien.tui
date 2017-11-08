import Figlet from 'figlet';
import {View} from '../View';
import {trimBlanks, strDimensions} from '../../util/String/String';

export class SplashView extends View {
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

        Figlet.text('A L I E N', {font: 'Bloody'}, (err, text) => {
            let content = trimBlanks(text);
            let dims = strDimensions(content);
            this.box.setContent(content);
            this.box.height = dims.h + 1;
            this.box.width = dims.w;
            this.tui.render();
        });
    }
}