import settings from '../settings';
import StateMachine from 'javascript-state-machine';
import {RouterService} from './service/RouterService';
import {ViewService, views} from './service/ViewService';

// Views
import {Console} from './component/Console/Console'

import {SplashView} from './view/Splash/SplashView';
import {ScopeView} from './view/Scope/ScopeView';
import {RecorderView} from './view/Recorder/RecorderView';
import {EditorView} from './view/Editor/EditorView';
import {MapView} from './view/Map/MapView';

import {screen} from './inst/screen';
import {console} from './util/console';

process.title = 'Omen Alien';

ViewService.push('Splash', new SplashView());
ViewService.push('Scope', new ScopeView());
ViewService.push('Recorder', new RecorderView());
ViewService.push('Editor', new EditorView());
ViewService.push('Map', new MapView());

RouterService.openSplash();

screen.on('keypress', (a, b) => {
    switch (b.name) {
        case 'escape':

            break;
        case 'tab':
            Console.toggle();
            break;
    }
});

screen.key(['C-c', 'q'], () => {
    screen.destroy();
    process.exit(0);
});

screen.key([1,2,3,4,5], key => {
    let transition = RouterService.allTransitions()[Number(key) - 1];
    if (RouterService[transition]) {
        RouterService[transition]();
    }
});