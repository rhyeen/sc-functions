import * as admin from 'firebase-admin';
import sinon from 'sinon';
import firebaseFunctionsTest from 'firebase-functions-test';
// @NOTE: need to hit the actual index since admin.initializeApp() needs to be called.
import * as myFunctions from '../index';
import { firestoreDB } from '../services/firestore';
let adminInitStub, dbCollectionStub, docsStub, addStub;


beforeEach(() => {
  adminInitStub = sinon.stub(admin, 'initializeApp');
  dbCollectionStub = sinon.stub(firestoreDB, 'collection');
  docsStub = sinon.stub();
  addStub= sinon.stub();
});

afterEach(() => {
  dbCollectionStub.restore();
  adminInitStub.restore();
  firebaseFunctionsTest().cleanup();
});

function firestoreGetStub(collection: string, doc: string, getSnapshotData:any):void {
  dbCollectionStub.withArgs(collection).returns({
    doc: docsStub
  });
  const snapshot = firebaseFunctionsTest().firestore.makeDocumentSnapshot(getSnapshotData, `${collection}/${doc}`);
  docsStub.withArgs(doc).returns({
    get: () => new Promise((resolve) => resolve(snapshot))
  });
}

function firestoreAddStub(collection: string, data:any, refId:string):void {
  dbCollectionStub.withArgs(collection).returns({
    add: addStub
  });
  addStub.withArgs(data).returns({
    id: refId
  });
}

describe('generateSeed', () => {
  test('no input', () => {
    const dungeonCondition = {
      cards: {
        'CD_1': { weight: 1 },
        'CD_2': { weight: 2 },
        'CD_3': { weight: 3 },
      },
      name: 'default test'
    };
    firestoreGetStub('dungeonconditions', 'test', dungeonCondition);
    const cards = [
      {
        id: 'CD_1',
        name: 'test card 1'
      },
      {
        id: 'CD_2',
        name: 'test card 2'
      },
      {
        id: 'CD_3',
        name: 'test card 3'
      }
    ];
    for (const card of cards) {
      firestoreGetStub('dungeoncards', card.id, card);
    }
    firestoreAddStub('dungeonseeds', {
      ...dungeonCondition,
      dungeoncards: [...cards]
    }, '123');
    const req = { headers: { origins: true }, body: { dungeonId: 'test' } };
    const res = {
      setHeader: () => {},
      getHeader: () => {},
      status: (code: number) => {
        expect(code).toEqual(200);
        return { json: (body: any) => {
          expect(body).toEqual({ data: { seed: '123' }});
        }};
      }
    };
    myFunctions.generateSeed(req as any, res as any);
  });
});

describe('updateTags', () => {
  test('no input', () => {
    const req = { headers: { origins: true } };
    const res = {
      setHeader: () => {},
      getHeader: () => {},
      status: (code: number) => {
        expect(code).toEqual(200);
        return { json: (body: any) => {
          expect(body).toEqual({ data: { ok: true }});
        }};
      }
    };
    myFunctions.updateTags(req as any, res as any);
  });
});
