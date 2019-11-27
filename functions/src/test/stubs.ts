import sinon from 'sinon';

import { firestoreDB } from '../services/firestore';

export class FirestoreStub {
  public dbCollectionStub: any;
  public docsStub: any;
  public addStub: any;
  public updateStub: any;
  public firebaseFunctionsTest: any;

  constructor(firebaseFunctionsTest: any) {
    this.dbCollectionStub = sinon.stub(firestoreDB, 'collection');
    this.docsStub = sinon.stub();
    this.addStub = sinon.stub();
    this.updateStub = sinon.stub();
    this.firebaseFunctionsTest = firebaseFunctionsTest;
  }


  get(collection: string, doc: string, getSnapshotData:any):void {
    this.dbCollectionStub.withArgs(collection).returns({
      doc: this.docsStub
    });
    const snapshot = this.firebaseFunctionsTest().firestore.makeDocumentSnapshot(getSnapshotData, `${collection}/${doc}`);
    this.docsStub.withArgs(doc).returns({
      get: () => new Promise((resolve) => resolve(snapshot))
    });
  }
    
  add(collection: string, data:any, refId:string):void {
    this.dbCollectionStub.withArgs(collection).returns({
      add: this.addStub
    });
    this.addStub.withArgs(data).returns({
      id: refId
    });
  }
  
  update(collection: string, doc: string, updateData:any):void {
    this.dbCollectionStub.withArgs(collection).returns({
      doc: this.docsStub
    });
    this.docsStub.withArgs(doc).returns({
      update: this.updateStub
    });
    this.updateStub.withArgs(updateData).returns(new Promise((resolve) => resolve()));
  }
}

  