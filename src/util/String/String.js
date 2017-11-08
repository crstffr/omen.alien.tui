import {console} from '../console';

export function dimensions(str) {
    let lines = str.split('\n');
    return {
        w: longestLine(lines),
        h: lines.length
    }
}

export function longestLine(lines) {
    let len = 0;
    lines.forEach(line => {
        if (line.length > len) {
            len = line.length;
        }
    });
    return len;
}

export function trimRight(str) {
    return str.replace(/\s*$/, '');
}

export function trim(str) {
    return str.split('\n').map(line => {
        return trimRight(line);
    }).filter(line => {
        return line.length;
    }).join('\n');
}