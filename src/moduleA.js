import {moduleC} from './moduleC.js';
import {moduleB} from './moduleB.js';

export function moduleA() {
    return moduleC() + `我今年 ${moduleB()} 哈哈哈哈`;
}
