import {tui, screen, container} from '../inst/screen';

export class View {

    box = {};
    tui = tui;
    screen = screen;

    constructor () {

        this.box = this.tui.box({
            parent: container,
            width: '100%-2',
            height: '100%-2'
        });

        this.box.hide();

    }

    beforeShow() {}
    beforeHide() {}
    afterShow() {}
    afterHide() {}

    hideChildren() {
        this.box.children.forEach(child => {
            child.hide();
        });
    }

    showChildren() {
        this.box.children.forEach(child => {
            child.show();
        });
    }

    show() {
        this.box.show();
        screen.render();
    }

    hide() {
        this.box.hide();
        screen.render();
    }

    toggle() {
        this.box.toggle();
        screen.render();
    }

}