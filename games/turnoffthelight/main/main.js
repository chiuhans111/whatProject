

import game from './game';

var cee = Cee('cee', 2, 2);

cee.render('大 家 早 安 ');


cee.render(game(require('./level/level1')));


export default function () {

}

