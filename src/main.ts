import { Game } from './game';

window.focus();

const game: Game = new Game();
game.start();

// tslint:disable-next-line:no-any
(window as any).game = game;
