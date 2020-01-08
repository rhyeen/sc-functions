import { CardOrigin } from '@shardedcards/sc-types/node/card/entities/card-origin/card-origin.js';
import { CardOriginBuilder } from '@shardedcards/sc-types/node/card/services/builders/card-origin-builder.js';
import { firestoreDB } from '../services/firestore';

export class CardService {
  static async getCardOrigin(cardHash: string):CardOrigin {
    const cardOrigin = await firestoreDB.collection('cardorigins').doc(cardHash).get();
    if (!cardOrigin.exists) {
      return null;
    }
    return CardOriginBuilder.buildCardOrigin(cardOrigin.data());
  }
}