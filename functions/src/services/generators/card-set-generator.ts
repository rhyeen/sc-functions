import { CardSet } from '@shardedcards/sc-types/node/card/entities/card-set.js';
import { CardBuilder } from '@shardedcards/sc-types/node/card/services/card-builder.js';
import { CardType } from '@shardedcards/sc-types/node/card/enums/card-type.js';
import { CardRarity } from '@shardedcards/sc-types/node/card/enums/card-rarity.js';
import { 
  CardAbilitySpellshot,
  CardAbilityReach,
  CardAbilityHaste,
  CardAbilityEnergize 
} from '@shardedcards/sc-types/node/card/entities/card-ability.js';

export class CardSetGenerator {
  static generateDefaultCardSets():Record<string,CardSet> {
    return { ...CardSetGenerator.generateDefaultPlayerCardSets(), ...CardSetGenerator.generateDefaultDungeonCardSets()};
  }

  static generateDefaultPlayerCardSets():Record<string,CardSet> {
    const cardSets = {};
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBaseFrontlineRavager(), 2));
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBaseIncinerate(), 3));
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBaseRangedWeapon(), 2));
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBasePawn(), 2));
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBaseEnergyShard(), 1));
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
    const cardSets = {};
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBaseGoblinPeon(), 1));
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBaseImpUnderling(), 1));
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBaseHobGoblinRaiders(), 1));
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBaseBanditRecruit(), 1));
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBaseThornSpitterVine(), 1));
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBaseRockGolem(), 1));
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBaseGoblinHerder(), 1));
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBaseAssassinSpirit(), 1));
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBaseDemonSprite(), 1));
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBaseDireDragonWrymling(), 1));
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBaseTrollHunter(), 1));
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBaseShadowDrake(), 1));
    CardSetGenerator.add(cardSets, CardSetGenerator.addInstances(getBaseStormMaster(), 1));
    return cardSets;
  }
}

function getBaseFrontlineRavager():CardSet {
  return new CardSet({
    name: 'Frontline Ravager',
    id: 'CD_RAVAGER',
    type: CardType.Minion,
    rarity: CardRarity.Common,
    attack: 1,
    health: 5,
    range: 1,
    abilities: [new CardAbilityHaste()]
  });
}

function getBaseIncinerate():CardSet {
  return new CardSet({
    name: 'Incinerate',
    id: 'CD_INCINERATE',
    type: CardType.Spell,
    rarity: CardRarity.Rare,
    abilities: [new CardAbilitySpellshot(4)]
  });
}

function getBaseRangedWeapon():CardSet {
  return new CardSet({
    name: 'Ranged Weapon',
    id: 'CD_RANGED_WEAPON',
    type: CardType.Spell,
    rarity: CardRarity.Epic,
    abilities: [new CardAbilityReach(1)]
  });
}

function getBasePawn():CardSet {
  return new CardSet({
    name: 'Pawn',
    id: 'CD_PAWN',
    type: CardType.Minion,
    rarity: CardRarity.Legendary,
    attack: 4,
    health: 1,
    range: 2
  });
}

function getBaseEnergyShard():CardSet {
  return new CardSet({
    name: 'Energy Shard',
    id: 'CD_ENERGY_SHARD',
    type: CardType.Spell,
    rarity: CardRarity.Epic,
    abilities: [new CardAbilityEnergize(1)]
  });
}

function getBaseGoblinPeon():CardSet {
  return new CardSet({
    id: `CD_GOBLIN_PEON`,
    name: 'Goblin Peon',
    type: CardType.Minion,
    rarity: CardRarity.Common,
    level: 0,
    range: 1,
    health: 5,
    attack: 1
  });
}

function getBaseImpUnderling():CardSet {
  return new CardSet({
    id: `CD_IMP_UNDERLING`,
    name: 'Imp Underling',
    type: CardType.Minion,
    rarity: CardRarity.Common,
    level: 1,
    range: 2,
    health: 2,
    attack: 2
  });
}

function getBaseHobGoblinRaiders():CardSet {
  return new CardSet({
    id: `CD_HOBGOBLIN_RAIDERS`,
    name: 'Hob Goblin Raiders',
    type: CardType.Minion,
    rarity: CardRarity.Common,
    level: 2,
    range: 1,
    health: 5,
    attack: 3
  });
}

function getBaseBanditRecruit():CardSet {
  return new CardSet({
    id: `CD_BANDIT_RECRUIT`,
    name: 'Bandit Recruit',
    type: CardType.Minion,
    rarity: CardRarity.Common,
    level: 1,
    range: 1,
    health: 7,
    attack: 1
  });
}

function getBaseThornSpitterVine():CardSet {
  return new CardSet({
    id: `CD_THORN_SPITTER_VINE`,
    name: 'Thorn Spitter Vine',
    type: CardType.Minion,
    rarity: CardRarity.Common,
    level: 2,
    range: 3,
    health: 1,
    attack: 4
  });
}

function getBaseRockGolem():CardSet {
  return new CardSet({
    id: `CD_ROCK_GOLEM`,
    name: 'Rock Golem',
    type: CardType.Minion,
    rarity: CardRarity.Rare,
    level: 3,
    range: 1,
    health: 15,
    attack: 2
  });
}

function getBaseGoblinHerder():CardSet {
  return new CardSet({
    id: `CD_GOBLIN_HERDER`,
    name: 'Goblin Herder',
    type: CardType.Minion,
    rarity: CardRarity.Rare,
    level: 3,
    range: 2,
    health: 7,
    attack: 3
  });
}

function getBaseAssassinSpirit():CardSet {
  return new CardSet({
    id: `CD_ASSASSIN_SPIRIT`,
    name: 'Assassin Spirit',
    type: CardType.Minion,
    rarity: CardRarity.Rare,
    level: 4,
    range: 3,
    health: 4,
    attack: 10
  });
}

function getBaseDemonSprite():CardSet {
  return new CardSet({
    id: `CD_DEMON_SPRITE`,
    name: 'Demon Sprite',
    type: CardType.Minion,
    rarity: CardRarity.Rare,
    level: 5,
    range: 3,
    health: 10,
    attack: 3
  });
}

function getBaseDireDragonWrymling():CardSet {
  return new CardSet({
    id: `CD_DIRE_DRAGON_WYRMLING`,
    name: 'Dire Dragon Wyrmling',
    type: CardType.Minion,
    rarity: CardRarity.Epic,
    level: 6,
    range: 3,
    health: 15,
    attack: 5
  });
}

function getBaseTrollHunter():CardSet {
  return new CardSet({
    id: `CD_TROLL_HUNTER`,
    name: 'Troll Hunter',
    type: CardType.Minion,
    rarity: CardRarity.Epic,
    level: 6,
    range: 1,
    health: 20,
    attack: 5
  });
}


function getBaseShadowDrake():CardSet {
  return new CardSet({
    id: `CD_SHADOW_DRAKE`,
    name: 'Shadow Drake',
    type: CardType.Minion,
    rarity: CardRarity.Legendary,
    level: 8,
    range: 3,
    health: 35,
    attack: 10
  });
}

function getBaseStormMaster():CardSet {
  return new CardSet({
    id: `CD_STORM_MASTER`,
    name: 'Storm Master',
    type: CardType.Minion,
    rarity: CardRarity.Legendary,
    level: 8,
    range: 2,
    health: 25,
    attack: 13
  });
}
