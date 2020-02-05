import { TurnActionBuilder } from '@shardedcards/sc-types/node/turn/services/builders/turn-action-builder.js';
import { PlayerTurn } from '@shardedcards/sc-types/node/turn/entities/turn/player-turn.js';
import { DungeonTurn } from '@shardedcards/sc-types/node/turn/entities/turn/dungeon-turn.js';
import { Game } from '@shardedcards/sc-types/node/game/entities/game.js';
import { AddCraftedCardToDeckAction } from '@shardedcards/sc-types/node/turn/entities/turn-action/player-turn-actions/add-crafted-card-to-deck-action.js';
import { CardOrigin } from '@shardedcards/sc-types/node/card/entities/card-origin/card-origin.js';

import { GameService } from './game';

export class TurnService {
  static async endPlayerTurn(gameId: string, turnActionsData: any[]):Game {
    const turnActions = TurnActionBuilder.buildTurnActions(turnActionsData);
    const game = await GameService.getGame(gameId);
    const playerTurnResult = PlayerTurn.execute(game, turnActions);
    await GameService.setGame(playerTurnResult.game);
    return playerTurnResult.game;
  }

  static async endPlayerCraftingTurn(gameId: string, turnActionsData: any[]):Game {
    const turnActions = TurnActionBuilder.buildTurnActions(turnActionsData);
    const game = await GameService.getGame(gameId);
    const playerTurnResult = PlayerTurn.execute(game, turnActions);
    const dungeonTurnResult = DungeonTurn.execute(playerTurnResult.game);
    await GameService.setGame(dungeonTurnResult.game);
    return dungeonTurnResult.game;
  }

  static async getGameFromTurnActions(gameId: string, turnActionsData: any[]):Game {
    const turnActions = TurnActionBuilder.buildTurnActions(turnActionsData);
    const game = await GameService.getGame(gameId);
    const playerTurnResult = PlayerTurn.executeTurnActions(game, turnActions);
    return playerTurnResult.game;
  }

  static async executeAddCraftedCardToDeckAction(game: Game, forgeSlotIndex: number, numberOfInstances: number, cardOrigin: CardOrigin):Game {
    const turnAction = new AddCraftedCardToDeckAction(
      forgeSlotIndex,
      numberOfInstances,
      cardOrigin,
    );
    const playerTurnResult = PlayerTurn.executeTurnActions(game, [turnAction]);
    await GameService.setGame(playerTurnResult.game);
    return playerTurnResult.game;
  }
}