import StateMachine from 'javascript-state-machine';
import {screen} from '../inst/screen';
import {views} from './ViewService';

export let RouterService = new StateMachine({
    transitions: [
        {name: 'openSplash',    from: '*',  to: 'Splash'},
        {name: 'openScope',     from: '*',  to: 'Scope'},
        {name: 'openRecorder',  from: '*',  to: 'Recorder'},
        {name: 'openEditor',    from: '*',  to: 'Editor'},
        {name: 'openMap',       from: '*',  to: 'Map'}
    ],
    methods: {
        onLeaveState: state => {
            if (state.from !== 'none') {
                let from = views[state.from];
                if (from) {
                    from.beforeHide();
                    from.hide();
                    from.hideChildren();
                    from.afterHide();
                }
            }
        },
        onEnterState: state => {
            if (state.to !== 'none') {
                let to = views[state.to];
                if (to) {
                    to.beforeShow();
                    to.show();
                    to.showChildren();
                    to.afterShow();
                    screen.render();
                }
            }
        }
    }
});