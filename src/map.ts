import Game from './game';

const COLORS = {
    GROW:'blue',
    SHRINK:'black',
    SPEED:'green',
    SLOW:'red'
};

type ItemType = 'GROW'|'SHRINK'|'SPEED'|'SLOW';

export class Item {
    
    x:number;
    y:number;
    type:ItemType;

    constructor(x:number, y:number, type:ItemType) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    compare(other:Item) {
        return this.x == other.x && this.y == other.y;
    }
}

const ITEMS_PER_LEVEL = 5;
const ITEMS_SIZE = 10;

export default class Map {

    private game: Game;
    private items: Item[];

    constructor(game: Game) {
        this.game = game;
        this.items = [];     
        this.seed(); 
    }
  
    seed() {
    
        const width= this.game.getWidth();
        const height = this.game.getHeight();
       
       const nbItems = ITEMS_PER_LEVEL * (this.game.getLevel() + 1) ;
       const widthWithPadding = width - 2 * ITEMS_SIZE;
       const heightWidthPadding = height - 2 * ITEMS_SIZE;

       for (let count = 0;  count < nbItems; count++) {

            // item position
            const x = ITEMS_SIZE + Math.floor(Math.random() * widthWithPadding);
            const y = ITEMS_SIZE + Math.floor(Math.random() * heightWidthPadding); 

            // item type            
            const roll = Math.random() * 100;
            const type:ItemType = roll < 70 ? 'GROW' : (roll < 80 ? 'SHRINK' : (roll < 95 ? 'SPEED' : 'SLOW'));

            this.items.push(new Item(x, y, type));
        }
    }

    draw(time:number, context:CanvasRenderingContext2D) {
        context.fillStyle = 'red';
        const betterItemSize = ITEMS_SIZE * 2/3;
        this.items.forEach((item) => {
            context.fillStyle = COLORS[item.type];
            context.fillRect(item.x - betterItemSize, item.y - betterItemSize, betterItemSize * 2, betterItemSize * 2)
        });
    }

    getItemsAt(point:{x:number,y:number}) {
        return this.items.filter(item => 
            point.x >= item.x - ITEMS_SIZE && 
            point.y >= item.y - ITEMS_SIZE && 
            point.x <= item.x + ITEMS_SIZE && 
            point.y <= item.y + ITEMS_SIZE
        );
    }
  
    removeItems(items:Item[]) {
        this.items = this.items.filter(item => !items.find(toRemove=> toRemove.compare(item)))
    }
  
    hasItems() {
      return this.items.length > 0;
    }
}