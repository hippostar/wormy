import { Direction, Point } from './defs';
import { Game } from './game';

const INITIAL_LENGTH: number = 300;
const INITIAL_DIRECTION: Direction = 'Right';
const INITIAL_POSITION: Point = { x: 50, y: 50 };

const BODY_WIDTH: number = 7;
const MOVEMENT: number = 5;

export class Head implements Point {

    public x: number;
    public y: number;
    public direction: Direction;

    constructor(x: number, y: number, direction: Direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
    }

    public compare(other: Point): boolean {
        return this.x === other.x && this.y === other.y;
    }
}

export class Worm {

    private head: Head;
    private tail: Point[];
    private direction: Direction;
    private maximumLength: number;
    private game: Game;

    constructor(game: Game) {
        this.game = game;

        this.maximumLength = INITIAL_LENGTH;
        this.direction = INITIAL_DIRECTION;

        // initial head
        this.head = new Head(INITIAL_POSITION.x, INITIAL_POSITION.y, INITIAL_DIRECTION);

        // initial tail
        this.tail = [{ x: INITIAL_POSITION.x, y: INITIAL_POSITION.y }];
    }

    public setDirection(direction: Direction): void {

        if (this.direction === 'Up' && (direction === 'Down' || direction === 'Up')) {
            return;
        }

        if (this.direction === 'Down' && (direction === 'Up' || direction === 'Down')) {
            return;
        }

        if (this.direction === 'Left' && (direction === 'Right' || direction === 'Left')) {
            return;
        }

        if (this.direction === 'Right' && (direction === 'Left' || direction === 'Right')) {
            return;
        }

        this.direction = direction;
    }

    public move(): void {

        const direction: Direction = this.direction;

        if (direction !== this.head.direction) {
            this.tail.push(this.head);
        }

        // get next head position
        this.head = this.getNext(direction);

        // check the worm size in pixels
        if (this.getSize() > this.maximumLength) {

            // get tail end and move it closer to head
            const tailEnd: Point = this.tail[0];
            const nextPoint: Point = this.tail.length > 1 ? this.tail[1] : this.head;

            const deltaX: number = nextPoint.x - tailEnd.x;
            const deltaY: number = nextPoint.y - tailEnd.y;

            if (deltaY < 0) {
                tailEnd.y -= MOVEMENT;
            } else if (deltaY > 0) {
                tailEnd.y += MOVEMENT;
            }

            if (deltaX < 0) {
                tailEnd.x -= MOVEMENT;
            } else if (deltaX > 0) {
                tailEnd.x += MOVEMENT;
            }

            // remove tail end if the tail end is now at the same location as next point
            if (tailEnd.y === nextPoint.y && tailEnd.x === nextPoint.x) {
                this.tail.splice(0, 1);
            }
        }
    }

    public grow(qty: number = 3): void {
        this.maximumLength += qty * BODY_WIDTH * 3;
    }

    public shrink(qty: number = 3): void {
        this.maximumLength -= qty * BODY_WIDTH * 3;
    }

    public getHead(): Head {
        return this.head;
    }

    public isWorm(point: Point): boolean {
        for (let i: number = 0; i < this.tail.length - 1; i++) {
            const p1: Point = this.tail[i];
            const p2: Point = this.tail[i + 1];
            if (point.x >= p1.x && point.x <= p2.x && point.y === p1.y && point.y === p2.y) {
                return true;
            }
            if (point.y >= p1.y && point.y <= p2.y && point.x === p1.x && point.x === p2.x) {
                return true;
            }
        }

        return false;
    }

    public draw(time: number, context: CanvasRenderingContext2D): void {

        const { x, y } = this.head;
        const offset: number = BODY_WIDTH * 2 / 3;

        // tail
        context.strokeStyle = '#333333';
        context.lineWidth = BODY_WIDTH * 2;
        context.beginPath();
        context.moveTo(x, y);
        for (let i: number = this.tail.length - 1; i >= 0; i--) {
            const point: Point = this.tail[i];
            context.lineTo(point.x, point.y);
        }
        context.stroke();

        // head
        context.fillStyle = '#111111';
        context.beginPath();
        context.arc(x, y, BODY_WIDTH + 0.5, 0, 2 * Math.PI, false);
        context.fill();

        // eyes
        switch (this.direction) {
            case 'Up':
                context.beginPath();
                context.arc(x + offset, y + offset, BODY_WIDTH / 4, 0, 2 * Math.PI, false);
                context.arc(x + 2 * offset, y + offset, BODY_WIDTH, 0, 2 * Math.PI, false);
                context.fillStyle = 'white';
                context.fill();
                break;
            case 'Down':
                context.beginPath();
                context.arc(x + offset, y + 2 * offset, BODY_WIDTH / 4, 0, 2 * Math.PI, false);
                context.arc(x + 2 * offset, y + 2 * offset, BODY_WIDTH / 4, 0, 2 * Math.PI, false);
                context.fillStyle = 'white';
                context.fill();
                break;
            case 'Right':
                context.beginPath();
                context.arc(x + 2 * offset, y + offset, BODY_WIDTH / 4, 0, 2 * Math.PI, false);
                context.arc(x + 2 * offset, y + 2 * offset, BODY_WIDTH / 4, 0, 2 * Math.PI, false);
                context.fillStyle = 'white';
                context.fill();
                break;
            case 'Left':
                context.beginPath();
                context.arc(x + offset, y + offset, BODY_WIDTH / 4, 0, 2 * Math.PI, false);
                context.arc(x + offset, y + 2 * offset, BODY_WIDTH / 4, 0, 2 * Math.PI, false);
                context.fillStyle = 'white';
                context.fill();
                break;
            default:
        }
    }

    private getSize(): number {
        const points: Point[] = [...this.tail, this.head];
        let size: number = 0;
        for (let i: number = 0; i < points.length - 1; i++) {
            const p1: Point = points[i];
            const p2: Point = points[i + 1];
            size += (Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y));
        }
        return size;
    }

    private getNext(direction: Direction): Head {
        switch (direction) {
            case 'Up':
                return new Head(this.head.x, this.head.y - MOVEMENT, direction);
            case 'Right':
                return new Head(this.head.x + MOVEMENT, this.head.y, direction);
            case 'Down':
                return new Head(this.head.x, this.head.y + MOVEMENT, direction);
            case 'Left':
                return new Head(this.head.x - MOVEMENT, this.head.y, direction);
            default:
                return null;
        }
    }
}
