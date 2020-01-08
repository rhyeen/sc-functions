import { CardHasher } from '@shardedcards/sc-types/node/card/services/card-hasher.js';
import { CardNameGenerator } from '@shardedcards/sc-types/node/card/services/card-name-generator.js';

const MAX_CARD_NAMES = 10;

export class CraftService {
  static async getPossibleCardNames(cardHash: string):Promise<string[]> {
    const card = CardHasher.getCard(cardHash);
    return [...CardNameGenerator.getRandomCardNames(card, MAX_CARD_NAMES)];
  }
}