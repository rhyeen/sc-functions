import { CardSet } from '@shardedcards/sc-types/node/card/entities/card-set.js';
import { CardBuilder } from '@shardedcards/sc-types/node/card/services/card-builder.js';
import { CardType } from '@shardedcards/sc-types/node/card/enums/card-type.js';
import { CardRarity } from '@shardedcards/sc-types/node/card/enums/card-rarity.js';

export class CardSetGenerator {
  static generateDefaultCardSets():Record<string,CardSet> {
    return { ...CardSetGenerator.generateDefaultPlayerCardSets(), ...CardSetGenerator.generateDefaultDungeonCardSets()};
  }

  static generateDefaultPlayerCardSets():Record<string,CardSet> {
    const cardSets = {};
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getSetFrontlineRavager(), 5));
    return cardSets;
  }

  // @MUTATES: cardSets
  private static add(cardSets: Record<string,CardSet>, cardSet: CardSet):Record<string,CardSet> {
    const _cardSets = cardSets;
    _cardSets[cardSet.baseCard.hash] = cardSet;
    return _cardSets;
  }

  // @MUTATES: cardSet
  private static addInstances(cardSet: CardSet, instances: number):CardSet {
    const _cardSet = cardSet;
    for (let i = 0; i < instances; i++) {
      _cardSet.setInstance(CardBuilder.getTypedCard(_cardSet.baseCard, `${cardSet.baseCard.hash}_${i}`));
    }
    return _cardSet;
  }

  static generateDefaultDungeonCardSets():Record<string,CardSet> {
    return {};
  }
}

function getSetFrontlineRavager():CardSet {
  return new CardSet({
    name: 'Frontline Ravager',
    id: 'CD_RAVAGER',
    type: CardType.Minion,
    rarity: CardRarity.Common,
    attack: 1,
    health: 5,
    range: 1
  });
}
