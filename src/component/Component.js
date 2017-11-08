import {tui, screen} from '../inst/screen';

export class Component {

    box = {};
    tui = tui;
    showHandlers = [];
    hideHandlers = [];

    setBox(box) {
        this.box = box;
        this.box.on('show', () => {this.triggerShowHandlers()});
        this.box.on('hide', () => {this.triggerHideHandlers()});
        this.box.hide();
    }

    show() {
        this.box.show();
        screen.render();
    }

    hide() {
        this.box.hide();
        screen.render();
    }

    onShow(fn) {
        this.showHandlers.push(fn);
    }

    onHide(fn) {
        this.hideHandlers.push(fn);
    }

    triggerShowHandlers() {
        this.showHandlers.forEach(fn => fn());
    }

    triggerHideHandlers() {
        this.hideHandlers.forEach(fn => fn());
    }

    toggle() {
        if (this.box.hidden) {
            this.show();
        } else {
            this.hide();
        }
    }

    destroy() {
        this.showHandlers.length = 0;
        this.hideHandlers.length = 0;
        this.box.destroy();
    }

}