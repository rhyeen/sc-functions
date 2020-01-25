import { CardOrigin } from '@shardedcards/sc-types/node/card/entities/card-origin/card-origin.js';
import { CardOriginBuilder } from '@shardedcards/sc-types/node/card/services/builders/card-origin-builder.js';
import { CardInterface } from '@shardedcards/sc-types/node/card/card.interface.js';
import { firestoreDB } from '../services/firestore';

export class CardService {
  static async getCardOrigin(cardHash: string):CardOrigin {
    const cardOrigin = await firestoreDB.collection('cardorigins').doc(cardHash).get();
    if (!cardOrigin.exists) {
      return null;
    }
    return CardOriginBuilder.buildCardOrigin(cardOrigin.data());
  }

  static async createCardOrigin(card: CardInterface, playerId: string, gameId: string):CardOrigin {
    // @NOTE: although we check that a CardOrigin doesn't already exist, there
    // is still a chance of a race condition in which a second call can overwrite
    // the creation of the first call.  This isn't a problem though since it won't
    // impact either players' game.  It'll just be that the second player is counted
    // as the original owner, even if the first player appeared to create a new card.

    // Later on, we could check at the end of the game if this "pending" card creation
    // was finalized.  If not, we can in the end game report notify the first player
    // that their card was replaced by a different creator, then potentially compensating
    // them?  Or something?!?
    let cardOrigin = await CardService.getCardOrigin(card.hash);
    if (cardOrigin) {
      return cardOrigin;
    }
    cardOrigin = new CardOrigin();
    cardOrigin.id = card.hash;
    cardOrigin.name = card.name;
    cardOrigin.createdAt = new Date();
    cardOrigin.updatedAt = new Date();
    cardOrigin.original = {
      playerId,
      gameId,
    };
    await firestoreDB.collection('cardorigins').doc(cardOrigin.id).set(cardOrigin.json());
    return cardOrigin;
  }
}