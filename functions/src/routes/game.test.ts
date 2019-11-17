import admin from 'firebase-admin';
import sinon from 'sinon';
import firebaseFunctionsTest from 'firebase-functions-test';
// @NOTE: need to hit the actual index since admin.initializeApp() needs to be called.
import * as myFunctions from '../index';
let adminInitStub;

beforeEach(() => {
  adminInitStub = sinon.stub(admin, 'initializeApp');
});

afterEach(() => {
  adminInitStub.restore();
  firebaseFunctionsTest().cleanup();
});

describe('newGame', () => {
  test('no input', () => {
    const req = { headers: { origins: true } };
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
