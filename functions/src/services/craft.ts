import { CardHasher } from '@shardedcards/sc-types/node/card/services/card-hasher.js';
import { CardNameGenerator, CardName } from '@shardedcards/sc-types/node/card/services/card-name-generator.js';
import { CardInterface } from '@shardedcards/sc-types/node/card/card.interface.js';
import { Game } from '@shardedcards/sc-types/node/game/entities/game.js';
import { AddCraftedCardToDeckAction } from '@shardedcards/sc-types/node/turn/entities/turn-action/player-turn-actions/add-crafted-card-to-deck-action.js';
import { CardOrigin } from '@shardedcards/sc-types/node/card/entities/card-origin/card-origin.js';

const MAX_CARD_NAMES = 10;

export class CraftService {
  static async getPossibleCardNames(cardHash: string):Promise<CardName[]> {
    const card = CardHasher.getCard(cardHash);
    return [...CardNameGenerator.getRandomCardNames(card, MAX_CARD_NAMES)];
  }

  static isValidCardName(cardHash: string, cardName: CardName):boolean {
    const card = CardHasher.getCard(cardHash);
    return CardNameGenerator.isValidName(card, cardName);
  }

  static getCardInterface(cardHash: string, cardName: CardName):CardInterface {
    const card = CardHasher.getCard(cardHash);
    card.name = cardName.name;
    return card;
  }

  static canActuallyCreateCard(game: Game, cardHash: string, forgeSlotIndex: number, numberOfInstances: number) {
    const cardOrigin = new CardOrigin();
    cardOrigin.id = cardHash;
    cardOrigin.name = 'temp';
    const turnAction = new AddCraftedCardToDeckAction(
      forgeSlotIndex,
      numberOfInstances,
      cardOrigin,
    );
    try {
      turnAction.validate(game);
      return true;
    } catch {
      return false;
    }
  }
}