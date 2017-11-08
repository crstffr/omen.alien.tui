
export class Unit {

    time = 0;
    frame = 0;
    position = 0;
    type = '';
    conv = {};

    constructor (obj) {
        obj = obj || {};
        if (obj.time) {
            this.type = 'time';
            this.time = obj.time;
        } else if (obj.frame) {
            this.type = 'frame';
            this.frame = obj.frame;
        } else if (obj.position) {
            this.type = 'position';
            this.position = obj.position;
        }
    }

    toMs() {

    }

    toSec() {

    }

    toPos() {

    }

    toFrame() {

    }

}