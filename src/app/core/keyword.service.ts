import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, shareReplay } from 'rxjs/operators';
import firebase from 'firebase/app';

import { Researcher } from '../shared/researcher';
import { Observable } from 'rxjs';
import { Keyword } from '../shared/keyword';

@Injectable({
  providedIn: 'root'
})
export class KeywordService {


  keywords$: Observable<(Keyword & { $id: string })[]> = this.listKeywords().pipe(
    map(keywords => keywords.map(keyword => ({ $id: keyword.payload.doc.id, ...keyword.payload.doc.data() })))
  )

  constructor(
    private afs: AngularFirestore
  ) { }

  listKeywords() {
    return this.afs
    .collection<Keyword>('keywords', ref => ref.where('deleted', '==', false).orderBy('keyword'))
    .snapshotChanges();
  }

  getKeyword(keywordId: string) {
    return this.afs
    .collection('keywords')
    .doc<Keyword>(keywordId)
    .valueChanges();
  }

  addKeyword(keyword: Keyword) {
    return this.afs
    .collection<Keyword>('keywords')
    .add({
      ...keyword,
      deleted: false
    })
  }

  updateKeywords(keywordId: string, data: Partial<Keyword>) {
    return this.afs
    .collection('keywords')
    .doc<Keyword>(keywordId)
    .update(data)
  }
}
