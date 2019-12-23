import { Game } from '@shardedcards/sc-types/node/game/entities/game.js';
import { GameGenerator } from '@shardedcards/sc-types/node/game/services/game-generators/game-generator.js';
import { GameBuilder } from '@shardedcards/sc-types/node/game/services/builders/game-builder.js';
import { firestoreDB } from '../services/firestore';


export class GameService {
  static async newGame(playerId: string, playerDeckId: string, dungeonId: string):Game {
    const playerContext = await GameService.getPlayerContext(playerId, playerDeckId);
    const dungeonSeed = await GameService.getDungeonSeed(dungeonId);
    const tempGameId = 'TEMP';
    const game = GameGenerator.generateFromSeed(tempGameId, dungeonSeed, playerContext);
    await GameService.createGame(game);
    return game;
  }

  private static async getPlayerContext(playerId: string, playerDeckId: string):Promise<any> {
    const player = await firestoreDB.collection('players').doc(playerId).get();
    const playerData = player.data();
    const playerContext = {
      identity: {
        id: playerData.id,
        name: playerData.name
      },
      baseCards: []
    };
    const playerDeck = await firestoreDB.collection('players').doc(playerId).collection('dungeondecks').doc(playerDeckId).get();
    const playerDeckData = playerDeck.data();
    const baseCardIds = GameService.extractUniqueCardIds(playerDeckData.basecards);
    const baseCards = {};
    for (const baseCardId of baseCardIds) {
      const baseCard = await firestoreDB.collection('playerbasecards').doc(baseCardId).get();
      baseCards[baseCardId] = baseCard.data();
    }
    for (const baseCardId of playerDeckData.basecards) {
      playerContext.baseCards.push(baseCards[baseCardId]);
    }
    return playerContext;
  }

  private static extractUniqueCardIds(cardIds: string[]):string[] {
    const uniqueIds = new Set<string>();
    for (const cardId of cardIds) {
      uniqueIds.add(cardId);
    }
    return Array.from(uniqueIds);
  }

  private static async getDungeonSeed(dungeonId: string):Promise<any> {
    const dungeonTag = await firestoreDB.collection('dungeontags').doc(dungeonId).get();
    const dungeonSeedId = dungeonTag.data().alpha;
    const dungeonSeed = await firestoreDB.collection('dungeonseeds').doc(dungeonSeedId).get();
    return dungeonSeed.data();
  }

  private static async createGame(game: Game) {
    const gameRef = await firestoreDB.collection('dungeongames').add(game.json(true, false));
    game.id = gameRef.id;
    await firestoreDB.collection('dungeongames').doc(game.id).update({
      id: game.id
    });
  }

  static async getGame(gameId: string):Game {
    const gameData = await firestoreDB.collection('dungeongames').doc(gameId).get();
    return GameBuilder.buildGame(gameData.data());
  }

  static async setGame(game: Game) {
    await firestoreDB.collection('dungeongames').doc(game.id).set(game.json(true, false));
  }
}