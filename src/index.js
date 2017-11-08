
import StateMachine from 'javascript-state-machine';
import {ViewService, views} from './service/ViewService';

// Views
import {SplashView} from './view/Splash/SplashView'
import {ScopeView} from './view/Scope/ScopeView'

import {console} from './util/console';
import {screen} from './inst/screen';

let settings = require('../settings');
process.title = 'Omen Alien';

ViewService.push('Splash', new SplashView());
ViewService.push('Scope', new ScopeView());


let fsm = new StateMachine({
    init: 'Splash',
    transitions: [
        {name: 'openScope',     from: '*',  to: 'Scope'},
        {name: 'openRecorder',  from: '*',  to: 'Recorder'},
        {name: 'openPlayer',    from: '*',  to: 'Player'},
        {name: 'openEditor',    from: '*',  to: 'Editor'},
        {name: 'openFiles',     from: '*',  to: 'Files'}
    ],
    methods: {
        onLeaveState: state => {
            if (state.from !== 'none') {
                if (views[state.from]) {
                    views[state.from].hide();
                    console.log('hide', state.from)
                }
            }
        },
        onEnterState: state => {
            if (state.to !== 'none') {
                if (views[state.to]) {
                    views[state.to].show();
                    screen.render();
                }
            }
        }
    }
});

// Slice off the first transition (init not needed).
let transitions = fsm.allTransitions().slice(1);

screen.key(['C-c', 'q'], () => {
    screen.destroy();
    process.exit(0);
});

screen.key([1,2,3,4,5], key => {
    let transition = transitions[key - 1];
    if (fsm[transition]) {
        fsm[transition]();
    }
});