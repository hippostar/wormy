import Game from './game';

window.focus();

let game = new Game();
game.start();

// global var
(window as any).game = game;