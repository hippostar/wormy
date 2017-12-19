import { Direction, Item, Point } from './defs';
import { Map } from './map';
import { Head, Worm } from './worm';

// size
//const WIDTH: number = 800;
//const HEIGHT: number = 400;
const SCALE: number = 2;

// movement speed
const INITIAL_SPEED: number = 50;
const SPEED_CHANGE: number = 4;
const MINIMUM_SPEED: number = 15;

// levels
const MAX_LEVEL: number = 10;

// level background colors
export const COLORS: string[] = [
    '#fafafa',
    '#ffffcc',
    '#ffe6ee',
    '#e6f2ff',
    '#e6ffe6',
    '#fff0e6',
    '#e6e6ff',
    '#f9f2ec',
    '#e6ffe6',
    '#ff4d4d',
];

export class Game {

    private canvas: HTMLCanvasElement;

    private level: number = 0;
    private score: number = 0;
    private speed: number = INITIAL_SPEED;
    private turbo: boolean = false;
    private running: boolean = false;

    private map: Map;
    private worm: Worm;
    private nextMove: number;
    private width: number;
    private height: number;

    private touch: Touch;

    constructor() {

        this.canvas = document.createElement('Canvas') as HTMLCanvasElement;
        document.body.appendChild(this.canvas);

        // canvas element size in the page
        //this.canvas.style.width = WIDTH + 'px';
        //this.canvas.style.height = HEIGHT + 'px';

        this.worm = new Worm(this);
        this.map = new Map(this);

        // event listeners
        window.addEventListener('keydown', this.onKeyDown.bind(this), false);
        window.addEventListener('keyup', this.onKeyUp.bind(this), false);
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), false);
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    }

    public start(): void {
        this.nextMove = 0;
        this.running = true;
        requestAnimationFrame(this.loop.bind(this));
    }

    public stop(): void {
        this.running = false;
    }

    public getHeight(): number {
        return this.height;
    }

    public getWidth(): number {
        return this.width;
    }

    public getLevel(): number {
        return this.level;
    }

    private loop(time: number): void {

        if (this.running) {

            // get window size
            const w: number = window.innerWidth * SCALE;
            const h: number = window.innerHeight * SCALE;

            // update canvas size
            if (this.width !== w || this.height !== h) {
                this.canvas.style.width = `${Math.floor(w / SCALE)}px`;
                this.canvas.style.height = `${Math.floor(h / SCALE)}px`;
                this.width = this.canvas.width = w;
                this.height = this.canvas.height = h;
                this.map.seed();
            }

            requestAnimationFrame(this.loop.bind(this));

            if (this.turbo || time >= this.nextMove) {

                this.nextMove = time + this.speed;

                // move once
                this.worm.move();

                // check what happened
                this.checkState();

                // repaint
                this.paint(time);
            }
        }
    }

    private paint(time: number): void {

        const { width, height, level } = this;
        const color: string = COLORS[level];
        const context: CanvasRenderingContext2D = this.canvas.getContext('2d');

        // global settings
        context.lineWidth = 1 * SCALE;
        context.lineJoin = 'round';
        context.lineCap = 'round';

        // background
        context.fillStyle = color;
        context.fillRect(0, 0, width, height);

        // level
        context.font = `${height}px Arial`;
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.fillStyle = 'rgba(0,0,0,0.1)';
        context.fillText(`${level + 1}`, width / 2, height / 2);

        // score
        context.font = `${20 * SCALE}px Arial`;
        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.fillStyle = 'rgba(0,0,0,0.25)';
        context.fillText(`${this.score}`, 10 * SCALE, 10 * SCALE);

        // map items
        this.map.draw(time, context);

        // worm
        this.worm.draw(time, context);
    }

    private checkState(): void {

        const head: Head = this.worm.getHead();

        // left the play area or ate itself?
        if (this.isOutside(head) || this.worm.isWorm(head)) {
            // dead
            this.die();
            return;
        }

        // got items?
        const items: Item[] = this.map.getItemsAt(head);
        if (items !== undefined && items.length > 0) {

            this.score += items.length * 100;

            // apply item effects
            items.forEach((item: Item) => {
                switch (item.getType()) {
                    case 'GROW':
                        this.worm.grow();
                        break;
                    case 'SHRINK':
                        this.worm.shrink();
                        break;
                    case 'SPEED':
                        this.speedUp();
                        break;
                    case 'SLOW':
                        this.slowDown();
                        break;
                    default:
                }

            });

            this.map.removeItems(items);
            // all gone?
            if (!this.map.hasItems()) {
                this.levelUp();
            }
        }
    }

    private levelUp(): void {
        this.score += 1000;
        this.level++;
        if (this.level < MAX_LEVEL) {
            this.speedUp();
            this.map.seed();
        } else {
            this.win();
        }
    }

    private win(): void {
        alert(`Congratulations you beat the game!\r\nFinal Score: ${this.score}`);
        this.stop();
    }

    private die(): void {
        alert(`You died.\r\nFinal Score: ${this.score}`);
        this.stop();
    }

    private speedUp(): void {
        this.speed = Math.max(MINIMUM_SPEED, this.speed - SPEED_CHANGE);
    }

    private slowDown(): void {
        this.speed = Math.min(INITIAL_SPEED, this.speed + SPEED_CHANGE);
    }

    private isOutside(position: Point): boolean {
        return position.x < 0 || position.x >= this.width || position.y < 0 || position.y >= this.height;
    }

    private onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                this.worm.setDirection('Up');
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.worm.setDirection('Down');
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.worm.setDirection('Left');
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.worm.setDirection('Right');
                break;
            case ' ': // spacebar
                event.preventDefault();
                this.turbo = true;
                break;
            default:
        }
    }

    private onKeyUp(event: KeyboardEvent): void {
        // spacebar released
        if (event.key === ' ') {
            this.turbo = false;
        }
    }

    private onTouchStart(e: TouchEvent): void {
        this.touch = e.changedTouches[0];
        e.preventDefault();
    }

    private onTouchMove(e: TouchEvent): void {
        e.preventDefault();
    }

    private onTouchEnd(e: TouchEvent): void {

        const touch: Touch = e.changedTouches[0];

        const distX: number = touch.pageX - this.touch.pageX;
        const distY: number = touch.pageY - this.touch.pageY;

        let direction: Direction = null;

        if (Math.abs(distX) >= 100) {
            direction = (distX < 0) ? 'Left' : 'Right';
        } else if (Math.abs(distY) >= 100) {
            direction = (distY < 0) ? 'Up' : 'Down';
        }

        if (direction) {
            this.worm.setDirection(direction as Direction);
        }

        e.preventDefault();
    }
}
