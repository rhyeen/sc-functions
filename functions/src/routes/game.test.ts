import admin from 'firebase-admin';
import sinon from 'sinon';
import firebaseFunctionsTest from 'firebase-functions-test';
// @NOTE: need to hit the actual index since admin.initializeApp() needs to be called.
import * as myFunctions from '../index';
import { FirestoreStub } from '../test/stubs';

let adminInitStub, firestoreStub;

beforeEach(() => {
  adminInitStub = sinon.stub(admin, 'initializeApp');
  firestoreStub = new FirestoreStub(firebaseFunctionsTest);
});

afterEach(() => {
  firestoreStub.restore();
  adminInitStub.restore();
  firebaseFunctionsTest().cleanup();
});

function getFieldData() {
  return {
    backlogPartitions: {
      common: { size: 7 },
      rare: { size: 5 },
      epic: { size: 3 },
      legendary: { size: 1 },
    },
    levelIncreaseChance: 0
  }
}

describe('newGame', () => {
  test('happy path', done => {
    const playerData = {
      id: 'US_1',
      name: 'rhyeen'
    };
    firestoreStub.get('players', 'US_1', playerData);
    const dungeonDeckData = {
      basecards: ['CP_EN1', 'CP_WS1', 'CP_WS1', 'CP_WS1', 'CP_WS1', 'CP_WS1', 'CP_WS1', 'CP_WS1', 'CP_WS1', 'CP_WS1']
    };
    firestoreStub.stubSubCollection('players', 'US_1');
    firestoreStub.get('dungeondecks', 'DD_1', dungeonDeckData);
    const cards = {
      'CP_EN1': {
        id: 'CP_EN1',
        name: 'Energize',
        rarity: 'standard',
        type: 'spell',
        abilities: [{ id: 'energize', amount: 1 }]
      },
      'CP_WS1': {
        id: 'CP_WS1',
        name: 'Common Wisp',
        rarity: 'standard',
        type: 'minion',
        attack: 1,
        range: 2,
        health: 3
      },
    }
    for (const cardId in cards) {
      firestoreStub.get('playerbasecards', cardId, cards[cardId]);
    }
    const dungeonTagData = {
      alpha: '1234'
    };
    firestoreStub.get('dungeontags', 'test', dungeonTagData);
    const dungeonSeedData = {
      field: [ getFieldData(), getFieldData(), getFieldData() ],
      initial: { player: { energy: 10, handRefillSize: 5, health: 20 }},
      name: 'Default Delve',
      dungeoncards: {
        'CD_GP1': {
          id: 'CD_GP1',
          name: 'Goblin Peon',
          rarity: 'common',
          attack: 1,
          health: 2,
          range: 1
        },
        'CD_IU1': {
          id: 'CD_IU1',
          name: 'Imp Underling',
          rarity: 'common',
          attack: 1,
          health: 3,
          range: 1
        }
      }
    };
    firestoreStub.get('dungeonseeds', '1234', dungeonSeedData);
    firestoreStub.add('dungeongames', sinon.match.any, '123');
    firestoreStub.update('dungeongames', '123', {
      id: '123',
    }, '123');
    const body = {
      data: {
        playerId: 'US_1',
        playerDeckId: 'DD_1',
        dungeonId: 'test'
      }
    };
    expect.assertions(5);
    const req = { headers: { origins: true }, body };
    const res = {
      setHeader: () => {},
      getHeader: () => {},
      status: (code: number) => {
        expect(code).toEqual(200);
        return { json: (body: any) => {
          expect(body.data.game.cardSets["MS312"].baseCard.name).toEqual("Common Wisp");
          expect(body.data.game.cardSets["MS312"].instances.length).toEqual(9);
          expect(body.data.game.cardSets["SS000|A;EN1"].baseCard.name).toEqual("Energize");
          expect(body.data.game.cardSets["SS000|A;EN1"].instances.length).toEqual(1);
          done();
        }};
      }
    };
    myFunctions.newGame(req as any, res as any);
  });
});

