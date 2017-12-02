export type Point = { x: number; y: number; };

export type Direction = 'Up' | 'Right' | 'Left' | 'Down';

export type ItemType = 'GROW' | 'SHRINK' | 'SPEED' | 'SLOW';

export class Item {

    private x: number;
    private y: number;
    private type: ItemType;

    constructor(x: number, y: number, type: ItemType) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    public compare(other: Item): boolean {
        return this.x === other.x && this.y === other.y;
    }

    public getX(): number { return this.x; }
    public getY(): number { return this.y; }
    public getType(): ItemType { return this.type; }
}
