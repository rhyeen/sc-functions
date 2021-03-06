import admin from 'firebase-admin';
import sinon from 'sinon';
import firebaseFunctionsTest from 'firebase-functions-test';
import * as myFunctions from './index';
let adminInitStub;

beforeEach(() => {
  adminInitStub = sinon.stub(admin, 'initializeApp');
});

afterEach(() => {
  adminInitStub.restore();
  firebaseFunctionsTest().cleanup();
});

describe('helloWorld', () => {
  test('no input', () => {
    const req = { headers: { origins: true } };
    const res = {
      setHeader: () => {},
      getHeader: () => {},
      status: (code: number) => {
        expect(code).toEqual(200);
        return { json: (body: any) => {
          expect(body).toEqual({ data: { text: 'Hello Sharded Cards!' } });
        }};
      }
    };
    myFunctions.helloWorld(req as any, res as any);
  });
});

