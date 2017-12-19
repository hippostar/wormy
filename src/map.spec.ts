import { instance, mock } from 'ts-mockito';
import { Game } from './game';
import { ITEMS_PER_LEVEL, Map } from './map';

test('it can be instanciated', () => {

    const gameMock: Game = mock(Game);
    const map: Map = new Map(instance(gameMock));

    expect(map).not.toBeNull();
});

test('it will generate items', () => {

    const gameMock: Game = mock(Game);
    const map: Map = new Map(instance(gameMock));

    expect(map.hasItems()).toBe(true);
    expect(map.getItems()).toHaveLength(ITEMS_PER_LEVEL);
});
