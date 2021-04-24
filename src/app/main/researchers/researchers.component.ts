import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map, shareReplay, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { KeywordService } from 'src/app/core/keyword.service';
import { ResearcherService } from 'src/app/core/researcher.service';
import { Keyword } from 'src/app/shared/keyword';

import { Researcher } from '../../shared/researcher';
import { ResearcherDialogData } from '../researcher-dialog/researcher-dialog-data';
import { ResearcherDialogComponent } from '../researcher-dialog/researcher-dialog.component';

@Component({
  selector: 'app-researchers',
  templateUrl: './researchers.component.html',
  styleUrls: ['./researchers.component.scss']
})
export class ResearchersComponent implements OnInit, AfterViewInit, OnDestroy {
  
  private destroy$: ReplaySubject<boolean> = new ReplaySubject(1);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  approvedControl = new FormControl(false, Validators.required);

  researchers$: Observable<(Researcher & { $id: string })[]>;
  keywords$: Observable<(Keyword & { $id: string })[]>;
  dataSource: MatTableDataSource<Researcher & { $id: string }> =  new MatTableDataSource();

  displayedColumns = ['fullname_en', 'fullname_th', 'keywords']

  constructor(
    private researcherService: ResearcherService,
    private keywordsService: KeywordService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.researchers$ = this.approvedControl.valueChanges.pipe(
      startWith(false),
      switchMap(value => value ? this.researcherService.approvedResearchers$ : this.researcherService.unapprovedResearchers$),
      shareReplay(1)
    )
    this.keywords$ = this.keywordsService.keywords$;
  }

  ngAfterViewInit(): void {
    this.researchers$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(researchers => {
      this.dataSource.data = researchers
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = this.dataSourcePredicate;
      this.dataSource.paginator = this.paginator;    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  dataSourcePredicate(data: Researcher, filter: string): boolean {
    let searchTerms = JSON.parse(filter);
    return ((searchTerms.fullname_th ? data.fullname_th.toLowerCase().indexOf(searchTerms.fullname_th.toLowerCase()) !== -1 : true)
    && (searchTerms.fullname_en ? data.fullname_en.toLowerCase().indexOf(searchTerms.fullname_en.toLowerCase()) !== -1 : true))
  }

  rowClick(rowId: string) {
    const data: ResearcherDialogData = { researcherId: rowId }
    this.dialog.open(ResearcherDialogComponent, {
      data: data
    })
  }
}
