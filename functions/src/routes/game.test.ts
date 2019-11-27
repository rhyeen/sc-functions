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
  firestoreStub.dbCollectionStub.restore();
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
  test('happy path', () => {
    const playerData = {
      id: 'US_1',
      name: 'rhyeen'
    };
    firestoreStub.get('players', 'US_1', playerData);
    const dungeonDeckData = {
      basecards: ['CP_EN1', 'CP_WS1', 'CP_WS1', 'CP_WS1', 'CP_WS1', 'CP_WS1', 'CP_WS1', 'CP_WS1', 'CP_WS1', 'CP_WS1']
    };
    firestoreStub.get('dungeondecks', 'DD_1', dungeonDeckData);
    const cards = {
      'CP_EN1': {
        id: 'CP_EN1',
        name: 'Energize'
      },
      'CP_WS1': {
        id: 'CP_WS1',
        name: 'Common Wisp'
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
      fields: [ getFieldData(), getFieldData(), getFieldData() ],
      initial: { player: { energy: 10, handRefillSize: 5, health: 20 }},
      name: 'Default Delve',
      dungeoncards: {
        'CD_GP1': {
          id: 'CD_GP1',
          name: 'Goblin Peon'
        },
        'CD_IU1': {
          id: 'CD_IU1',
          name: 'Imp Underling'
        }
      }
    };
    firestoreStub.get('dungeonseeds', 'test', dungeonSeedData);
    firestoreStub.add('dungeongames', {
      id: 'TEMP',
    }, '123');
    firestoreStub.update('dungeongames', '123', {
      id: '123',
    }, '123');
    const body = {
      playerId: 'US_1',
      playerDeckId: 'DD_1',
      dungeonId: 'test'
    };
    const req = { headers: { origins: true }, body };
    const res = {
      setHeader: () => {},
      getHeader: () => {},
      status: (code: number) => {
        expect(code).toEqual(200);
        return { json: (body: any) => {
          expect(body.data.game.cardSets['MC143']).toEqual({ 
            baseCard: { attack: 4, hash: 'MC143', health: 1, id: 'CD_THORN_SPITTER_VINE', level: 2, name: 'Thorn Spitter Vine', range: 3, rarity: 'common', type: 'minion' },
            instances: [ { id: 'MC143_0' }] 
          });
        }};
      }
    };
    myFunctions.newGame(req as any, res as any);
  });
});
