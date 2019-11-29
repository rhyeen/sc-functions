import sinon from 'sinon';

import { firestoreDB } from '../services/firestore';

export class FirestoreStub {
  public dbCollectionStub: any;
  public updateStub: any;
  public collectionStubData: Record<string, any>;
  public firebaseFunctionsTest: any;

  constructor(firebaseFunctionsTest: any) {
    this.dbCollectionStub = sinon.stub(firestoreDB, 'collection');
    this.collectionStubData = {};
    this.updateStub = sinon.stub();
    this.firebaseFunctionsTest = firebaseFunctionsTest;
  }

  stubCollection(collection: string):void {
    if (collection in this.collectionStubData) {
      return;
    } else {
      this.collectionStubData[collection] = {
        doc: {
          stub: sinon.stub(),
          return: {}
        },
        add: {
          stub: sinon.stub(),
          return: {}
        }
      };
    }
    this.dbCollectionStub.withArgs(collection).returns({
      // @NOTE: the reason that each collection has its own stub, is that
      // a doc name may be the same across multiple collections such as "dungeonId"
      // in dungeonseeds and dungeontags.
      doc: this.collectionStubData[collection].doc.stub,
      add: this.collectionStubData[collection].add.stub,
    });
  }

  stubSubCollection(collection: string, doc: string):void {
    this.stubCollection(collection);
    this.collectionStubData[collection].doc.return = {
      ...this.collectionStubData[collection].doc.return,
      collection: this.dbCollectionStub
    };
    this.collectionStubData[collection].doc.stub.withArgs(doc).returns(this.collectionStubData[collection].doc.return);
  }

  get(collection: string, doc: string, getSnapshotData:any):void {
    this.stubCollection(collection);
    const snapshot = this.firebaseFunctionsTest().firestore.makeDocumentSnapshot(getSnapshotData, `${collection}/${doc}`);
    this.collectionStubData[collection].doc.return = {
      ...this.collectionStubData[collection].doc.return,
      get: () => new Promise((resolve) => resolve(snapshot))
    };
    this.collectionStubData[collection].doc.stub.withArgs(doc).returns(this.collectionStubData[collection].doc.return);
  }
    
  add(collection: string, data:any, refId:string):void {
    this.stubCollection(collection);
    this.collectionStubData[collection].add.return = {
      ...this.collectionStubData[collection].add.return,
      id: refId
    };
    this.collectionStubData[collection].add.stub.withArgs(data).returns(this.collectionStubData[collection].add.return);
  }
  
  update(collection: string, doc: string, updateData:any):void {
    this.stubCollection(collection);
    this.collectionStubData[collection].doc.return = {
      ...this.collectionStubData[collection].doc.return,
      update: this.updateStub
    };
    this.collectionStubData[collection].doc.stub.withArgs(doc).returns(this.collectionStubData[collection].doc.return);
    // @NOTE: that the reason there doesn't need to be more than one updateStub is that
    // update always just returns a resolved promise, no matter the collection/docs/updateData.
    this.updateStub.withArgs(updateData).returns(new Promise((resolve) => resolve()));
  }

  restore():void {
    this.dbCollectionStub.restore();
  }
}