describe('endTurn', () => {
  test('happy path', done => {
    const gameData = {
      "cardSets": {
        "CD_GP1": {
          "baseCard": {
            "abilities": [],
            "attack": 1,
            "cost": 0,
            "hash": "CD_GP1",
            "health": 3,
            "id": "CD_GP1",
            "level": 1,
            "name": "Goblin Peon",
            "range": 1,
            "rarity": "common",
            "type": "minion"
          },
          "instances": [
            {
              "id": "CR_ZrVKxYUTDuPG"
            },
            {
              "id": "CR_Y9xfiyb6vbNs"
            },
            {
              "id": "CR_sh9ln6C1wEmy"
            },
            {
              "id": "CR_l97Qz1RC9Jhx"
            },
            {
              "id": "CR_oT7vjEW9sNbR"
            },
            {
              "id": "CR_oPs8Rskqi8s0"
            },
            {
              "id": "CR_blHi94Xk6ell"
            },
            {
              "id": "CR_Z0PXo90b1reG"
            },
            {
              "id": "CR_WNmfo6jKA09f"
            },
            {
              "id": "CR_ZYg46BxXxC4c"
            },
            {
              "id": "CR_eF56EiVmqKWY"
            },
            {
              "id": "CR_kZP1izjp0bW2"
            },
            {
              "id": "CR_CesiPcx4mO1h"
            }
          ]
        },
        "CD_IU1": {
          "baseCard": {
            "abilities": [],
            "attack": 3,
            "cost": 0,
            "hash": "CD_IU1",
            "health": 1,
            "id": "CD_IU1",
            "level": 1,
            "name": "Imp Underling",
            "range": 1,
            "rarity": "common",
            "type": "minion"
          },
          "instances": [
            {
              "id": "CR_yBHhJvP4JKKV"
            },
            {
              "id": "CR_Q55HRZg8zc1A"
            },
            {
              "id": "CR_J0GjEo32lc18"
            },
            {
              "id": "CR_fEANsp6s1oI8"
            },
            {
              "id": "CR_g4H6s4KaqntE"
            },
            {
              "id": "CR_cCGibAI8gu5A"
            },
            {
              "id": "CR_kVzwoZ3BlQZG"
            },
            {
              "id": "CR_NQQaaZlAz0uc"
            }
          ]
        },
        "MS312": {
          "baseCard": {
            "abilities": [
              {
                "id": "haste"
              }
            ],
            "attack": 1,
            "cost": 1,
            "hash": "MS312",
            "health": 3,
            "id": "CP_WS1",
            "name": "Common Wisp",
            "range": 2,
            "rarity": "standard",
            "type": "minion"
          },
          "instances": [
            {
              "id": "CR_aImCUD9B7Dpl"
            },
            {
              "id": "CR_Ink07emK7cJ6"
            },
            {
              "id": "CR_1IYYLclv3qL9"
            },
            {
              "id": "CR_J0hZOBxtBEal"
            },
            {
              "id": "CR_sIJXsTIMXxJl"
            },
            {
              "id": "CR_eLtN4CyI0sPX"
            },
            {
              "id": "CR_76TDjnCRYfrO"
            },
            {
              "id": "CR_jdcKUEgDTo0l"
            },
            {
              "id": "CR_DSb85MWnvK8p"
            }
          ]
        },
        "SS000|A;EN1": {
          "baseCard": {
            "abilities": [
              {
                "amount": 1,
                "id": "energize",
                "tier": "godly"
              }
            ],
            "cost": 0,
            "hash": "SS000|A;EN1",
            "id": "CP_EN1",
            "name": "Energize",
            "rarity": "standard",
            "type": "spell"
          },
          "instances": [
            {
              "id": "CR_XyHDwmC6Qlbp"
            }
          ]
        }
      },
      "dungeon": {
        "field": [
          {
            "backlog": {
              "size": 0
            },
            "card": {
              "hash": "CD_GP1",
              "id": "CR_ZrVKxYUTDuPG"
            }
          },
          {
            "backlog": {
              "size": 0
            },
            "card": {
              "hash": "CD_IU1",
              "id": "CR_fEANsp6s1oI8"
            }
          },
          {
            "backlog": {
              "size": 0
            },
            "card": {
              "hash": "CD_GP1",
              "id": "CR_ZYg46BxXxC4c"
            }
          }
        ]
      },
      "id": "sfqABiRkytj6yY4QigBI",
      "player": {
        "discardDeck": {
          "cards": []
        },
        "drawDeck": {
          "size": 0
        },
        "energy": {
          "current": 10,
          "max": 10
        },
        "field": [
          {
            "card": null
          },
          {
            "card": null
          },
          {
            "card": null
          }
        ],
        "hand": {
          "cards": [
            {
              "hash": "SS000|A;EN1",
              "id": "CR_XyHDwmC6Qlbp"
            },
            {
              "hash": "MS312",
              "id": "CR_DSb85MWnvK8p"
            },
            {
              "hash": "MS312",
              "id": "CR_1IYYLclv3qL9"
            },
            {
              "hash": "MS312",
              "id": "CR_sIJXsTIMXxJl"
            },
            {
              "hash": "MS312",
              "id": "CR_jdcKUEgDTo0l"
            }
          ],
          "refillSize": 5
        },
        "health": {
          "current": 20,
          "max": 20
        },
        "id": "US_1",
        "lostDeck": {
          "cards": []
        },
        "name": "rhyeen"
      }
    };
    firestoreStub.get('dungeongames', 'sfqABiRkytj6yY4QigBI', gameData);
    // @DEBUG: doesn't actually seem to check the input...
    firestoreStub.set('dungeongames', 'sfqABiRkytj6yY4QigBI', {});
    const body = {
      data: {
        gameId: 'sfqABiRkytj6yY4QigBI',
        turn: [
          {"type":"placeMinion","source":{"handIndex":1},"target":{"fieldIndex":1}},
          {"type":"playMinionAttack","source":{"fieldIndex":1},"targets":[{"type":"targetOpponentMinion","fieldIndex":1}]}
        ]
      }
    };
    expect.assertions(2);
    const req = { headers: { origins: true }, body };
    const res = {
      setHeader: () => {},
      getHeader: () => {},
      status: (code: number) => {
        expect(code).toEqual(200);
        return { json: (body: any) => {
          expect(body.data.test).toEqual("hello world");
          done();
        }};
      }
    };
    myFunctions.endTurn(req as any, res as any);
  });
});
