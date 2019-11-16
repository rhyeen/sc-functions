import { Game } from '@shardedcards/sc-types/node/game/entities/game.js';
import { Player } from '@shardedcards/sc-types/node/game/entities/player/player.js';
import { Dungeon } from '@shardedcards/sc-types/node/game/entities/dungeon.js';
import { DungeonFieldSlot } from '@shardedcards/sc-types/node/game/entities/field-slot.js';
import { CardSetGenerator } from './generators/card-set-generator';

export class GameService {
  static newGame():Game {
    const cardSets = CardSetGenerator.generateDefaultCardSets();
    const player = new Player(20, 10, 5);
    const dungeonFieldSlots = [
      new DungeonFieldSlot(),
      new DungeonFieldSlot(),
      new DungeonFieldSlot(),
    ];
    const dungeon = new Dungeon(dungeonFieldSlots);
    return new Game('GM_1', player, dungeon, cardSets);
  }
}