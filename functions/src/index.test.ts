import admin from 'firebase-admin';
import sinon from 'sinon';
import firebaseFunctionsTest from 'firebase-functions-test';

let adminInitStub, myFunctions;

beforeEach(() => {
  myFunctions = require('./index');
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

describe('newGame', () => {
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
    myFunctions.newGame(req as any, res as any);
  });
});
