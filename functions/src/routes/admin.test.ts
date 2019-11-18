import * as admin from 'firebase-admin';
import sinon from 'sinon';
import firebaseFunctionsTest from 'firebase-functions-test';
// @NOTE: need to hit the actual index since admin.initializeApp() needs to be called.
import * as myFunctions from '../index';
import { firestoreDB } from '../services/firestore';
let adminInitStub, dbCollectionStub;


beforeEach(() => {
  adminInitStub = sinon.stub(admin, 'initializeApp');
  dbCollectionStub = sinon.stub(firestoreDB, 'collection');
});

afterEach(() => {
  dbCollectionStub.restore();
  adminInitStub.restore();
  firebaseFunctionsTest().cleanup();
});

describe('generateSeed', () => {
  test('no input', () => {
    dbCollectionStub.withArgs('dungeonconditions').returns({
      doc: (_) => { 
        return {
          get: () => {
            return new Promise((resolve) => {
              resolve(firebaseFunctionsTest().firestore.makeDocumentSnapshot({
                cards: {
                  'CD_1': { weight: 1 },
                  'CD_2': { weight: 2 },
                  'CD_3': { weight: 3 },
                },
                name: 'default test'
              }, 'dungeonconditions/test'));
            });
          }
        };
      }
    });
    const req = { headers: { origins: true }, body: { dungeonId: 'test' } };
    const res = {
      setHeader: () => {},
      getHeader: () => {},
      status: (code: number) => {
        expect(code).toEqual(200);
        return { json: (body: any) => {
          expect(body).toEqual({ data: { seed: 'TEST' }});
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
