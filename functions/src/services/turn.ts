import { TurnActionBuilder } from '@shardedcards/sc-types/node/turn/services/builders/turn-action-builder.js';
import { PlayerTurn } from '@shardedcards/sc-types/node/turn/entities/turn/player-turn.js';
import { DungeonTurn } from '@shardedcards/sc-types/node/turn/entities/turn/dungeon-turn.js';
import { GameService } from './game';


export class TurnService {
  static async endPlayerTurn(gameId: string, turnActionsData: any[]) {
    const turnActions = TurnActionBuilder.buildTurnActions(turnActionsData);
    const game = await GameService.getGame(gameId);
    const playerTurnResult = PlayerTurn.execute(game, turnActions);
    const dungeonTurnResult = DungeonTurn.execute(playerTurnResult.game);
    await GameService.setGame(dungeonTurnResult.game);
    return dungeonTurnResult.game;
  }
}