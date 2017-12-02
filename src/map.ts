import { Item, ItemType, Point } from './defs';
import { Game } from './game';

const ITEM_COLORS: { [key: string]: string } = {
    GROW: 'blue',
    SHRINK: 'black',
    SPEED: 'green',
    SLOW: 'red',
};

const ITEMS_PER_LEVEL: number = 5;
const ITEMS_SIZE: number = 10;

export class Map {

    private game: Game;
    private items: Item[];

    constructor(game: Game) {
        this.game = game;
        this.items = [];
        this.seed();
    }

    public draw(time: number, context: CanvasRenderingContext2D): void {
        const betterItemSize: number = ITEMS_SIZE * 2 / 3;
        this.items.forEach((item: Item) => {
            context.fillStyle = ITEM_COLORS[item.getType()];
            context.fillRect(item.getX() - betterItemSize, item.getY() - betterItemSize, betterItemSize * 2, betterItemSize * 2);
        });
    }

    public getItemsAt(point: Point): Item[] {
        return this.items.filter((item: Item) => (
            point.x >= item.getX() - ITEMS_SIZE &&
            point.y >= item.getY() - ITEMS_SIZE &&
            point.x <= item.getX() + ITEMS_SIZE &&
            point.y <= item.getY() + ITEMS_SIZE
        ));
    }

    public removeItems(items: Item[]): void {
        this.items = this.items.filter((item: Item) => !items.find((toRemove: Item) => toRemove.compare(item)));
    }

    public hasItems(): boolean {
        return this.items.length > 0;
    }

    public seed(): void {

        const width: number = this.game.getWidth();
        const height: number = this.game.getHeight();

        const nbItems: number = ITEMS_PER_LEVEL * (this.game.getLevel() + 1);
        const widthWithPadding: number = width - 2 * ITEMS_SIZE;
        const heightWidthPadding: number = height - 2 * ITEMS_SIZE;

        // reset items
        this.items = [];

        for (let count: number = 0; count < nbItems; count++) {

            // item position
            const x: number = ITEMS_SIZE + Math.floor(Math.random() * widthWithPadding);
            const y: number = ITEMS_SIZE + Math.floor(Math.random() * heightWidthPadding);

            // item type
            const roll: number = Math.random() * 100;
            const type: ItemType = roll < 70 ? 'GROW' : (roll < 80 ? 'SHRINK' : (roll < 95 ? 'SPEED' : 'SLOW'));

            this.items.push(new Item(x, y, type));
        }
    }
}
