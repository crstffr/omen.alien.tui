import {ConsoleView} from '../component/Console/Console';

export let console = {
    log: (...args) => {
        let content = '';
        args.forEach(val => {
            if (typeof val === 'object') {
                val = JSON.stringify(val, null, '  ');
            }
            content += val + " ";
        });
        ConsoleView.add(content);
    }
};