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
          rarity: 'common'
        },
        'CD_IU1': {
          id: 'CD_IU1',
          name: 'Imp Underling',
          rarity: 'common'
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
