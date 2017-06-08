import Game from './game';

const INITIAL_LENGTH = 300;
const INITIAL_DIRECTION = 'Right';
const INITIAL_POSITION = { x: 50, y: 50 };

const SIZE = 7;
const MOVEMENT = 5;

export type Direction = 'Up' | 'Right' | 'Left' | 'Down';

export class Point {

    x:number;
    y:number;
    direction:Direction;

    constructor(x:number, y:number, direction:Direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
    }

    compare(other:Point) {
        return this.x == other.x && this.y == other.y;
    }
}

export default class Worm {

    private head: Point;
    private tail: Point[];
    private direction: Direction;
    private size: number;
    private game: Game;

    constructor(game:Game) {
        this.game = game;
       
        this.size = INITIAL_LENGTH;
        this.direction = INITIAL_DIRECTION;
        
        // initial head
        this.head = new Point(INITIAL_POSITION.x, INITIAL_POSITION.y, INITIAL_DIRECTION);
      
        // initial tail
        this.tail = [new Point(INITIAL_POSITION.x, INITIAL_POSITION.y, INITIAL_DIRECTION)];
    }
  
    setDirection(direction:Direction) {

        if(this.direction == 'Up' && (direction == 'Down' || direction == 'Up')) {
          return;
        }

        if(this.direction == 'Down' && (direction == 'Up' || direction == 'Down')) {
          return;
        }

        if(this.direction == 'Left' && (direction == 'Right' || direction == 'Left')) {
          return;
        }

        if(this.direction == 'Right' && (direction == 'Left' || direction == 'Right')) {
          return;
        }

        this.direction = direction;
    }

    move() {

        const direction = this.direction;

        if(direction != this.head.direction) {
            this.tail.push(this.head);
        }
      
        // get next head position
        this.head = this.getNext(direction);

        // fix the worm size
        if (this.getSize() > this.size) {
            
            const tailEnd = this.tail[0];
            const nextPoint = this.tail.length > 1 ? this.tail[1] : this.head;

            switch(nextPoint.direction) {
                case 'Up':
                    tailEnd.y -= MOVEMENT;
                    break
                case 'Down':
                    tailEnd.y += MOVEMENT;
                    break;
                case 'Left':
                    tailEnd.x -= MOVEMENT;
                    break;
                case 'Right':
                    tailEnd.x += MOVEMENT;
                    break;
            }

            // remove tail end if the tail end is now at the same location as next point
            if(tailEnd.y == nextPoint.y && tailEnd.x == nextPoint.x) {
                this.tail.splice(0, 1);
            }
        }
    }

    getSize() {
        const points = [...this.tail, this.head];
        let size = 0;
        for(let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i+1];
            size += (Math.abs(p1.x - p2.x) + Math.abs(p1.y-p2.y));
        }
        return size;
    }

    getNext(direction:Direction) {
        switch (direction) {
            case 'Up':
                return new Point(this.head.x, this.head.y - MOVEMENT,  direction);
            case 'Right':
                return new Point(this.head.x + MOVEMENT, this.head.y,  direction);
            case 'Down':
                return new Point(this.head.x, this.head.y + MOVEMENT,  direction);
            case 'Left':
                return new Point(this.head.x - MOVEMENT, this.head.y,  direction);
        }
    }

    draw(time: number, context:CanvasRenderingContext2D) {
        
        const {x,y} = this.head;
        const offset = SIZE*2/3;

        // tail
        context.strokeStyle="#333333";
        context.lineWidth = SIZE * 2;
        context.beginPath();
        context.moveTo(x, y);
        for(let i = this.tail.length-1; i >= 0; i--) {
            const point = this.tail[i];
            context.lineTo(point.x, point.y);
        }
        context.stroke();

        // head
        context.fillStyle="#111111";
        context.beginPath();
        context.arc(x, y, SIZE+0.5, 0, 2 * Math.PI, false);
        context.fill();

        // eyes
        switch(this.direction[0]) {
          case 'Up':
             context.beginPath();
             context.arc(x + offset, y + offset, SIZE/4, 0, 2 * Math.PI, false);
             context.arc(x + 2 * offset, y + offset, SIZE, 0, 2 * Math.PI, false);
             context.fillStyle = 'white';
             context.fill();
            break;
            case 'Down':
             context.beginPath();
             context.arc(x + offset, y + 2*offset, SIZE/4, 0, 2 * Math.PI, false);
             context.arc(x + 2 * offset, y + 2*offset, SIZE/4, 0, 2 * Math.PI, false);
             context.fillStyle = 'white';
             context.fill();
            break;
            case 'Right':
             context.beginPath();
             context.arc(x + 2 * offset, y + offset, SIZE/4, 0, 2 * Math.PI, false);
             context.arc(x + 2 * offset, y + 2 * offset, SIZE/4, 0, 2 * Math.PI, false);
             context.fillStyle = 'white';
             context.fill();
            break;
            case 'Left':
             context.beginPath();
             context.arc(x + offset, y + offset, SIZE/4, 0, 2 * Math.PI, false);
             context.arc(x + offset, y + 2 * offset, SIZE/4, 0, 2 * Math.PI, false);
             context.fillStyle = 'white';
             context.fill();
            break;
        }
    }

    grow(qty:number = 3) {
        this.size += qty * SIZE * 3;
    }

    shrink(qty:number = 3) {
        this.size -= qty * SIZE * 3;
    }

    getHead():{x:number,y:number} {
        return {x:this.head.x, y:this.head.y};
    }

    isWorm(point:{x:number, y:number}) {
         for(let i = 0; i < this.tail.length - 1; i++) {
            const p1 = this.tail[i];
            const p2 = this.tail[i+1];
            if(point.x >= p1.x && point.x <= p2.x && point.y == p1.y && point.y == p2.y) {
                return true;
            }
            if(point.y >= p1.y && point.y <= p2.y && point.x == p1.x && point.x == p2.x) {
                return true;
            }
        }

        return false;
    }
}