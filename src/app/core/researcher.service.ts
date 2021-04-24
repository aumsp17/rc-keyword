import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, shareReplay } from 'rxjs/operators';
import firebase from 'firebase/app';

import { Researcher } from '../shared/researcher';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResearcherService {

  researchers$: Observable<(Researcher & { $id: string })[]> = this.listResearchers().pipe(
    map(researchers => researchers.map(researcher => ({ $id: researcher.payload.doc.id, ...researcher.payload.doc.data() }))),
    shareReplay(1)
  )

  approvedResearchers$: Observable<(Researcher & { $id: string })[]> = this.listApprovedResearchers().pipe(
    map(researchers => researchers.map(researcher => ({ $id: researcher.payload.doc.id, ...researcher.payload.doc.data() }))),
    shareReplay(1)
  )

  unapprovedResearchers$: Observable<(Researcher & { $id: string })[]> = this.listUnapprovedResearchers().pipe(
    map(researchers => researchers.map(researcher => ({ $id: researcher.payload.doc.id, ...researcher.payload.doc.data() }))),
    shareReplay(1)
  )

  constructor(
    private afs: AngularFirestore
  ) { }

  listResearchers() {
    return this.afs
    .collection<Researcher>('researchers', ref => ref.where('deleted', '==', false).orderBy('fullname_en', 'asc'))
    .snapshotChanges();
  }

  listUnapprovedResearchers() {
    return this.afs
    .collection<Researcher>('researchers', ref => ref.where('deleted', '==', false).where('approved', '==', false).orderBy('fullname_en', 'asc'))
    .snapshotChanges();  
  }

  listApprovedResearchers() {
    return this.afs
    .collection<Researcher>('researchers', ref => ref.where('deleted', '==', false).where('approved', '==', true).orderBy('fullname_en', 'asc'))
    .snapshotChanges();  
  }

  getResearcher(researcherId: string) {
    return this.afs
    .collection('researchers')
    .doc<Researcher>(researcherId)
    .valueChanges();
  }

  updateResearcher(researcherId: string, data: Partial<Researcher>) {
    return this.afs
    .collection('researchers')
    .doc(researcherId)
    .update(data)
  }

  addResearcherKeyword(researcherId: string, keywordId?: number) 
  addResearcherKeyword(researcherId: string, keyword?: string)

  addResearcherKeyword(researcherId: string, keyword: any) {
    const researcherDoc = this.afs
    .collection('researchers')
    .doc(researcherId)

    if (typeof keyword == 'number') {
      return researcherDoc.update({
        keywordIds: firebase.firestore.FieldValue.arrayUnion(keyword)
      })
    } else if (typeof keyword == 'string') {
      const batch = this.afs.firestore.batch();
      const keywordRef = this.afs.collection('keywords').doc().ref
      batch.set(
        keywordRef,
        {
          keyword: keyword,
          deleted: false
        }
      )

      batch.set(
        researcherDoc.ref,
        {
          keywordIds: firebase.firestore.FieldValue.arrayUnion(keywordRef.id)
        }
      )

      return batch.commit()
    }
  }

  removeResearcherKeyword(researcherId: string, ...keywordIds: number[]) {
    return this.afs
    .collection('researchers')
    .doc(researcherId)
    .update({
      keywordIds: firebase.firestore.FieldValue.arrayRemove(keywordIds)
    })
  }

  updateResearcherKeyword(researcherId: string, oldKeywordId: number, newKeywordId: number)
  updateResearcherKeyword(researcherId: string, oldKeywordId: number, newKeyword: string)

  updateResearcherKeyword(researcherId: string, oldKeywordId: number, newKeyword: any) {
    const updateBatch = this.afs.firestore.batch();
    const researcherRef = this.afs
    .collection('researchers')
    .doc(researcherId).ref
    updateBatch.set(researcherRef, {
      keywordIds: firebase.firestore.FieldValue.arrayRemove(oldKeywordId)
    })
    if (typeof newKeyword == 'number') {
      updateBatch.set(researcherRef, {
        keywordIds: firebase.firestore.FieldValue.arrayUnion(newKeyword)
      })
    } else if (typeof newKeyword == 'string') {
      const keywordRef = this.afs.collection('keywords').doc().ref
      updateBatch.set(keywordRef, {
        keyword: newKeyword,
        deleted: false
      })
      updateBatch.set(researcherRef, {
        keywordIds: firebase.firestore.FieldValue.arrayUnion(keywordRef.id)
      })
    }
    return updateBatch.commit()
  }
}
