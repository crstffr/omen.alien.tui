import {tui, screen} from '../inst/screen';

export class View {

    box = {};
    tui = tui;
    parent = tui.parent;

    constructor () { }

    show() {
        this.box.show();
    }

    hide() {
        this.box.hide();
    }

    toggle() {
        this.box.toggle();
    }

    render() {
        this.parent.screen.render();
    }

    setContent(content) {
        this.box.setContent(content);
    }

}