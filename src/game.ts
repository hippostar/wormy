
import Map from './map';
import Worm, { Direction } from './worm';

// size
const WIDTH = 800; 
const HEIGHT = 400;
const SCALE = 2;

// movement speed
const INITIAL_SPEED = 50;
const SPEED_CHANGE = 4;
const MINIMUM_SPEED = 15;

// levels
const MAX_LEVEL = 10;

// level background colors
export const COLORS = [
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

export default class Game {

    private canvas: HTMLCanvasElement;

    private level:number = 0;
    private score:number = 0;
    private speed:number = INITIAL_SPEED;
    private turbo:boolean = false;
    private running: boolean = false;

    private map: Map;
    private worm: Worm;
    private nextMove:number;
    private width:number;
    private height:number;

    private touch:Touch;

    constructor() {

        this.canvas = document.createElement('Canvas') as HTMLCanvasElement;
        document.body.appendChild(this.canvas);

        // canvas element size in the page
        //this.canvas.style.width = WIDTH + 'px';
        //this.canvas.style.height = HEIGHT + 'px';

        // image buffer size 
        this.canvas.width = WIDTH * SCALE;
        this.canvas.height = HEIGHT * SCALE;

        // save size
        this.width = this.canvas.width;
        this.height=  this.canvas.height;

        this.worm = new Worm(this);
        this.map = new Map(this);
      
        // event listeners
        window.addEventListener('keydown', this.onKeyDown.bind(this), false);
        window.addEventListener('keyup', this.onKeyUp.bind(this), false);
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), false);
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    }

    start() {
        this.nextMove = 0;
        this.running = true;
        requestAnimationFrame(this.loop.bind(this));
    }

    stop() {
        this.running = false;
    }

    getHeight() {
        return this.height;
    }

    getWidth() {
        return this.width;
    }

    getLevel() {
        return this.level;
    }

    loop(time:number) {

        if(this.running) {
          
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

    paint(time:number) {
      
        const {width, height, level} = this;
        const color = COLORS[level];
        const context = this.canvas.getContext("2d");
      
        // global settings
        context.lineWidth = 1 * SCALE;
        context.lineJoin = 'round';
        context.lineCap = 'round';
      
        // background
        context.fillStyle = color;
        context.fillRect(0,0,width,height);
      
        // level
        context.font = height+'px Arial';
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.fillStyle = 'rgba(0,0,0,0.1)';
        context.fillText(level+1+'', width/2, height/2);
      
        // score
        context.font = 20 * SCALE + 'px Arial';
        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.fillStyle = 'rgba(0,0,0,0.25)';
        context.fillText(this.score+'', 10*SCALE, 10*SCALE);

        // map items
        this.map.draw(time, context);
        
        // worm
        this.worm.draw(time, context);
    }

    checkState() {

        const head = this.worm.getHead();

        // left the play area or ate itself?
        if (this.isOutside(head) || this.worm.isWorm(head)) {
            // dead
            this.die();
            return;
        } 

        // got items?
        const items = this.map.getItemsAt(head);
        if(items != undefined && items.length > 0) {
            
            this.score += items.length * 100;
            
            // apply item effects
            items.forEach((item) => {
                switch(item.type) {
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
                }
                
            });
            
            this.map.removeItems(items);
            // all gone?
            if(!this.map.hasItems()) {
                this.levelUp();
            }
        }
    }
  
    levelUp() {
      this.score += 1000;
      this.level++;
      if(this.level < MAX_LEVEL) {
        this.speedUp();
        this.map.seed();
      } else {
        this.win();
      }
    }
  
    win() {
      alert("Congrats you beat the game!\r\nFinal Score: " + this.score);
      this.stop();       
    }
  
    die() {
      alert("You died.\r\nFinal Score: " + this.score);
      this.stop();
    }

    speedUp() {
        this.speed = Math.max(MINIMUM_SPEED, this.speed - SPEED_CHANGE);
    }

    slowDown() {
        this.speed = Math.min(INITIAL_SPEED, this.speed + SPEED_CHANGE);
    }

    isOutside(position:{x:number, y:number}) {
        return position.x < 0 || position.x >= this.width || position.y < 0 || position.y >= this.height;
    }
  
   onKeyDown(event:KeyboardEvent) {
       switch(event.key) {
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
           this.turbo=true;
           break;
       }
    }

    onKeyUp(event:KeyboardEvent) {
        switch(event.key) {
             case ' ': // spacebar
                this.turbo=false;
                break;
       }
    }
  
    onTouchStart(e:TouchEvent) {
        this.touch = e.changedTouches[0];
        e.preventDefault();
    }
  
    onTouchMove(e:TouchEvent){
        e.preventDefault();
    }
  
    onTouchEnd(e:TouchEvent){
      
        const touch = e.changedTouches[0]
        
        const distX = touch.pageX - this.touch.pageX;
        const distY = touch.pageY - this.touch.pageY;
        
        let direction = null;

        if (Math.abs(distX) >= 100){ 
          direction = (distX < 0)? 'Left' : 'Right';
        }
        else if (Math.abs(distY) >= 100){
          direction = (distY < 0)? 'Up' : 'Down';
        }
        
        if(direction) {
          this.worm.setDirection(direction as Direction);
        }
        
        e.preventDefault()
    }
}