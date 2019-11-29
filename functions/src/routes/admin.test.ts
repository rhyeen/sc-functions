import * as admin from 'firebase-admin';
import sinon from 'sinon';
import firebaseFunctionsTest from 'firebase-functions-test';
// @NOTE: need to hit the actual index since admin.initializeApp() needs to be called.
import * as myFunctions from '../index';
import { FirestoreStub } from '../test/stubs';

let adminInitStub, firestoreStub;


beforeEach(() => {
  adminInitStub = sinon.stub(admin, 'initializeApp');
  firestoreStub = new FirestoreStub(firebaseFunctionsTest);
  firestoreStub.get('admintokens', 'IS_ADMIN', {
    void: false
  });
});

afterEach(() => {
  firestoreStub.dbCollectionStub.restore();
  adminInitStub.restore();
  firebaseFunctionsTest().cleanup();
});

describe('generateSeed', () => {
  test('no input', done => {
    const dungeonCondition = {
      cards: {
        'CD_1': { weight: 1 },
        'CD_2': { weight: 2 },
        'CD_3': { weight: 3 },
      },
      name: 'default test'
    };
    firestoreStub.get('dungeonconditions', 'test', dungeonCondition);
    const cards = {
      'CD_1': {
        id: 'CD_1',
        name: 'test card 1'
      },
      'CD_2': {
        id: 'CD_2',
        name: 'test card 2'
      },
      'CD_3': {
        id: 'CD_3',
        name: 'test card 3'
      }
    }
    for (const cardId in cards) {
      firestoreStub.get('dungeoncards', cardId, cards[cardId]);
    }
    firestoreStub.add('dungeonseeds', {
      ...dungeonCondition,
      dungeoncards: { ...cards }
    }, '123');
    const body = { 
      data: {
        body: {
          dungeonId: 'test'
        },
        adminToken: 'IS_ADMIN'
      },
    };
    expect.assertions(2);
    const req = { headers: { origins: true }, body };
    const res = {
      setHeader: () => {},
      getHeader: () => {},
      status: (code: number) => {
        expect(code).toEqual(200);
        return { json: (body: any) => {
          expect(body).toEqual({ data: { seed: '123' }});
          done();
        }};
      }
    };
    myFunctions.generateSeed(req as any, res as any);
  });
});

describe('updateTags', () => {
  test('alter all but dev', done => {
    firestoreStub.update('dungeontags', 'test', {
      alpha: '123',
      beta: '123',
      stable: '123',
      history: admin.firestore.FieldValue.arrayUnion('123')
    });
    const body = { 
      data: {
        body: {
          dungeonId: 'test',
          dungeonSeed: '123',
          tags: ['stabe', 'alpha', 'beta']
        },
        adminToken: 'IS_ADMIN'
      },
    };
    expect.assertions(2);
    const req = { headers: { origins: true }, body };
    const res = {
      setHeader: () => {},
      getHeader: () => {},
      status: (code: number) => {
        expect(code).toEqual(200);
        return { json: (body: any) => {
          expect(body).toEqual({ data: { ok: true }});
          done();
        }};
      }
    };
    myFunctions.updateTags(req as any, res as any);
  });
});