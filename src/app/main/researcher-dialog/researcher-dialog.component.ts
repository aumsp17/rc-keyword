import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MatChip, MatChipList } from '@angular/material/chips';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { KeywordService } from 'src/app/core/keyword.service';
import { ResearcherService } from 'src/app/core/researcher.service';
import { Keyword } from 'src/app/shared/keyword';
import { Researcher } from 'src/app/shared/researcher';
import { ResearcherDialogData } from './researcher-dialog-data';

@Component({
  selector: 'app-researcher-dialog',
  templateUrl: './researcher-dialog.component.html',
  styleUrls: ['./researcher-dialog.component.scss'],
})
export class ResearcherDialogComponent implements OnInit {
  @ViewChild(MatChipList) chipList: MatChipList;

  keywords$: Observable<(Keyword & { $id: string })[]>;
  researcher$: Observable<Researcher>;

  editKeywordControl = new FormControl('');
  addKeywordControl = new FormControl('');

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ResearcherDialogData,
    private researcherService: ResearcherService,
    private keywordService: KeywordService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.keywords$ = this.keywordService.keywords$;
    this.researcher$ = this.researcherService
      .getResearcher(this.data.researcherId)
      .pipe(shareReplay(1));
  }

  update() {
    if (this.editKeywordControl.value) {
      if (this.chipList.selected) {
        this.keywords$
          .pipe(
            take(1),
            map((keywords) => {
              if (
                keywords.find(
                  (keyword) => keyword.keyword === this.editKeywordControl.value
                )
              ) {
                return this.researcherService.updateResearcherKeyword(
                  this.data.researcherId,
                  (this.chipList.selected as MatChip).value,
                  keywords.findIndex(
                    (keyword) =>
                      keyword.keyword === this.editKeywordControl.value
                  )
                );
              } else {
                return this.researcherService.updateResearcherKeyword(
                  this.data.researcherId,
                  (this.chipList.selected as MatChip).value,
                  this.editKeywordControl.value
                );
              }
            })
          )
          .toPromise()
          .then(() => {
            this.snackBar.open('Keyword updated', 'Dismiss', {
              duration: 3000,
            });
            this.editKeywordControl.reset();
          })
          .catch((e) => {
            this.snackBar.open(`Error: ${e}`, 'Dismiss', {
              duration: 7000,
            });
          });
      } else {
        this.snackBar.open('Please select the keyword to edit', 'Dismiss', {
          duration: 5000,
        });
      }
    } else {
      this.snackBar.open('Please enter the keyword', 'Dismiss', {
        duration: 5000,
      });
    }
  }

  add() {
    if (this.addKeywordControl.value) {
      this.keywords$
        .pipe(
          take(1),
          map((keywords) => {
            if (
              keywords.find(
                (keyword) => keyword.keyword === this.addKeywordControl.value
              )
            ) {
              return this.researcherService.addResearcherKeyword(
                this.data.researcherId,
                keywords.findIndex(
                  (keyword) => keyword.keyword === this.addKeywordControl.value
                )
              );
            } else {
              return this.researcherService.addResearcherKeyword(
                this.data.researcherId,
                this.addKeywordControl.value
              );
            }
          })
        )
        .toPromise()
        .then(() => {
          this.addKeywordControl.reset();
          this.snackBar.open('Keyword added', 'Dismiss', {
            duration: 3000,
          });
        })
        .catch((e) => {
          this.snackBar.open(`Error: ${e}`, 'Dismiss', {
            duration: 7000,
          });
          console.log(e);
        });
    } else {
      this.snackBar.open('Please enter the keyword', 'Dismiss', {
        duration: 5000,
      });
    }
  }

  remove(keywordId: number) {
    this.researcherService
      .removeResearcherKeyword(this.data.researcherId, keywordId)
      .then(() => {
        this.snackBar.open('Keyword removed', 'Dismiss', {
          duration: 3000,
        });
      })
      .catch((e) => {
        this.snackBar.open(`Error: ${e}`, 'Dismiss', {
          duration: 7000,
        });
        console.log(e);
      });
  }
}
